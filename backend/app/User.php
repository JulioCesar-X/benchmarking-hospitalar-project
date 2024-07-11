<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at'
    ];

    protected $hidden = [
        'pivot',
        'password',
        'remember_token'
    ];

    public function roles()
    {
        return $this->belongsToMany('App\Role');
    }

    public function hasRole($roleName)
    {
        return $this->roles()->where('role_name', $roleName)->exists();
    }

    public function sentNotifications()
    {
        return $this->hasMany('App\Notification', 'sender_id');
    }

    public function receivedNotifications()
    {
        return $this->hasMany('App\Notification', 'receiver_id');
    }
}