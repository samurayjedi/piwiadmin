<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Role;

class AuthorizedUser extends Model
{
    use HasFactory;

    public function role(): BelongsTo {
        return $this->belongsTo(Role::class, 'role_slug', 'slug');
    }
}
