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
use App\Models\AuthorizedUser;
use App\Models\PaydeskSession;

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

    public function paydesk_sessions(): HasMany {
        return $this->hasMany(PaydeskSession::class);
    }

    public function cuts(): HasMany {
        return $this->hasMany(PaydeskPartialCut::class);
    }

    public function hasPermission(string $permission) {
        if ($this->id === 1) {
            return true;
        }
        $au = AuthorizedUser::with('role')
            ->where('email', $this->email)->first();
        if ($au) {
            $capabilities = json_decode($au->role->capabilities);

            return in_array($permission, $capabilities);
        }
        
        return false;
    }
}
