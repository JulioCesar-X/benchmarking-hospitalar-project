<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

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

    public function hasRole($role)
    {
        return $this->roles()->where('role_name', $role)->exists();
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
