<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sale;

class DashboardController extends Controller {
    public function main() {
        // Income for current day
        $salesDay = Sale::whereDate('created_at', today())->get();
        $incomeDay = $salesDay->sum('amount_paid');
        // Income for current month
        $salesMonth = Sale::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();
        $incomeMonth = $salesMonth->sum('amount_paid');
        // Income for current year
        $salesYear = Sale::whereYear('created_at', now()->year)->get();
        $incomeYear = $salesYear->sum('amount_paid');
        $pendingIncome = $salesYear->sum('total_amount') - $incomeYear;

        return Inertia::render('Dashboard', [
            'metrics' => [
                'dayIncome' => $incomeDay,
                'monthIncome' => $incomeMonth,
                'yearIncome' => $incomeYear,
                'pendingIncome' => $pendingIncome,
            ],
        ]);
    }
}
