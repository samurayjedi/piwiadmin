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
            $table->string('price');
            $table->string('sale_price');
            $table->string('tax');
            $table->string('stock');
            $table->string('category');
            $table->foreign('category')->references('category_slug')->on('categories');
            $table->string('brand');
            $table->foreign('brand')->references('brand_slug')->on('brands');
            $table->boolean('wholesale');
            $table->string('wholesale_qty')->nullable();
            $table->string('wholesale_price')->nullable();
            $table->timestamps();
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
