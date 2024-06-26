<?php

namespace Modules\Indicator\Entities;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $fillable = [
        'indicator_name',
    ];


    public function serviceActivityIndicators()
    {
        return $this->hasMany('Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator');
    }

}
