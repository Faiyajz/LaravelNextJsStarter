<?php

namespace App\Contracts\Notes;

use Illuminate\Database\Eloquent\Relations\MorphMany;

interface Notesable
{
    public function notes(): MorphMany;
}
