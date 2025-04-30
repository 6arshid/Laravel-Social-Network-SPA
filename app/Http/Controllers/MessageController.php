<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use App\Helpers\NotificationHelper;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $auth = auth()->user();
        $search = $request->search;
    
        $messagesQuery = Message::with('sender', 'receiver')
            ->where(function ($q) use ($auth) {
                $q->where('sender_id', $auth->id)
                  ->orWhere('receiver_id', $auth->id);
            })
            ->latest();
    
        $messages = $messagesQuery->get();
    
        $chats = $messages->groupBy(function ($msg) use ($auth) {
            return $msg->sender_id === $auth->id ? $msg->receiver_id : $msg->sender_id;
        })->map(function ($groupedMessages) {
            return $groupedMessages->sortByDesc('created_at')->values();
        });
    
        // === Search Logic ===
        if ($request->filled('search')) {
            $matchedUsers = User::where('id', '!=', $auth->id)
                ->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })->get();
    
            foreach ($matchedUsers as $user) {
                if (!$chats->has($user->id)) {
                    $placeholder = new Message([
                        'id' => 'search-placeholder-' . $user->id,
                        'sender_id' => $auth->id,
                        'receiver_id' => $user->id,
                        'content' => null,
                        'created_at' => now(),
                    ]);
                    $placeholder->setRelation('sender', $auth);
                    $placeholder->setRelation('receiver', $user);
                    $chats->put($user->id, collect([$placeholder]));
                }
            }
    
            // Limit display to matched users only
            $chats = $chats->filter(function ($messages, $userId) use ($matchedUsers) {
                return $matchedUsers->pluck('id')->contains($userId);
            });
        }
    
        return Inertia::render('Chat/Index', [
            'chats' => $chats,
            'search' => $search,
        ]);
    }
    
    public function show(User $user)
    {
        $authUser = auth()->user();

        $messages = Message::where(function($query) use ($user, $authUser) {
            $query->where('sender_id', $authUser->id)
                  ->where('receiver_id', $user->id);
        })->orWhere(function($query) use ($user, $authUser) {
            $query->where('sender_id', $user->id)
                  ->where('receiver_id', $authUser->id);
        })->orderBy('created_at', 'desc')->get();

        return Inertia::render('Chat/ChatRoom', [
            'user' => $user,
            'messages' => $messages
        ]);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'room_name' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'file' => 'nullable|mimetypes:image/jpeg,image/png,image/gif,video/mp4,video/quicktime,audio/webm,video/webm|max:'. env('MAX_UPLOAD_SIZE'),
        ]);
    
        $data['sender_id'] = auth()->id();
    
        // اگر فایل ارسال شده
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('chat_uploads', 'public');
        }
    
        // اگر چت گروهی است => حذف receiver_id
        if (!empty($data['room_name'])) {
            unset($data['receiver_id']); // 👈 حذف از دیتابیس
        }
    
        $message = Message::create($data);
    
        // اگر چت خصوصی است → redirect به chat.show
        if (!empty($data['receiver_id'])) {
            $receiver = User::findOrFail($data['receiver_id']);
            if ($receiver->id !== auth()->id()) {
                NotificationHelper::send(
                    $receiver->id,
                    auth()->user()->name . ' sent you a new message.',
                    route('chat.show', ['user' => auth()->user()->id])
                );
            }
            return Inertia::location(route('chat.show', ['user' => $receiver->id]));
        }
    
        // اگر چت گروهی است → redirect به صفحه گروه
        if (!empty($data['room_name'])) {
            return Inertia::location(route('placechat', ['name' => $data['room_name']]));
        }
    
        return back()->withErrors(['error' => 'Invalid chat destination.']);
    }
    

    public function fetchJson(User $user)
    {
        $authUser = auth()->user();
    
        $messages = Message::with(['sender', 'receiver', 'reactions']) // 👈 اضافه شد
            ->where(function ($query) use ($user, $authUser) {
                $query->where('sender_id', $authUser->id)
                      ->where('receiver_id', $user->id);
            })->orWhere(function ($query) use ($user, $authUser) {
                $query->where('sender_id', $user->id)
                      ->where('receiver_id', $authUser->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    
        // واکنش‌ها رو برای هر پیام مرتب کنیم (اختیاری)
        $messages->each(function ($message) {
            $message->reactions->sortBy('created_at');
        });
    
        // چک وضعیت seen آخرین پیام ارسالی
        $lastSent = $messages->firstWhere('sender_id', $authUser->id);
        $seen = $lastSent ? (bool) $lastSent->is_seen : false;
    
        return response()->json([
            'messages' => $messages,
            'seen' => $seen,
        ]);
    }
    

    public function update(Request $request, Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $message->update([
            'content' => $validated['content'],
            'is_edited' => true,
        ]);

        return response()->noContent();
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            abort(403);
        }

        // If there is a file, delete it from storage
        if ($message->file_path && Storage::disk('public')->exists($message->file_path)) {
            Storage::disk('public')->delete($message->file_path);
        }

        // Soft delete: only remove content and file path
        $message->update([
            'content' => '(message deleted)',
            'file_path' => null,
        ]);

        return response()->noContent();
    }

    public function markSeen(User $user)
    {
        Message::where('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->where('is_seen', false)
            ->update(['is_seen' => true]);

        return response()->noContent();
    }
        public function placechat($name)
    {
        $messages = Message::where('room_name', $name)->with(['sender', 'reactions'])->latest()->take(50)->get()->reverse()->values();
        return Inertia::render('Chat/ChatRoomPublic', [
            'room_name' => $name,
            'messages' => $messages,
            'user' => auth()->user(),
        ]);
    }

    public function placechatJson($name)
    {
        $messages = Message::where('room_name', $name)->with(['sender', 'reactions'])->latest()->take(50)->get()->reverse()->values();
        return response()->json([
            'messages' => $messages,
        ]);
    }
}
