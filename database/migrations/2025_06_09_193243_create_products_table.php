<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->decimal('profit', 10, 2);
            $table
                ->enum('measurement', ['unit', 'liter', 'weight'])
                ->default('unit')
                ->nullable(false);
            $table->decimal('stock');
            $table->string('category');
            $table->foreign('category')->references('category_slug')->on('categories');
            $table->string('brand');
            $table->foreign('brand')->references('brand_slug')->on('brands');
            $table->boolean('wholesale');
            $table->decimal('wholesale_qty')->nullable();
            $table->decimal('wholesale_profit', 10, 2)->nullable();
            $table->decimal('notification_stock')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
