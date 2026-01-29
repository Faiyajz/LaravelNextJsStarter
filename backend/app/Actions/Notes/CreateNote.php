<?php

namespace App\Actions\Notes;

use App\DTOs\Notes\NoteData;
use Illuminate\Database\Eloquent\Model;

class CreateNote
{
    public function __invoke(NoteData $data, Model $model)
    {
        return $model->notes()->create([
            'note' => $data->note,
        ]);
    }
}
