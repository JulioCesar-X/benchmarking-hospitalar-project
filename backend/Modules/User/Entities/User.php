<?php

namespace Modules\User\Entities;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

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

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function hasRole($roleName)
    {
        return $this->roles->contains('role_name', $roleName);
    }

    public function sentNotifications()
    {
        return $this->hasMany('Modules\Notification\Entities\Notification', 'sender_id');
    }

    // Relacionamento com as notificações recebidas
    public function receivedNotifications()
    {
        return $this->hasMany('Modules\Notification\Entities\Notification', 'receiver_id');
    }

    public function roles(){
        return $this->belongsToMany('Modules\Role\Entities\Role');
    }
}
