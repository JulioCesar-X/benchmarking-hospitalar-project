<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    use SoftDeletes;

    public function ServiceActivityIndicator()
    {
        return $this->belongsTo(ServiceActivityIndicator::class);
    }
}
