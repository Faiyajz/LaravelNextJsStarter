<?php

namespace App\Actions\Fabrics;

use App\DTOs\Fabrics\FabricData;
use App\Models\Fabric;
use App\Services\Fabrics\FabricService;
use Illuminate\Http\UploadedFile;

class CreateFabric
{
    public function __construct(private FabricService $fabricService) {}

    public function __invoke(FabricData $data, ?UploadedFile $image): Fabric
    {
        return $this->fabricService->createWithDefaultBarcode($data->toArray(), $image);
    }
}
