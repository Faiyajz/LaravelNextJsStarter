<?php

namespace App\Actions\Fabrics;

use App\DTOs\Fabrics\FabricData;
use App\Models\Fabric;
use App\Services\Fabrics\FabricService;
use Illuminate\Http\UploadedFile;

class UpdateFabric
{
    public function __construct(private FabricService $fabricService) {}

    public function __invoke(Fabric $fabric, FabricData $data, ?UploadedFile $image): Fabric
    {
        return $this->fabricService->updateFabric($fabric, $data->toArray(), $image);
    }
}
