<?php
namespace App\Services;

use Mike42\Escpos\PrintConnectors\FilePrintConnector;
// use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;
use App\Models\Sale;
use App\Http\Controllers\CurrenciesController;
use App\Services\DolarService;
use App\Services\BusinessInfoService;

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
    
    public function printInvoice(Sale &$sale) {
        /** Invoice content .................................................................... */

        // --- HEADER ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text($this->info->rif."\n");
        $this->printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $this->printer->text($this->info->name."\n");
        $this->printer->selectPrintMode(); // Reset
        $this->printer->text(__('MAIN TAX ADDRESS:').$this->info->address."\n");
        // --- INVOICE INFO ---
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $currentDateTime = date('d/m/Y H:i:s'); $invoice = $sale->id;
        $this->printer->text("$currentDateTime  ".__('Invoice')." #: $invoice\n");
        $this->printer->text(str_repeat("-", 48) . "\n"); // Horizontal separator
        // --- CUSTOMER DATA ---
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text("----------".__('Consumer Data')."----------\n");
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $clientName = $sale->client->name; $identification = $sale->client->identification;
        $address = $sale->client->address; $seller = $sale->user->name;
        $this->printer->text(__('NAME').": $clientName\n");
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
        
        $totals = [
            __('Net Total')." (Bs.):" => round($this->dolar * $sale->total_amount, 2),
            __('Taxable Base')." (Bs.):" => "0,00",
            __('TAX')." (Bs.):" => "0,00",
            __('Exempt')." (Bs.):" => round($this->dolar * $sale->total_amount, 2),
            __('TOTAL')." (Bs.):" => round($this->dolar * $sale->total_amount, 2)
        ];

        foreach ($totals as $label => $value) {
            $this->printer->text(str_pad($label, 30) . str_pad($value, 18, " ", STR_PAD_LEFT) . "\n");
        }

        // --- PAYMENT METHOD ---
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->text(__("FORMA DE PAGO").":\n");
        foreach ($sale->payments as $payment) {
            $method_label = $payment->payment_method->payment_label;
            $amount = round($this->dolar * $payment->amount, 2);
            $this->printer->text(str_pad("$method_label:", 30) . str_pad($amount, 18, " ", STR_PAD_LEFT) . "\n");
        }

        // --- FOOTER ---
        $this->printer->text(str_repeat("-", 48) . "\n");
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text(__('PERISHABLE PRODUCTS CAN ONLY BE EXCHANGED WITHIN 24 HOURS.')."\n");
        
        $this->printer->feed(3);
        /** .................................................................................... */
        
        $this->printer->cut();
        $this->printer->close();
        $sale->escpos_invoice_path = $this->helper;
        $sale->save();
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
}