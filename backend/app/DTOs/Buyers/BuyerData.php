<?php

namespace App\DTOs\Buyers;

class BuyerData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $companyName,
        public string $country,
        public ?string $phone = null
    ) {}

    /**
     * @param array{name:string,email:string,company_name:string,country:string,phone?:string|null} $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            companyName: $data['company_name'],
            country: $data['country'],
            phone: $data['phone'] ?? null
        );
    }
}
