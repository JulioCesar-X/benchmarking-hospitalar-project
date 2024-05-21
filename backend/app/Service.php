<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'service_name',
    ];



    public function serviceActivityIndicators()
    {
        return $this->hasMany('App\ServiceActivityIndicator');
    }
}
