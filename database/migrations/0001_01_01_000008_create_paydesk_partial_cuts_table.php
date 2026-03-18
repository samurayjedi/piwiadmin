<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('paydesk_partial_cuts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paydesk_session_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->json('note')->nullable();
            $table->string('escpos_invoice_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('paydesk_partial_cuts');
    }
};
