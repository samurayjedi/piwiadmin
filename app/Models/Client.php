<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Sale;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    public function sales(): HasMany {
        return $this->hasMany(Sale::class);
    }
}
