<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceActivityIndicators extends Model
{
    use SoftDeletes;

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

}
