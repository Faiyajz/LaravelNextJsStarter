<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasUuid;

/**
 * @property string|null $created_by
 */
class FabricStock extends Model
{
    use HasFactory, HasUuid;
    protected $fillable = ['fabric_id', 'type', 'quantity', 'reference', 'created_by'];

    public function fabric(): BelongsTo
    {
        return $this->belongsTo(Fabric::class);
    }

    protected static function booted(): void
    {
        static::creating(function (self $stock) {
            if (empty($stock->created_by) && Auth::check()) {
                $stock->created_by = Auth::id();
            }
        });
    }
}
