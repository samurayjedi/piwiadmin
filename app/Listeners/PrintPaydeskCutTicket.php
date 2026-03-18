<?php

namespace App\Listeners;

use App\Events\PaydeskCut;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\EcsPosService;

class PrintPaydeskCutTicket {
    /**
     * Create the event listener.
     */
    public function __construct(private EcsPosService $ecsPos) {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaydeskCut $e): void {
        $this->ecsPos->print_cut_ticket($e->cut);
    }
}
