<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password'
    ];

    protected $hidden = ['pivot'];

    public function notifications()
    {
        return $this->hasMany('App\Notification');
    }

    public function roles(){
        return $this->belongsToMany('App\Role');
    }

    public function tokens()
    {
        return $this->hasMany('App\Token');
    }
}
