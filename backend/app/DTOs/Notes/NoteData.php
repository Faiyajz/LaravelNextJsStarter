<?php

namespace App\DTOs\Notes;

class NoteData
{
    public function __construct(
        public string $note,
        public string $noteableType,
        public string $noteableId
    ) {}

    /**
     * @param array{note:string,noteable_type:string,noteable_id:string} $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            note: $data['note'],
            noteableType: $data['noteable_type'],
            noteableId: $data['noteable_id']
        );
    }
}
