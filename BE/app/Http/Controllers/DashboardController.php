<?php

namespace App\Http\Controllers;

use App\Models\ProductReturn;
use App\Models\Transaction;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $transaction = new Transaction();
        $retur = new ProductReturn();

        $lastMonth = Carbon::now()->subDays(30);

        $totalTransaction = $transaction->where('created_at', '>=', $lastMonth)->count();
        $totalRetur = $retur->where('status', 'approved')->where('created_at', '>=', $lastMonth)->count();
        $totalRequestRetur = $retur->where('status', 'pending')->where('created_at', '>=', $lastMonth)->count();

        // data total transaksi 30 hari terakhir
        $firstDay = Carbon::now()->subDays(30)->startOfDay();
        $lastDay = Carbon::now()->endOfDay();

        $lastMonthTransaction = [];
        for ($i = $firstDay; $i <= $lastDay; $i->addDay()) {
            $data = [
                'date' => $i->format('Y-m-d'),
                'total' => $transaction->where('date', $i->format('Y-m-d'))->count(),
                'total_transaction' => $transaction->where('date', $i->format('Y-m-d'))->sum('grand_total'),
            ];

            $lastMonthTransaction[] = $data;
        }

        // penjualan per tahun
        $firstTransaction = $transaction->orderBy('created_at', 'asc')->first();
        $firstYear = date('Y', strtotime($firstTransaction->created_at));
        $lastYear = date('Y');

        $yearlyTransaction = [];

        for ($i = $firstYear; $i <= $lastYear; $i++) {
            $data = [
                'year' => $i,
                'total' => $transaction->whereYear('created_at', $i)->count(),
                'total_transaction' => $transaction->whereYear('created_at', $i)->sum('grand_total'),
            ];

            $yearlyTransaction[] = $data;
        }

        // penjualan per bulan
        $firstTransaction = $transaction->orderBy('created_at', 'asc')->first();
        $firstMonth = date('m', strtotime($firstTransaction->created_at));
        $lastMonth = date('m');

        $monthlyTransaction = [];

        for ($i = $firstMonth; $i <= $lastMonth; $i++) {
            $data = [
                'month' => Carbon::create()->month($i)->locale('id')->monthName,
                'total' => $transaction->whereMonth('created_at', $i)->count(),
                'total_transaction' => $transaction->whereMonth('created_at', $i)->sum('grand_total'),
            ];

            $monthlyTransaction[] = $data;
        }


        return response()->json([
            'status' => 'success',
            'message' => 'Dashboard berhasil diambil',
            'data' => [
                'total_transaction' => $totalTransaction,
                'total_retur' => $totalRetur,
                'total_request_retur' => $totalRequestRetur,
                'daily_transaction' => $lastMonthTransaction,
                'monthly_transaction' => $monthlyTransaction,
                'yearly_transaction' => $yearlyTransaction,
            ],
        ], 200);
    }
}
