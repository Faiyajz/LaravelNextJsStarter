<?php

namespace App\Http\Controllers\Api\Buyers;

use App\DTOs\Buyers\BuyerData;
use App\DTOs\Buyers\BuyerFilterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Buyers\BuyerUpdateRequest;
use App\Models\BuyerProfile;
use App\Services\Buyers\BuyerService;
use App\Support\ApiResponse;

class BuyerController extends Controller
{
    public function __construct(
        private readonly BuyerService $buyerService
    ) {}

    public function index()
    {
        $this->authorize('viewAny', BuyerProfile::class);

        return ApiResponse::paginated(
            $this->buyerService->paginate(BuyerFilterData::fromRequest(request()))
        );
    }

    public function show(BuyerProfile $buyer)
    {
        $this->authorize('view', $buyer);

        return ApiResponse::data($buyer->load('user'));
    }

    public function update(BuyerUpdateRequest $request, BuyerProfile $buyer)
    {
        $this->authorize('update', $buyer);

        $updated = $this->buyerService->update(
            $buyer,
            BuyerData::fromArray($request->validated())
        );

        return ApiResponse::data($updated, 'Buyer updated.');
    }

    public function destroy(BuyerProfile $buyer)
    {
        $this->authorize('delete', $buyer);

        $this->buyerService->delete($buyer);

        return ApiResponse::data(null, 'Buyer deleted.');
    }
}
