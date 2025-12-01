<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Sale;
use App\Models\PayableAccount;


class DashboardController extends Controller {
    public function main() {
        // Income for current day
        $salesDay = Sale::whereDate('created_at', today())->get();
        $incomeDay = $salesDay->sum('amount_paid');
        // Income for week
        $incomeWeek = Sale::select([
            DB::raw('COALESCE(SUM(amount_paid), 0) as week_income'),
        ])->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ])->first()->week_income;
        // Income for current month
        $salesMonth = Sale::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();
        $incomeMonth = $salesMonth->sum('amount_paid');
        // Income for current year
        $salesYear = Sale::whereYear('created_at', now()->year)->get();
        $incomeYear = $salesYear->sum('amount_paid');
        $pendingIncome = $salesYear->sum('total_amount') - $incomeYear;
        // payable accounts for the current day
        $dayExpenses = PayableAccount::select([
            DB::raw('COALESCE(SUM(amount_paid), 0) as day_expenses'),
        ])->whereDate('created_at', today())->first()->day_expenses;
        // payable accounts for the week
        $weekExpenses = PayableAccount::select([
            DB::raw('COALESCE(SUM(amount_paid), 0) as week_expenses'),
        ])->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->first()->week_expenses;
        // payable accounts for the month
        $monthExpenses = PayableAccount::select([
            DB::raw('COALESCE(SUM(amount_paid), 0) as month_expenses'),
        ])->whereBetween('created_at', [
            now()->startOfMonth(),
            now()->endOfMonth()
        ])->first()->month_expenses;
        // year expenses
        $yearExpenses = PayableAccount::select([
            DB::raw('COALESCE(SUM(amount_paid), 0) as year_expenses'),
        ])->whereBetween('created_at', [
            now()->startOfYear(),
            now()->endOfYear()
        ])->first()->year_expenses;
        // expenses to pay
        $toPay = PayableAccount::select([
            DB::raw('COALESCE(SUM(total_amount - amount_paid), 0) as to_pay'),
        ])->where('status', 'pending')->first()->to_pay;


        return Inertia::render('Dashboard', [
            'metrics' => [
                'dayIncome' => $incomeDay,
                'weekIncome' => floatval($incomeWeek),
                'monthIncome' => $incomeMonth,
                'yearIncome' => $incomeYear,
                'pendingIncome' => $pendingIncome,
                'day_expenses' => floatval($dayExpenses),
                'week_expenses' => floatval($weekExpenses),
                'month_expenses' => floatval($monthExpenses),
                'year_expenses' => floatval($yearExpenses),
                'to_pay' => floatval($toPay),
            ],
        ]);
    }
}
