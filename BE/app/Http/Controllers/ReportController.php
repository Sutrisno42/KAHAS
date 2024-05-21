<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockOpname;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\CarbonPeriod;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Str;

class ReportController extends Controller
{
    public function financial()
    {
        $type = request()->type ?? 'daily';

        if(request()->has('search') && !empty(request()->search)){
            $product = Product::where('product_name', 'like', '%'.request()->search.'%')->get();
            $product_id = $product->pluck('id')->toArray();
        } else {
            $product = Product::all();
            $product_id = $product->pluck('id')->toArray();
        }

        $list_transaction_details = TransactionDetail::whereIn('product_id', $product_id)->get();
        $list_transaction_details = $list_transaction_details->pluck('transaction_id')->toArray();

        $first_year = Transaction::whereIn('id', $list_transaction_details)->orderBy('date', 'asc')->first()->date->format('Y');
        $last_year = date('Y');

        $summary_year = [];
        for($i = $first_year; $i <= $last_year; $i++){
            $total_summary_year = TransactionDetail::whereIn('transaction_id',$list_transaction_details)
                                    ->whereHas('transaction', function ($query) use ($i) {
                                        $query->whereYear('date', $i);
                                    })->sum('sub_total');
            $summary_year[] = [
                'year' => $i,
                'total' => $total_summary_year,
            ];
        }

        $summary_sales = [];

        if($type == 'daily'){
            if(request()->has('start_date') && request()->has('end_date') && !empty(request()->start_date) && !empty(request()->end_date)){
                $validator = Validator::make(request()->all(), [
                    'start_date' => 'required|date_format:d-m-Y',
                    'end_date' => 'required|date_format:d-m-Y',
                ]);

                if($validator->fails()){
                    return response()->json([
                        'status' => 'error',
                        'message' => $validator->errors()->first(),
                        'errors' => $validator->errors(),
                    ], 400);
                }

                $first_date = Carbon::createFromFormat('d-m-Y', request()->start_date)->format('Y-m-d');
                $last_date = Carbon::createFromFormat('d-m-Y', request()->end_date)->endOfMonth()->format('Y-m-d');
            } else {
                $first_date = date('Y-m-d', strtotime('-30 days'));
                $last_date = date('Y-m-d');
            }

            $priode = CarbonPeriod::create($first_date, $last_date);
            foreach($priode as $date) {
                $summary_sales[] = [
                    'date' => $date->format('Y-m-d'),
                    'total' => TransactionDetail::whereIn('transaction_id', $list_transaction_details)
                                ->whereHas('transaction', function ($query) use ($date) {
                                    $query->whereDate('date', $date->format('Y-m-d'));
                                })->sum('sub_total'),
                ];
            }
        } else if($type == 'monthly'){
            if(request()->has('start_date') && request()->has('end_date') && !empty(request()->start_date) && !empty(request()->end_date)){
                $validator = Validator::make(request()->all(), [
                    'start_date' => 'required|date_format:m-Y',
                    'end_date' => 'required|date_format:m-Y',
                ]);

                if($validator->fails()){
                    return response()->json([
                        'status' => 'error',
                        'message' => $validator->errors()->first(),
                        'errors' => $validator->errors(),
                    ], 400);
                }

                $first_date = Carbon::createFromFormat('m-Y', request()->start_date)->format('Y-m-d');
                $last_date = Carbon::createFromFormat('m-Y', request()->end_date)->endOfMonth()->format('Y-m-d');
            } else {
                $first_date = date('Y-m-d', strtotime('-1 year'));
                $last_date = date('Y-m-d');
            }

            $priode = CarbonPeriod::create($first_date, $last_date);
            foreach($priode as $date) {
                $summary_sales[] = [
                    'date' => $date->format('Y-m'),
                    'total' => TransactionDetail::whereIn('transaction_id', $list_transaction_details)
                                ->whereHas('transaction', function ($query) use ($date) {
                                    $query->whereMonth('date', $date->format('m'))->whereYear('date', $date->format('Y'));
                                })->sum('sub_total'),
                ];
            }
            $summary_sales = array_map("unserialize", array_unique(array_map("serialize", $summary_sales)));
            $summary_sales = array_values($summary_sales);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Tipe laporan tidak sesuai',
            ], 400);
        }

        $transactions = Transaction::whereIn('id', $list_transaction_details)->whereDate('date', '>=', $first_date)->whereDate('date', '<=', $last_date)->get();
        $transaction_id = $transactions->pluck('id')->toArray();
        $total_hpp = 0;
        $summary_product = [];

        $per_product = TransactionDetail::whereIn('product_id', $product_id)->whereIn('transaction_id', $transaction_id)->groupBy('product_id')->pluck('product_id')->toArray();

        foreach($per_product as $key => $id){
            $detail = TransactionDetail::where('product_id', $id)->whereIn('transaction_id', $transaction_id);
            $product = StockOpname::where('product_id', $id)->join('products', 'products.id', '=', 'stock_opnames.product_id')->first();
            $total_hpp += $product->hpp_price * $detail->sum('quantity');
            $data = [
                'product_id' => $product->product_id,
                'product_name' => $product->product_name,
                'quantity' => $detail->sum('quantity'),
                'hpp_price' => $product->hpp_price,
                'omset' => $detail->sum('sub_total'),
                'profit' => $detail->sum('sub_total') - ($product->hpp_price * $detail->sum('quantity')),
            ];

            $summary_product[] = $data;
        }

        $limit = request()->limit ?? 10;
        $page = request()->page ?? 1;
        $offset = ($page - 1) * $limit;

        $pagination = new LengthAwarePaginator(
            array_values(array_slice($summary_product, $offset, $limit, true)) ?? [],
            count($summary_product),
            $limit,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        $total_omset = collect($summary_product)->sum('omset');
        $total_profit = floatval($total_omset) - floatval($total_hpp);

        return response()->json([
            'status' => 'success',
            'message' => 'Data laporan berhasil diambil',
            'data' => [
                'summary' => [
                    'total_hpp' => $total_hpp,
                    'total_omset' => $total_omset,
                    'total_profit' => $total_profit,
                ],
                'summary_product' => $pagination,
                'summary_sales' => $summary_sales,
                'summary_year' => $summary_year,
            ],
        ], 200);
    }

    public function sales()
    {
        $type = request()->type ?? 'daily';

        if(request()->has('search') && !empty(request()->search)){
            $product = Product::where('product_name', 'like', '%'.request()->search.'%')->get();
            $product_id = $product->pluck('id')->toArray();
        } else {
            $product = Product::all();
            $product_id = $product->pluck('id')->toArray();
        }

        $list_transaction_details = TransactionDetail::whereIn('product_id', $product_id)->get();
        $list_transaction_details = $list_transaction_details->pluck('transaction_id')->toArray();

        $first_year = Transaction::whereIn('id', $list_transaction_details)->orderBy('date', 'asc')->first()->date->format('Y');
        $last_year = date('Y');

        $summary_year = [];
        for($i = $first_year; $i <= $last_year; $i++){
            $total_summary_year = Transaction::whereIn('id',$list_transaction_details)->whereYear('date', $i)->sum('grand_total');
            $summary_year[] = [
                'year' => strval($i),
                'total' => $total_summary_year,
            ];
        }

        $summary_sales = [];

        if($type == 'daily'){
            if(request()->has('start_date') && request()->has('end_date') && !empty(request()->start_date) && !empty(request()->end_date)){
                $validator = Validator::make(request()->all(), [
                    'start_date' => 'required|date_format:d-m-Y',
                    'end_date' => 'required|date_format:d-m-Y',
                ]);

                if($validator->fails()){
                    return response()->json([
                        'status' => 'error',
                        'message' => $validator->errors()->first(),
                        'errors' => $validator->errors(),
                    ], 400);
                }

                $first_date = Carbon::createFromFormat('d-m-Y', request()->start_date)->format('Y-m-d');
                $last_date = Carbon::createFromFormat('d-m-Y', request()->end_date)->endOfMonth()->format('Y-m-d');
            } else {
                $first_date = date('Y-m-d', strtotime('-30 days'));
                $last_date = date('Y-m-d');
            }

            $priode = CarbonPeriod::create($first_date, $last_date);
            foreach($priode as $date) {
                $summary_sales[] = [
                    'date' => $date->format('Y-m-d'),
                    'total' => Transaction::whereIn('id', $list_transaction_details)->whereDate('date', $date->format('Y-m-d'))->sum('grand_total'),
                ];
            }
        } else if($type == 'monthly'){
            if(request()->has('start_date') && request()->has('end_date') && !empty(request()->start_date) && !empty(request()->end_date)){
                $validator = Validator::make(request()->all(), [
                    'start_date' => 'required|date_format:m-Y',
                    'end_date' => 'required|date_format:m-Y',
                ]);

                if($validator->fails()){
                    return response()->json([
                        'status' => 'error',
                        'message' => $validator->errors()->first(),
                        'errors' => $validator->errors(),
                    ], 400);
                }

                $first_date = Carbon::createFromFormat('m-Y', request()->start_date)->format('Y-m-d');
                $last_date = Carbon::createFromFormat('m-Y', request()->end_date)->endOfMonth()->format('Y-m-d');
            } else {
                $first_date = date('Y-m-d', strtotime('-1 year'));
                $last_date = date('Y-m-d');
            }

            $priode = CarbonPeriod::create($first_date, $last_date);
            foreach($priode as $date) {
                $summary_sales[] = [
                    'date' => $date->format('Y-m'),
                    'total' => Transaction::whereIn('id', $list_transaction_details)->whereMonth('date', $date->format('m'))->whereYear('date', $date->format('Y'))->sum('grand_total'),
                ];
            }
            $summary_sales = array_map("unserialize", array_unique(array_map("serialize", $summary_sales)));
            $summary_sales = array_values($summary_sales);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Tipe laporan tidak sesuai',
            ], 400);
        }

        $transactions = Transaction::whereIn('id', $list_transaction_details)->whereDate('date', '>=', $first_date)->whereDate('date', '<=', $last_date)->get();
        $total_hpp = 0;
        $summary_transaction = [];

        foreach ($transactions as $transaction){
            $transaction_detail = TransactionDetail::where('transaction_id', $transaction->id)->get();

            $hpp_per_transaction = 0;
            foreach ($transaction_detail as $detail){
                $product = StockOpname::where('product_id', $detail->product_id)->join('products', 'products.id', '=', 'stock_opnames.product_id')->first();
                $total_hpp += $product->hpp_price * $detail->quantity;
                $hpp_per_transaction += $product->hpp_price * $detail->quantity;
            }

            $data = [
                'transaction_id' => $transaction->id,
                'nota_number' => $transaction->nota_number,
                'hpp' => $hpp_per_transaction,
                'omset_before_discount' => $transaction_detail->sum('sub_total'),
                'profit_before_discount' => $transaction_detail->sum('sub_total') - $hpp_per_transaction,
                'discount' => $transaction->discount,
                'omset' => $transaction->grand_total,
                'profit' => $transaction->grand_total - $hpp_per_transaction,
            ];

            $summary_transaction[] = $data;
        }

        $limit = request()->limit ?? 10;
        $page = request()->page ?? 1;
        $offset = ($page - 1) * $limit;
        $pagination = new LengthAwarePaginator(
            array_values(array_slice($summary_transaction, $offset, $limit, true)) ?? [],
            count($summary_transaction),
            $limit,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        $total_omset = collect($summary_transaction)->sum('omset');
        $total_profit = floatval($total_omset) - floatval($total_hpp);

        return response()->json([
            'status' => 'success',
            'message' => 'Data laporan berhasil diambil',
            'data' => [
                'summary' => [
                    'total_hpp' => $total_hpp,
                    'total_omset' => $total_omset,
                    'total_profit' => $total_profit,
                ],
                'summary_product' => $pagination,
                'summary_sales' => $summary_sales,
                'summary_year' => $summary_year,
            ],
        ], 200);
    }

    public function financialDetail($id)
    {
        $product = Product::withTrashed()->find($id);

        if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => 'Data produk tidak ditemukan',
            ], 404);
        }

        $transaction_details = TransactionDetail::where('product_id', $id)->get();
        $transaction = Transaction::whereIn('id', $transaction_details->pluck('transaction_id')->toArray())->get();

        $product->load(['stockOpnames', 'category', 'priceLists', 'stockOpnames.supplier']);
        $product->total_sales = intval($transaction_details->sum('quantity'));
        $product->total_omset = floatval($transaction_details->sum('sub_total'));
        $product->total_hpp = floatval($product->stockOpnames->sum('hpp_price') * $product->total_sales);
        $product->total_profit = floatval($product->total_omset - $product->total_hpp);
        $product->total_nota = $transaction->count();
        $product->transactions = $transaction;

        return response()->json([
            'status' => 'success',
            'message' => 'Data laporan detail produk berhasil diambil',
            'data' => $product,
        ], 200);
    }

    public function salesDetail($id)
    {
        $transaction = Transaction::find($id);

        if(!$transaction){
            return response()->json([
                'status' => 'error',
                'message' => 'Data transaksi tidak ditemukan',
            ], 404);
        }

        $transaction_details = TransactionDetail::where('transaction_id', $id)->get();

        $total_hpp = 0;
        foreach ($transaction_details as $detail){
            $product = StockOpname::where('product_id', $detail->product_id)->join('products', 'products.id', '=', 'stock_opnames.product_id')->first();
            $total_hpp += $product->hpp_price * $detail->quantity;
        }

        $transaction->load(['cashier', 'member', 'details', 'details.product', 'details.unit']);
        $transaction->total_quantity = intval($transaction_details->sum('quantity'));
        $transaction->total_omset = floatval($transaction_details->sum('sub_total'));
        $transaction->total_hpp = floatval($total_hpp);
        $transaction->total_profit = floatval($transaction->total_omset - $transaction->total_hpp);

        return response()->json([
            'status' => 'success',
            'message' => 'Data laporan detail sales berhasil diambil',
            'data' => $transaction,
        ], 200);
    }
}
