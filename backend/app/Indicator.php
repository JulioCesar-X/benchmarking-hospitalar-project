<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Indicator extends Model
{
    use SoftDeletes;

    public function ServiceActivityIndicator()
    {
        return $this->hasMany(ServiceActivityIndicator::class);
    }

}
