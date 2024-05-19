<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    public function ServiceActivityIndicator()
    {
        return $this->hasMany(ServiceActivityIndicator::class);
    }
}
