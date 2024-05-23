<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password'
    ];

    protected $hidden = [
        'pivot',
        'password',
        'remember_token'
    ];

    public function hasRole($roleName)
    {
        return $this->roles->contains('role_name', $roleName);
    }

    // Relacionamento com as notificações enviadas
    public function sentNotifications()
    {
        return $this->hasMany('App\Notification', 'sender_id');
    }

    // Relacionamento com as notificações recebidas
    public function receivedNotifications()
    {
        return $this->hasMany('App\Notification', 'receiver_id');
    }

    public function roles(){
        return $this->belongsToMany('App\Role');
    }
}
