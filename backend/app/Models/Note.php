<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasUuid;

/**
 * @property string|null $created_by
 */
class Note extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = ['note', 'created_by'];

    public function noteable(): MorphTo
    {
        return $this->morphTo();
    }

    protected static function booted(): void
    {
        static::creating(function (self $note) {
            if (empty($note->created_by) && Auth::check()) {
                $note->created_by = Auth::id();
            }
        });
    }
}
