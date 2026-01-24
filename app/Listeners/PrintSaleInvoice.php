<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\EcsPosService;
use App\Events\SaleDone;

class PrintSaleInvoice
{
    /**
     * Create the event listener.
     */
    public function __construct(private EcsPosService $ecsPos)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SaleDone $e): void
    {
        $this->ecsPos->printInvoice($e->sale);
    }
}
