<?php

namespace App\DTOs\Auth;

class RegisterData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $accountType = null,
        public ?string $companyName = null,
        public ?string $country = null,
        public ?string $phone = null
    ) {}

    /**
     * @param array{name:string,email:string,password:string,account_type?:string,company_name?:string,country?:string,phone?:string} $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            accountType: $data['account_type'] ?? null,
            companyName: $data['company_name'] ?? null,
            country: $data['country'] ?? null,
            phone: $data['phone'] ?? null
        );
    }
}
