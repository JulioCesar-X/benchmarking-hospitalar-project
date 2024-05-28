<?php

namespace Modules\Activity\Entities;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'activity_name',
    ];


    public function serviceActivityIndicators()
    {
        return $this->hasMany('Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator');
    }
}
