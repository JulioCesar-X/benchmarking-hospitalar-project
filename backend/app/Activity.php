<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{

    protected $fillable = [
        'activity_name',
    ];


    public function sais()
    {
        return $this->hasMany('App\Sai');
    }
}
