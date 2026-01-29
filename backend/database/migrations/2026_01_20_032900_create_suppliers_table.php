<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('country');
            $table->string('company_name');
            $table->string('code')->unique();

            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();

            $table->string('representative_name')->nullable();
            $table->string('representative_email')->nullable();
            $table->string('representative_phone')->nullable();

            $table->foreignUuid('added_by')->constrained('users');
            $table->foreignUuid('updated_by')->nullable()->constrained('users');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['country', 'company_name']);
            $table->index(['representative_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
