<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $fillable = [
        'indicator_name',
    ];


    public function sais()
    {
        return $this->hasMany('App\Sai');
    }
}
