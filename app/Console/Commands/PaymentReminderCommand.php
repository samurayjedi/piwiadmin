<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Notifications\PaymentReminder;
use App\Models\User;
use App\Models\Sales\Sale;

class PaymentReminderCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment_reminder:send {interval=daily}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications for credit/layaway sales pending to payment';

    /**
     * Execute the console command.
     */
    public function handle() {
        $interval = $this->argument('interval');
        $users = User::all();
        $sales = DB::table('sales')
            ->where('status', 'pending')
            ->where(function($query) use($interval) {
                $now = Carbon::now();

                switch ($interval) {
                    case 'daily':
                        $query->where('payment_interval', 'daily')->whereDate('created_at', '<=', $now->subDay());
                        break;
                    case 'weekly':
                        $query->where('payment_interval', 'weekly')->whereDate('created_at', '<=', $now->subWeek());
                        break;
                    case 'fortnightly':
                        $query->where('payment_interval', 'fortnightly')->whereDate('created_at', '<=', $now->subWeeks(2));
                        break;
                    case 'monthly':
                        $query->where('payment_interval', 'monthly')->whereDate('created_at', '<=', $now->subMonth());
                        break;
                    case 'bimonthly':
                        $query->where('payment_interval', 'bimonthly')->whereDate('created_at', '<=', $now->subMonths(2));
                        break;
                    case 'quarterly':
                        $query->where('payment_interval', 'quarterly')->whereDate('created_at', '<=', $now->subMonths(3));
                        break;
                    case 'biannual':
                        $query->where('payment_interval', 'biannual')->whereDate('created_at', '<=', $now->subMonths(6));
                        break;
                    case 'yearly':
                        $query->where('payment_interval', 'yearly')->whereDate('created_at', '<=', $now->subYear());
                        break;
                    default:
                        throw new \Exception('Invalid interval: ' . $interval);
                }
            })
            ->get();
        foreach ($sales as $rawSale) {
            $sale = new Sale;
            $sale->exchangeArray($rawSale);
            foreach ($users as $user) {
                $user->notify(new PaymentReminder($sale));
            }
        }
    }
}
