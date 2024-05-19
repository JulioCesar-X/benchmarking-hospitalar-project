<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use SoftDeletes;

    public function ServiceActivityIndicator()
    {
        return $this->belongsTo(ServiceActivityIndicator::class);
    }
}
