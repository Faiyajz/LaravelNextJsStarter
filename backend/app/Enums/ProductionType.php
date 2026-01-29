<?php

namespace App\Enums;

enum ProductionType: string
{
    case SAMPLE_YARDAGE = 'Sample Yardage';
    case SMS = 'SMS';
    case BULK = 'Bulk';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
