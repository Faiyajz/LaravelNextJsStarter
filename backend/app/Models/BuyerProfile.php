<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerProfile extends Model
{
    /** @use HasFactory<\Database\Factories\BuyerProfileFactory> */
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'company_name',
        'country',
        'phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
