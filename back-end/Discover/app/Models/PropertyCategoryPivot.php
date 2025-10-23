<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyCategoryPivot extends Model
{
    protected $table = 'property_category_pivot';

    protected $fillable = [
        'property_id',
        'property_category_id',
    ];
}
