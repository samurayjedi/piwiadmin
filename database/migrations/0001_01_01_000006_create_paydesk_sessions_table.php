<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('paydesk_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paydesk_id')->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->timestamp('open_at');
            $table->timestamp('close_at')->nullable();
            $table->enum('status', ['open', 'close'])->default('open');
            $table->string('escpos_invoice_path')->nullable();
            $table->timestamps();
            
            // critical index
            /* $table->unique(['paydesk_id', 'status'], 'active_paydesk')
                ->where('status', 'open'); */
        });
        // Add a virtual column that's only non-null for open sessions
        DB::statement("
            ALTER TABLE paydesk_sessions 
            ADD COLUMN open_paydesk_id INT GENERATED ALWAYS AS (
                CASE WHEN status = 'open' THEN paydesk_id ELSE NULL END
            ) VIRTUAL
        ");
        // Create unique index on the virtual column
        DB::statement("
            CREATE UNIQUE INDEX active_paydesk 
            ON paydesk_sessions (open_paydesk_id)
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paydesk_sessions');
    }
};
