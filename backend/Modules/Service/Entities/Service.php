<?php

namespace Modules\Service\Entities;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'service_name',
        'description',
        'imageUrl'
    ];



    public function serviceActivityIndicators()
    {
        return $this->hasMany('Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator');
    }
}
