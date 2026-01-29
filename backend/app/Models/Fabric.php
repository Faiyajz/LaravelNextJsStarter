<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasUuid;

/**
 * @property string|null $added_by
 * @property string|null $updated_by
 * @property float|null $qty
 * @property string|null $image_path
 * @property float|null $available_balance
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Fabric search(?string $search)
 * @method static \Illuminate\Database\Eloquent\Builder|Fabric filter(array $filters)
 */
class Fabric extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $fillable = [
        'supplier_id',
        'fabric_no',
        'composition',
        'gsm',
        'qty',
        'cuttable_width',
        'production_type',
        'construction',
        'color_pantone_code',
        'weave_type',
        'finish_type',
        'dyeing_method',
        'printing_method',
        'lead_time',
        'moq',
        'shrinkage_percent',
        'remarks',
        'fabric_selected_by',
        'image_path',
        'added_by',
        'updated_by',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(FabricStock::class);
    }

    public function barcodes(): HasMany
    {
        return $this->hasMany(FabricBarcode::class);
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'noteable');
    }

    protected static function booted(): void
    {
        static::creating(function (self $fabric) {

            if (Auth::check()) {
                $fabric->added_by = Auth::id();
            }
        });

        static::updating(function (self $fabric) {
            if (Auth::check()) {
                $fabric->updated_by = Auth::id();
            }
        });
    }

    // Mutator: uppercase Fabric No
    protected function fabricNo(): Attribute
    {
        return Attribute::make(
            set: fn($value) => strtoupper(trim($value))
        );
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) return $query;

        return $query->where(function ($q) use ($search) {
            $q->where('fabric_no', 'like', "%{$search}%")
                ->orWhere('composition', 'like', "%{$search}%")
                ->orWhere('production_type', 'like', "%{$search}%")
                ->orWhereHas('supplier', fn($sq) => $sq->where('company_name', 'like', "%{$search}%"));
        });
    }

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['supplier'] ?? null, function ($q, $v) {
                $q->whereHas('supplier', fn($sq) => $sq->where('company_name', 'like', "%{$v}%"));
            })
            ->when($filters['fabric_no'] ?? null, fn($q, $v) => $q->where('fabric_no', 'like', "%{$v}%"))
            ->when($filters['composition'] ?? null, fn($q, $v) => $q->where('composition', 'like', "%{$v}%"))
            ->when($filters['production_type'] ?? null, fn($q, $v) => $q->where('production_type', $v));
    }
}
