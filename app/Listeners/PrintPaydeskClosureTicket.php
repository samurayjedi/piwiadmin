<?php

namespace App\Listeners;

use App\Events\PaydeskClosed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\EcsPosService;

class PrintPaydeskClosureTicket
{
    /**
     * Create the event listener.
     */
    public function __construct(private EcsPosService $ecsPos) {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaydeskClosed $e): void {
        $this->ecsPos->print_closure_ticket($e->session);
    }
}
