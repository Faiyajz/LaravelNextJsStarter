<?php

namespace App\Enums;

enum StockType: string
{
    case IN = 'IN';
    case OUT = 'OUT';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
