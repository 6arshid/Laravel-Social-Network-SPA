<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminBaseController extends Controller
{
    public function index(){
        return inertia('Admin/Index');
    }
    public function userList(Request $request)
    {
        $search = $request->input('search');
    
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest() 
            ->paginate(10)
            ->withQueryString();
    
        return inertia('Admin/UserList', [
            'users' => $users,
            'filters' => ['search' => $search],
        ]);
    }
    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('message', 'User and related data deleted successfully.');
    }

    public function makeAdmin($id)
    {
        $user = User::findOrFail($id);
        $user->is_admin = true;
        $user->save();

        return back()->with('message', 'User is now an admin.');
    }
}
