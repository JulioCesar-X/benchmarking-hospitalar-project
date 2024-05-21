<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $fillable = [
        'indicator_name',
    ];


    public function serviceActivityIndicators()
    {
        return $this->hasMany('App\ServiceActivityIndicator');
    }

}
