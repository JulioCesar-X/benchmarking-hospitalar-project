<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'title',
        'message'
    ];
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
