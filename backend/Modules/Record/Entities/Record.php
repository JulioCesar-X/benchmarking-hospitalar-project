<?php

namespace Modules\Record\Entities;

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
        return $this->belongsTo('Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator');
    }
}
