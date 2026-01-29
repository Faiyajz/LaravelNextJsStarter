<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fabrics', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('supplier_id')->constrained('suppliers');

            $table->string('fabric_no');
            $table->string('composition');
            $table->unsignedInteger('gsm');
            $table->decimal('qty', 12, 3);
            $table->decimal('cuttable_width', 12, 3);

            $table->enum('production_type', ['Sample Yardage', 'SMS', 'Bulk']);

            $table->string('construction')->nullable();
            $table->string('color_pantone_code')->nullable();
            $table->string('weave_type')->nullable();
            $table->string('finish_type')->nullable();
            $table->string('dyeing_method')->nullable();
            $table->string('printing_method')->nullable();
            $table->unsignedInteger('lead_time')->nullable(); // days
            $table->decimal('moq', 12, 3)->nullable();
            $table->decimal('shrinkage_percent', 5, 2)->nullable();
            $table->text('remarks')->nullable();
            $table->string('fabric_selected_by')->nullable();

            $table->string('image_path')->nullable();

            $table->foreignUuid('added_by')->constrained('users');
            $table->foreignUuid('updated_by')->nullable()->constrained('users');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['fabric_no', 'composition']);
            $table->index(['production_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fabrics');
    }
};
