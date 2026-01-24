<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Sale;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, CanResetPassword, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'google_account_linked' => 'boolean',
        ];
    }

    public function delete()
    {
        $this->google_account_linked = false;
        $this->save();
        
        return parent::delete();
    }

    /**
     * Hard deletes
     */
    public function forceDelete()
    {
        $this->google_account_linked = false;
        $this->save();
        
        return parent::forceDelete();
    }

    // Bulk operations
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            $user->google_account_linked = false;
        });
    }

    public function sales(): HasMany {
        return $this->hasMany(Sale::class);
    }
}
