<?php

namespace Modules\ServiceActivityIndicator\Entities;

use Illuminate\Database\Eloquent\Model;

class ServiceActivityIndicator extends Model
{

    protected $fillable = [
        'service_id',
        'activity_id',
        'indicator_id',
        'type',
    ];

    public function goals()
    {
        return $this->hasMany('Modules\Goal\Entities\Goal');
    }

    public function records()
    {
        return $this->hasMany('Modules\Record\Entities\Record');
    }

    public function service()
    {
        return $this->belongsTo('Modules\Service\Entities\Service');
    }

    public function indicator()
    {
        return $this->belongsTo('Modules\Indicator\Entities\Indicator');
    }

    public function activity()
    {
        return $this->belongsTo('Modules\Activity\Entities\Activity');
    }

}
