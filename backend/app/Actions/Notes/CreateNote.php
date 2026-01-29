<?php

namespace App\Actions\Notes;

use App\DTOs\Notes\NoteData;
use App\Contracts\Notes\Notesable;

class CreateNote
{
    public function __invoke(NoteData $data, Notesable $model)
    {
        return $model->notes()->create([
            'note' => $data->note,
        ]);
    }
}
