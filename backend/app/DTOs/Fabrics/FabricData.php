<?php

namespace App\DTOs\Fabrics;

class FabricData
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(public array $data) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return $this->data;
    }
}
