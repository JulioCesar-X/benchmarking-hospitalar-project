<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use SoftDeletes;

    public function ServiceActivityIndicator()
    {
        return $this->hasMany(ServiceActivityIndicator::class);
    }
}
