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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->comment('Who made the sale');
            $table->foreignId('client_id')->nullable()->constrained()->comment('Optional customer record');
            // Payment type columns
            $table->enum('payment_type', ['cash', 'credit', 'layaway']);
            $table->decimal('tax_amount', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->enum('status', ['pending', 'canceled', 'completed']);
            // Credit/Layaway-specific columns
            $table->date('due_date')->nullable()->comment('For credit/layaway sales');
            $table->smallInteger('quotas')->nullable()->comment('For credit sales');
            $table->enum('payment_interval', ['weekly', 'fortnightly', 'monthly', 'bimonthly', 'quarterly', 'biannual', 'yearly'])->nullable()->comment('For credit sales');
            // ....
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('sales');
    }
};
