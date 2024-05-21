<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReturn;
use App\Models\ReturnNotif;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductReturnController extends Controller
{
    public function index()
    {
        $user = auth('sanctum')->user();
        $data = ProductReturn::with(['product', 'transaction', 'cashier'])->where('status', 'pending')->orderBy('created_at', 'desc');
        $limit = request()->limit ?? 10;

        if(request()->has('product_name') && !empty(request()->product_name)){
            $data = $data->where('product_name', 'like', '%' . request()->product_name . '%');
        }

        if(request()->has('quantity') && !empty(request()->quantity)){
            $data = $data->where('quantity', request()->quantity);
        }

        if(request()->has('start_date') && !empty(request()->start_date)){
            $data = $data->where('created_at', '>=', request()->start_date);
        }

        if(request()->has('end_date') && !empty(request()->end_date)){
            $data = $data->where('created_at', '<=', request()->end_date);
        }

        if(request()->has('arrange_by') && !empty(request()->arrange_by)){
            $data = $data->orderBy(request()->arrange_by, request()->sort_by ? request()->sort_by : 'asc');
        }

        if($user->role == 'admin' || $user->role == 'warehouse'){
            $data = $data->paginate($limit);
        } else if($user->role == 'cashier'){
            $data = $data->whereHas('transaction', function($transaction) use ($user){
                $transaction->where('cashier_id', $user->id);
            })->paginate($limit);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Product return berhasil diambil',
            'data' => $data,
        ], 200);
    }

    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|exists:transactions,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'reason' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 400);
        }

        $check = TransactionDetail::where('transaction_id', $request->transaction_id)->where('product_id', $request->product_id)->first();

        // Cek apakah produk ada di transaksi
        if(!$check){
            return response()->json([
                'status' => 'error',
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // Cek apakah jumlah produk yang dikembalikan melebihi jumlah produk yang dibeli
        if($check->quantity < $request->quantity){
            return response()->json([
                'status' => 'error',
                'message' => 'Jumlah produk yang dikembalikan melebihi jumlah produk yang dibeli',
            ], 400);
        }

        // Simpan data product return
        $productReturn = new ProductReturn();
        $productReturn->transaction_id = $request->transaction_id;
        $productReturn->product_id = $request->product_id;
        $productReturn->product_name = $check->product_name;
        $productReturn->product_code = $check->product_code;
        $productReturn->price = $check->price;
        $productReturn->quantity = $request->quantity;
        $productReturn->discount = $check->discount;
        $productReturn->sub_total = ($check->price * $request->quantity) - $check->discount;
        $productReturn->reason = $request->reason;
        $productReturn->user_id = auth('sanctum')->user()->id ?? null;
        $productReturn->status = 'pending';
        $productReturn->save();

//        // Update data di tabel transaction_details
//        $check->quantity = $check->quantity - $request->quantity;
//        $check->sub_total = ($check->price * $check->quantity) - $check->discount;
//        $check->save();
//
//        // Update data di tabel transactions
//        $transaction = Transaction::find($request->transaction_id);
//        if($transaction){
//            if($transaction->payment_method == 'split'){
//                $cash = $check->transaction->cash - $productReturn->sub_total;
//                $transfer = $check->transaction->transfer;
//                $qris = $check->transaction->qris;
//            } else {
//                $cash = $check->transaction->cash != 0 ? $check->transaction->cash - $productReturn->sub_total : 0;
//                $transfer = $check->transaction->transfer != 0 ? $check->transaction->transfer - $productReturn->sub_total : 0;
//                $qris = $check->transaction->qris != 0 ? $check->transaction->qris - $productReturn->sub_total : 0;
//            }
//
//            $transaction->update([
//                'total' => $check->transaction->total - $productReturn->sub_total,
//                'grand_total' => $check->transaction->grand_total - $productReturn->sub_total,
//                'discount' => $check->transaction->discount - $productReturn->discount,
//                'cash' => $cash,
//                'transfer' => $transfer,
//                'qris' => $qris,
//            ]);
//        }

        // add notifikasi
        $notif = new ReturnNotif();
        $notif->product_id = $request->product_id;
        $notif->product_return_id = $productReturn->id;
        $notif->title = 'Ada produk yang dikembalikan oleh pelanggan';
        $notif->description = 'Product ' . $check->product_name . ' dengan nomor transaksi ' . $check->transaction->nota_number . ' dikembalikan oleh pelanggan';
        $notif->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Product return berhasil ditambahkan',
            'data' => $productReturn,
        ], 200);
    }

    public function show($id)
    {
        $productReturn = ProductReturn::find($id);
        $productReturn->load(['product', 'transaction', 'cashier']);

        if(!$productReturn){
            return response()->json([
                'status' => 'error',
                'message' => 'Product return tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Product return berhasil diambil',
            'data' => $productReturn,
        ], 200);
    }

    public function changeStatus(Request $request, $id)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:accepted,rejected',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 400);
        }

        $productReturn = ProductReturn::find($id);

        if(!$productReturn){
            return response()->json([
                'status' => 'error',
                'message' => 'Product return tidak ditemukan',
            ], 404);
        }

        $productReturn->status = $request->status;
        $productReturn->save();

