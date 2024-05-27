<?php

namespace Modules\Role\Entities;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'role_name',
    ];

    protected $hidden = ['pivot'];

    public function users(){
        return $this->belongsToMany('Modules\User\Entities\User');
    }
}
