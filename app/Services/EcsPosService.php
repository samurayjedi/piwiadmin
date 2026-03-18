<?php
namespace App\Services;

use Mike42\Escpos\PrintConnectors\FilePrintConnector;
// use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Http\Controllers\CurrenciesController;
use App\Services\DolarService;
use App\Services\BusinessInfoService;
use App\Models\PaydeskSession;
use App\Models\PaydeskPartialCut;

class EcsPosService
{
    private $printer, $helper, $dolar = 0;
    
    public function __construct(DolarService $dolar, public BusinessInfoService $info) {
        $this->dolar = $dolar->get_bs_price();
        $this->initializePrinter();
    }
    
    private function initializePrinter() {
        // Try different connection methods
        $uniq = substr(md5(uniqid(rand())),0,8);
        $filename = "$uniq.escpos";
        $this->helper = $filename;
        $connector = new FilePrintConnector(public_path("storage/tmp/$filename"));
        // $connector = new NetworkPrintConnector('127.0.0.1', 9100);
        $this->printer = new Printer($connector);
    }

    private function header() {
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text($this->info->rif."\n");
        $this->printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $this->printer->text($this->info->name."\n");
        $this->printer->selectPrintMode(); // Reset
        $this->printer->text(__('MAIN TAX ADDRESS:').$this->info->address."\n");
    }
    
    public function printInvoice(Sale &$sale) {
        /** Invoice content .................................................................... */
        $this->printer->feed(1);
        // --- HEADER ---
        $this->header();
        // --- INVOICE INFO ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER); // Printer::JUSTIFY_LEFT
        $currentDateTime = date('d/m/Y H:i:s'); $invoice = $sale->id;
        $this->printer->text("$currentDateTime  ".__('Sale')." #: $invoice\n");
        $this->printer->text(str_repeat("-", 48) . "\n"); // Horizontal separator
        // --- CUSTOMER DATA ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text("----------".__('Consumer Data')."----------\n");
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $clientName = $sale->client->name; $identification = $sale->client->identification;
        $address = empty($sale->client->address) ? __('No indicated.') : $sale->client->address; 
        $seller = $sale->user->name;
        $this->printer->text(__('SOCIAL REASON').": $clientName\n");
        $this->printer->text(__('DNI').": $identification\n");
        $this->printer->text(__('Address').": $address\n");
        $this->printer->text(__('Seller').": $seller\n");
        // --- TABLE HEADER ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $this->printer->text(__('INVOICE')."\n");
        $this->printer->selectPrintMode();
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $col1_width = 22; // For description
        $col2_width = 6;  // For quantity
        $col3_width = 8;  // For unit price
        $col4_width = 12; // For subtotal (more space for larger numbers)
        $total_width = $col1_width + $col2_width + $col3_width + $col4_width; // 48
        $header = str_pad(__('ART. DESC.'), $col1_width) . 
                str_pad(__('AMMOUNT.'), $col2_width, ' ', STR_PAD_LEFT) . 
                str_pad(__('UNIT P.'), $col3_width, ' ', STR_PAD_LEFT) . 
                str_pad(__('SUBTOTAL'), $col4_width, ' ', STR_PAD_LEFT);
        $this->printer->setEmphasis(true); // Make header bold
        $this->printer->text($header . "\n");
        $this->printer->setEmphasis(false);
        $this->printer->text(str_repeat("-", 48) . "\n");
        // --- TABLE ITEMS ---
        foreach($sale->sale_items as $item) {
            $name = $item->product->name;
            $qty = $item->quantity;
            $price = round($this->dolar * $item->unit_price, 2);
            $total = round($this->dolar * ($item->unit_price*$item->quantity), 2);
            $wrappedLines = $this->wrapText($name, $col1_width - 2); // Leave 2 spaces for padding
            // Print first line with all columns
            $firstLine = str_pad(substr($wrappedLines[0], 0, $col1_width), $col1_width) . 
                        str_pad($qty, $col2_width, ' ', STR_PAD_LEFT) . 
                        str_pad($price, $col3_width, ' ', STR_PAD_LEFT) . 
                        str_pad($total, $col4_width, ' ', STR_PAD_LEFT);
            $this->printer->text($firstLine . "\n");
            // Print remaining lines of description (if any) with empty other columns
            for ($i = 1; $i < count($wrappedLines); $i++) {
                $continuedLine = str_pad($wrappedLines[$i], $col1_width) . 
                                str_repeat(" ", $col2_width + $col3_width + $col4_width);
                $this->printer->text($continuedLine . "\n");
            }
            // Add some spacing after the item
            $this->printer->text("\n");
        }
        // --- TOTALS SECTION ---
        $this->printer->text(str_repeat("-", 48) . "\n");
        
        $total = round($this->dolar * $sale->total_amount, 2);
        $totals = [
            __('Net Total')." (Bs.):" => round($this->dolar * $sale->total_amount, 2),
            __('Taxable Base')." (Bs.):" => "0,00",
            __('TAX')." (Bs.):" => "0,00",
            __('Exempt')." (Bs.):" => round($this->dolar * $sale->total_amount, 2),
            __('TOTAL')." (Bs.):" => $total,
        ];

        foreach ($totals as $label => $value) {
            $this->printer->text(str_pad($label, 30) . str_pad($value, 18, " ", STR_PAD_LEFT) . "\n");
        }

        // --- PAYMENT METHOD ---
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->text(__('PAYMENT METHOD(S)').":\n");
        // for credit/layaway sales, payments can be made several times with the same payment method, here i group them
        $payments = []; $totalPayed = 0;
        foreach ($sale->payments as $payment) {
            $cAmount = round($this->dolar * $payment->amount, 2);
            $totalPayed += $cAmount;
            if (array_key_exists($payment->payment_method->id, $payments)) {
                $payments[$payment->payment_method->id]['amount'] += $cAmount;
            } else {
                $payments[$payment->payment_method->id] = [];
                $payments[$payment->payment_method->id]['amount'] = $cAmount;
                $payments[$payment->payment_method->id]['label'] = $payment->payment_method->payment_label;
            }
        }
        foreach ($payments as $payment) {
            $method_label = $payment['label'];
            $amount = $payment['amount'];
            $this->printer->text(str_pad("$method_label:", 30) . str_pad($amount, 18, " ", STR_PAD_LEFT) . "\n");
        }
        // if there are several payments, show the total payed
        if (count($payments) > 1) {
            $this->printer->text(str_pad(__('Total')." (Bs.):", 30) . str_pad($totalPayed , 18, " ", STR_PAD_LEFT) . "\n");
        }
        // if change was given
        if ($totalPayed > $total) {
            $change = round($totalPayed - $total, 2);
            $this->printer->text(str_pad(__('Change')." (Bs.):", 30) . str_pad($change , 18, " ", STR_PAD_LEFT) . "\n");
        }
        // --- FOOTER ---
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(__('WITHOUT FISCAL VALIDITY.')."\n");
        $this->printer->text(__('PERISHABLE PRODUCTS CAN ONLY BE EXCHANGED WITHIN 24 HOURS.')."\n");
        $this->printer->feed(1);
        /** .................................................................................... */
        // print barcode
        /* $this->printer->setBarcodeHeight(90); 
        $this->printer->setBarcodeWidth(2);
        $this->printer->barcode($this->saleBarcodeContent($sale), Printer::BARCODE_CODE128);
        $this->printer->feed(1); */
        
        $this->printer->cut();
        $this->printer->close();
        $sale->escpos_invoice_path = $this->helper;
        $sale->save();
        $this->helper = null;
    }

