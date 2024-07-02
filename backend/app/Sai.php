<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sai extends Model
{
    protected $fillable = [
        'service_id',
        'activity_id',
        'indicator_id',
        'type',
    ];

    public function goals()
    {
        return $this->hasMany('App\Goal');
    }

    public function records()
    {
        return $this->hasMany('App\Record');
    }

    public function service()
    {
        return $this->belongsTo('App\Service');
    }

    public function indicator()
    {
        return $this->belongsTo('App\Indicator');
    }

    public function activity()
    {
        return $this->belongsTo('App\Activity');
    }
}
