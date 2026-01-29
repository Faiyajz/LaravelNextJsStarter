<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fabric_barcodes', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('fabric_id')->constrained('fabrics');
            $table->string('barcode_value')->unique();
            $table->timestamps();

            $table->index(['fabric_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fabric_barcodes');
    }
};