    private function cut_closure_header($id, $name, $email) {
        // --- HEADER ---
        $this->header();
        // --- TICKET INFO ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $currentDateTime = date('d/m/Y H:i:s');
        $this->printer->text("$currentDateTime\n");
        $this->printer->text(str_repeat("-", 48) . "\n"); // Horizontal separator
        // --- USER DATA ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text("----------".__('User Info')."----------\n");
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $this->printer->text(__('ID').": #$id\n");
        $this->printer->text(__('NAME').": $name\n");
        $this->printer->text(__('EMAIL').": $email\n");
    }

    private function cut_closure_amounts_table(array $amounts) {
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $this->printer->text(str_pad(__('Payment Method'), 25) . str_pad(__('Amount'), 15, ' ', STR_PAD_LEFT) . "\n");
        $this->printer->text(str_repeat("-", 48) . "\n");
        // amount per payment method
        $totalAmount = 0;
        try {
            foreach ($amounts as $a) {
                $paymentMethod = $a['payment_method']['payment_label'];
                $amount = number_format($a['amount'], 2);
                $totalAmount += $a['amount'];
                
                // Format: Payment Method (left) + Amount (right aligned)
                $this->printer->text(str_pad($paymentMethod, 25) . str_pad($amount, 15, ' ', STR_PAD_LEFT) . "\n");
            }
        } catch (\Exception $e) {
            \Log::error('Cannot generate ticket because: '. $e->getMessage(), [
                'amounts' => $amounts,
            ]);

            throw $e;
        }

        return $totalAmount;
    }

    private function cut_closure_total_line($total) {
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->setJustification(Printer::JUSTIFY_RIGHT);
        $this->printer->text(__('TOTAL') . ": " . number_format($total, 2) . "\n");
        $this->printer->selectPrintMode();
    }
    
