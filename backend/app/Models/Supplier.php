<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasUuid;

/**
 * @property string|null $added_by
 * @property string|null $updated_by
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Supplier search(?string $search)
 * @method static \Illuminate\Database\Eloquent\Builder|Supplier filter(array $filters)
 */
class Supplier extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $fillable = [
        'country',
        'company_name',
        'code',
        'email',
        'phone',
        'address',
        'representative_name',
        'representative_email',
        'representative_phone',
        'added_by',
        'updated_by',
    ];

    public function fabrics(): HasMany
    {
        return $this->hasMany(Fabric::class);
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'noteable');
    }

    protected static function booted(): void
    {
        static::creating(function (self $supplier) {
            if (Auth::check()) {
                $supplier->added_by = Auth::id();
            }
        });

        static::updating(function (self $supplier) {
            if (Auth::check()) {
                $supplier->updated_by = Auth::id();
            }
        });
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('company_name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('country', 'like', "%{$search}%")
                ->orWhere('representative_name', 'like', "%{$search}%")
                ->orWhere('representative_email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        });
    }

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['country'] ?? null, fn($q, $v) => $q->where('country', $v))
            ->when($filters['company_name'] ?? null, fn($q, $v) => $q->where('company_name', 'like', "%{$v}%"))
            ->when($filters['representative_name'] ?? null, fn($q, $v) => $q->where('representative_name', 'like', "%{$v}%"))
            ->when($filters['date_from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v));
    }
}
