<?php

namespace App\Http\Controllers\Api\Notes;

use App\Http\Controllers\Controller;
use App\Actions\Notes\CreateNote;
use App\DTOs\Notes\NoteData;
use App\Http\Requests\Notes\NoteStoreRequest;
use App\Models\Fabric;
use App\Models\Supplier;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NoteStoreRequest $request)
    {
        $data = NoteData::fromArray($request->validated());

        if ($data->noteableType === 'supplier') {
            $model = Supplier::query()->findOrFail($data->noteableId);
            $this->authorize('notes.create.supplier');
        } elseif ($data->noteableType === 'fabric') {
            $model = Fabric::query()->findOrFail($data->noteableId);
            $this->authorize('notes.create.fabric');
        } else {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'Invalid noteable_type');
        }
        $note = app(CreateNote::class)($data, $model);

        return ApiResponse::data($note, 'Note created.', Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
