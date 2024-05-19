<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public function Notications()
    {
        return $this->hasMany(Notications::class);
    }

    public function Roles(){
        return $this->belongsToMany(Role::class);
    }

    public function tokens()
    {
        return $this->hasMany(Personal_Acces::class);
    }
}