<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $fillable = [
        'date',
        'value',
        'service_activity_indicator_id'
    ];

    public function serviceActivityIndicator()
    {
        return $this->belongsTo('App\ServiceActivityIndicators');
    }
}
