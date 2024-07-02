<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $fillable = [
        'date',
        'value',
        'sai_id'
    ];

    public function sai()
    {
        return $this->belongsTo('App\Sai');
    }
}
