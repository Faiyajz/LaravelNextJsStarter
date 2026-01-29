<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fabric_stocks', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('fabric_id')->constrained('fabrics');
            $table->enum('type', ['IN', 'OUT']);
            $table->decimal('quantity', 12, 3);

            $table->string('reference')->nullable(); // challan, issue ref, etc.
            $table->foreignUuid('created_by')->constrained('users');

            $table->timestamps();

            $table->index(['fabric_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fabric_stocks');
    }
};
