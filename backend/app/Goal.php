<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{

    protected $fillable = [
        'year',
        'target_value',
        'service_activity_goal_id'
    ];

    public function serviceActivityIndicator()
    {
        return $this->belongsTo('App\ServiceActivityIndicator');
    }
}
