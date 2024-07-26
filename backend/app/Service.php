<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'service_name',
        'description',
        'image_url',
        'more_info',
        'order'
    ];

    public function sais()
    {
        return $this->hasMany('App\Sai');
    }
}
