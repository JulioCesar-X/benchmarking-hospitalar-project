<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    
    public function ServiceActivityIndicator()
    {
        return $this->belongsTo('App\ServiceActivityIndicator');
    }
}
