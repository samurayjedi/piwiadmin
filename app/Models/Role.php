<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\AuthorizedUser;

class Role extends Model {
    use HasFactory;

    protected $casts = [
        'capabilities' => 'array',
    ];

    public function authorized_users(): HasMany {
        return $this->hasMany(AuthorizedUser::class);
    }
}
