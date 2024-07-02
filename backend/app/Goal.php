<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'year',
        'target_value',
        'sai_id'
    ];

    public function sai()
    {
        return $this->belongsTo('App\Sai');
    }
}