//        if($request->status == 'rejected'){
//            // Update data di tabel transaction_details
//            $check = TransactionDetail::where('transaction_id', $productReturn->transaction_id)->where('product_id', $productReturn->product_id)->first();
//            $check->quantity = $check->quantity + $productReturn->quantity;
//            $check->sub_total = ($check->price * $check->quantity) - $check->discount;
//            $check->save();
//
//            // Update data di tabel transactions
//            $transaction = Transaction::find($request->transaction_id);
//            if($transaction){
//                if($transaction->payment_method == 'split'){
//                    $cash = $check->transaction->cash + $productReturn->sub_total;
//                    $transfer = $check->transaction->transfer;
//                    $qris = $check->transaction->qris;
//                } else {
//                    $cash = $check->transaction->cash != 0 ? $check->transaction->cash + $productReturn->sub_total : 0;
//                    $transfer = $check->transaction->transfer != 0 ? $check->transaction->transfer + $productReturn->sub_total : 0;
//                    $qris = $check->transaction->qris != 0 ? $check->transaction->qris + $productReturn->sub_total : 0;
//                }
//
//                $transaction->update([
//                    'total' => $check->transaction->total + $productReturn->sub_total,
//                    'grand_total' => $check->transaction->grand_total + $productReturn->sub_total,
//                    'discount' => $check->transaction->discount + $productReturn->discount,
//                    'cash' => $cash,
//                    'transfer' => $transfer,
//                    'qris' => $qris,
//                ]);
//            }
//        }

        if($request->status == 'accepted'){
            $product = Product::find($productReturn->product_id);

            // Update data di tabel transaction_details
            $check = TransactionDetail::where('transaction_id', $productReturn->transaction_id)->where('product_id', $productReturn->product_id)->first();
            $check->quantity = $check->quantity - $productReturn->quantity;
            $check->sub_total = ($check->price * $check->quantity) - $check->discount;
            $check->save();

            // check if quantity is 0, then delete the transaction detail
            if($check->quantity == 0){
                $check->delete();
            }

            // Update data di tabel transactions
            $transaction = Transaction::find($productReturn->transaction_id);
            if($transaction){
                if($transaction->payment_method == 'split'){
                    $cash = $check->transaction->cash - $productReturn->sub_total;
                    $transfer = $check->transaction->transfer;
                    $qris = $check->transaction->qris;
                } else {
                    $cash = $check->transaction->cash != 0 ? $check->transaction->cash - $productReturn->sub_total : 0;
                    $transfer = $check->transaction->transfer != 0 ? $check->transaction->transfer - $productReturn->sub_total : 0;
                    $qris = $check->transaction->qris != 0 ? $check->transaction->qris - $productReturn->sub_total : 0;
                }

                $transaction->update([
                    'total' => $check->transaction->total - $productReturn->sub_total,
                    'grand_total' => $check->transaction->grand_total - $productReturn->sub_total,
                    'discount' => $check->transaction->discount - $productReturn->discount,
                    'cash' => $cash,
                    'transfer' => $transfer,
                    'qris' => $qris,
                ]);

                // check if detail is empty, then delete the transaction
                if($transaction->details->isEmpty()){
                    $transaction->delete();
                }
            }

            if($product){
                $product->stock = $product->stock + $productReturn->quantity;
                $product->save();
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Status product return berhasil diubah',
            'data' => $productReturn->load(['product', 'cashier']),
        ], 200);
    }
}
