<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\HasUuid;

class FabricBarcode extends Model
{
    use HasUuid;
    protected $fillable = ['fabric_id', 'barcode_value'];

    public function fabric(): BelongsTo
    {
        return $this->belongsTo(Fabric::class);
    }
}
