<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Notifications\PaymentReminder;
use App\Models\User;
use App\Models\Sale;

class SendPaymentReminders extends Command
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
        $sales = Sale::where('status', 'pending')
            ->where(function($query) use($interval) {
                switch ($interval) {
                    case 'daily':
                        $query->where('notification_interval', 'daily')->whereDate('created_at', '<=', Carbon::now()->subDay());
                        break;
                    case 'weekly':
                        $query->where('notification_interval', 'weekly')->whereDate('created_at', '<=', Carbon::now()->subWeek());
                        break;
                    case 'fortnightly':
                        $query->where('notification_interval', 'fortnightly')->whereDate('created_at', '<=', Carbon::now()->subWeeks(2));
                        break;
                    case 'monthly':
                        $query->where('notification_interval', 'monthly')->whereDate('created_at', '<=', Carbon::now()->subMonth());
                        break;
                    case 'bimonthly':
                        $query->where('notification_interval', 'bimonthly')->whereDate('created_at', '<=', Carbon::now()->subMonths(2));
                        break;
                    case 'quarterly':
                        $query->where('notification_interval', 'quarterly')->whereDate('created_at', '<=', Carbon::now()->subMonths(3));
                        break;
                    case 'biannual':
                        $query->where('notification_interval', 'biannual')->whereDate('created_at', '<=', Carbon::now()->subMonths(6));
                        break;
                    case 'yearly':
                        $query->where('notification_interval', 'yearly')->whereDate('created_at', '<=', Carbon::now()->subYear());
                        break;
                    default:
                        throw new \Exception('Invalid interval: ' . $interval);
                }
            })
            ->get();
        foreach ($sales as $sale) {
            foreach ($users as $user) {
                $user->notify(new PaymentReminder($sale));
            }
        }
    }
}
