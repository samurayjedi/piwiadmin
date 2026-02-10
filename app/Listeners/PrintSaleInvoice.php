<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\EcsPosService;
use App\Events\SaleDone;
use App\Events\PaymentMade;

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
    public function handle(SaleDone|PaymentMade $e): void {
        if ($e->sale->status === 'completed') {
            $this->ecsPos->printInvoice($e->sale);
        }
    }
}
