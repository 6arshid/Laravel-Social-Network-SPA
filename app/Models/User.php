<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserPage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'avatar', 'cover','google_id','bio','location','website',
        'phone','instagram','twitter','facebook','linkedin',
        'github','tiktok','snapchat','youtube','pinterest',
        'whatsapp','telegram','is_admin','verify','disable_notifications',
        'is_private'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'disable_notifications' => 'boolean',
            'is_private' => 'boolean',

        ];
    }

    public function getRouteKeyName() { return 'username'; }
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function pages()
    {
        return $this->hasMany(UserPage::class);
    }
    public function followings()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id');
    }

    // public function followers()
    // {
    //     return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id');
    // }

    public function isFollowing(User $user)
    {
        return $this->followings->contains($user->id);
    }
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
                    ->withTimestamps()
                    ->wherePivot('accepted', true);
    }

    public function followRequests()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
                    ->withTimestamps()
                    ->wherePivot('accepted', false);
    }
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
                    ->withTimestamps();
    }

    public function blocks()
    {
        return $this->belongsToMany(User::class, 'blocks', 'user_id', 'blocked_id')
            ->withTimestamps();
    }

    public function blockedBy()
    {
        return $this->belongsToMany(User::class, 'blocks', 'blocked_id', 'user_id')
            ->withTimestamps();
    }

    public function hasBlocked(User $user)
    {
        return $this->blocks()->where('blocked_id', $user->id)->exists();
    }

    public function isBlockedBy(User $user)
    {
        return $this->blockedBy()->where('user_id', $user->id)->exists();
    }

    public function blockedIds()
    {
        return $this->blocks()->pluck('users.id');
    }

    public function blockedByIds()
    {
        return $this->blockedBy()->pluck('users.id');
    }




}
