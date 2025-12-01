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
        Schema::create('payable_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->enum('type', ['cash', 'credit']);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('amount_paid', 10, 2);
            $table->date('due_date')->nullable();
            $table
                ->enum('notification_interval', [
                    'daily',
                    'weekly',
                    'fortnightly',
                    'monthly',
                    'bimonthly',
                    'quarterly',
                    'biannual',
                    'yearly',
                ])
                ->nullable();
            $table->enum('status', ['pending', 'canceled', 'completed']);
            $table->foreignId('stock_log_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payable_accounts');
    }
};
