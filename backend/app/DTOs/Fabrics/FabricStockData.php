<?php

namespace App\DTOs\Fabrics;

class FabricStockData
{
    public function __construct(
        public string $fabricId,
        public string $type,
        public float $quantity,
        public ?string $reference
    ) {}

    /**
     * @param array{fabric_id:string,type:string,quantity:float|int,reference?:string|null} $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            fabricId: $data['fabric_id'],
            type: $data['type'],
            quantity: (float) $data['quantity'],
            reference: $data['reference'] ?? null
        );
    }
}
