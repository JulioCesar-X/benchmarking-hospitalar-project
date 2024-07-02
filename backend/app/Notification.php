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
    // Relacionamento com o usuário remetente
    public function sender()
    {
        return $this->belongsTo('App\User', 'sender_id');
    }

    // Relacionamento com o usuário destinatário
    public function receiver()
    {
        return $this->belongsTo('App\User', 'receiver_id');
    }
}
