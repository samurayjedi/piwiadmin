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
        Schema::create('paydesk_partial_cut_amounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paydesk_partial_cut_id')->constrained();
            $table->foreignId('payment_method_id')->constrained();
            $table->decimal('amount', 14, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paydesk_partial_cut_ammonts');
    }
};