    public function print_cut_ticket(PaydeskPartialCut &$cut) {
        $queries = DB::getQueryLog();
        $id = $cut->user->id;
        $name = $cut->user->name;
        $email = $cut->user->name;
        $paydeskName = strtoupper($cut->session->paydesk->name);
        $cuttedAt = $cut->created_at->format('d/m/Y H:i:s');
        /** Ticket ============================================================================================================= */
        $this->printer->feed(1);
        $this->cut_closure_header($id, $name, $email);
        // --- PAYMENT SUMMARY ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $this->printer->feed(1);
        $this->printer->text(__('":paydesk" Cut', ['paydesk' => $paydeskName])."\n");
        $this->printer->selectPrintMode();
        $this->printer->feed(1);
        // --- FUNDS BEFORE THE USER TAKES THE PAYDESK ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(__('Start with funds').":\n");
        $this->printer->selectPrintMode();
        $this->printer->text(str_repeat("-", 48) . "\n");
        $previousCut = PaydeskPartialCut::with([
            'amounts',
            'amounts.payment_method'
        ])
            ->where('id', '<', $cut->id)
            ->where('paydesk_session_id', $cut->paydesk_session_id)
            ->orderBy('id', 'desc')
            ->first();
        $initialFunds = $previousCut ? (function() use($previousCut, $cut) {
            $arr = $previousCut->amounts->toArray();
            foreach ($cut->session->openings as $o) {
                $exists = false;
                for ($i = 0; $i < count($arr); $i++) {
                    if ($arr[$i]['payment_method_id'] == $o->payment_method_id) {
                        $arr[$i]['amount'] += $o->amount;
                        $exists = true;
                    }
                }
                if (!$exists) {
                    $arr[] = $o->toArray();
                }
            }

            return $arr;
        })() : $cut->session->openings->toArray();
        $initFundsTotal = $this->cut_closure_amounts_table($initialFunds);
        $this->cut_closure_total_line($initFundsTotal);
        // --- SELLED FUNDS ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(__('Sells').":\n");
        $this->printer->selectPrintMode();
        $this->printer->text(str_repeat("-", 48) . "\n");
        $sells = $cut->amounts->toArray();
        /* foreach ($sells as &$sell) {
            foreach ($initialFunds as $initFund) {
                if ($sell['payment_method_id'] === $initFund['payment_method_id']) {
                    $sell['amount'] = $initFund['amount'] - $sell['amount'];
                    $sell['amount'] *= -1;
                }
            }
        } */
        $cutTotal = $this->cut_closure_amounts_table($sells);
        $this->cut_closure_total_line($cutTotal);
        // --- CUT INFO AND FOOTER ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->text(__('Cutted at')." ".$cuttedAt."\n"); // closet at or cut at
        $this->printer->text(str_repeat("=", 48) . "\n");
        $this->printer->text(__('THANK YOU') . "\n");
        $this->printer->feed(1);
        $this->printer->cut();
        /** ==================================================================================================================== */
        $cut->escpos_invoice_path = $this->helper;
        $cut->save();
        $this->helper = null;
    }

    public function print_closure_ticket(PaydeskSession &$session) {
        $user = $session->user ?? $session->cuts()->with('user')->latest('id')->firstOrFail()->user;
        $id = $user->id;
        $name = $user->name;
        $email = $user->email;
        $paydeskName = strtoupper($session->paydesk->name);
        $closedAt = $session->close_at->format('d/m/Y H:i:s');
        /** Ticket ============================================================================================================= */
        $this->printer->feed(1);
        $this->cut_closure_header($id, $name, $email);
        // --- PAYMENT SUMMARY ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $this->printer->feed(1);
        $this->printer->text(__('":paydesk" CLOSURE', ['paydesk' => $paydeskName])."\n");
        $this->printer->selectPrintMode();
        $this->printer->feed(1);
        // --- PAYDESK INITIAL FUNDS ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(__('Initial funds').":\n");
        $this->printer->selectPrintMode();
        $this->printer->text(str_repeat("-", 48) . "\n");
        $totalInitFunds = $this->cut_closure_amounts_table($session->openings->toArray());
        $this->cut_closure_total_line($totalInitFunds);
        // --- PAYDESK SELLED FUNDS ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(__('Sells').":\n");
        $this->printer->selectPrintMode();
        $this->printer->text(str_repeat("-", 48) . "\n");
        $totalFundsOnClose = $this->cut_closure_amounts_table($session->closures->toArray());
        $this->cut_closure_total_line($totalFundsOnClose);
        // --- CLOSURE INFO AND FOOTER ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->text(__('Closed at')." ".$closedAt."\n"); // closet at or cut at
        $this->printer->text(str_repeat("=", 48) . "\n");
        $this->printer->text(__('THANK YOU') . "\n");
        $this->printer->feed(1);
        $this->printer->cut();
        /** ==================================================================================================================== */
        $session->escpos_invoice_path = $this->helper;
        $session->save();
        $this->helper = null;
    }

    private function wrapText($text, $width) {
        $words = explode(' ', $text);
        $lines = [];
        $currentLine = '';
        
        foreach ($words as $word) {
            if (strlen($currentLine . ' ' . $word) <= $width) {
                $currentLine .= ($currentLine ? ' ' : '') . $word;
            } else {
                if ($currentLine) {
                    $lines[] = $currentLine;
                }
                $currentLine = $word;
            }
        }
        
        if ($currentLine) {
            $lines[] = $currentLine;
        }
        
        return $lines;
    }

    private function saleBarcodeContent(Sale $sale) {
        return '{C}'.(string)$sale->id;
        
    }
}