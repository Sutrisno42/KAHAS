<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReturn;
use App\Models\Transaction;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function index()
    {
        $user = auth('sanctum')->user();
        $transactions = Transaction::with(['details', 'cashier', 'cashier.store', 'member'])->orderBy('created_at', 'desc');
        $limit = request()->limit ?? 10;

        $validator = Validator::make(request()->all(), [
            'status' => 'nullable|in:paid,unpaid,hold,cancel',
            'date' => 'nullable|date',
            'nota_number' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'store_id' => 'nullable|exists:store,id',
            'arrange_by' => 'nullable|in:nota_number,date,category_id,grand_total',
            'sort_by' => 'nullable|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 400);
        }

        if (request()->status && request()->status != 'all' && !empty(request()->status)) {
            $transactions = $transactions->where('status', request()->status);
        }

        if (request()->has('date') && !empty(request()->date)) {
            $transactions = $transactions->where('date', request()->date);
        }

        if (request()->has('nota_number') && !empty(request()->nota_number)) {
            $transactions = $transactions->where('nota_number', 'like', '%' . request()->nota_number . '%');
        }

        if (request()->has('category_id') && !empty(request()->category_id)) {
            $transactions = $transactions->whereHas('details', function ($detail) {
                $detail->whereHas('product', function ($product) {
                    $product->where('category_id', request()->category_id);
                });
            });
        }

        if (request()->has('store_id') && !empty(request()->store_id)) {
            $transactions = $transactions->whereHas('cashier', function ($query) {
                $query->where('store_id', request()->store_id);
            });
        }

        if (request()->has('arrange_by') && !empty(request()->arrange_by)) {
            if (request()->arrange_by == 'category_id') {
                $transactions = $transactions->whereHas('details', function ($detail) {
                    $detail->whereHas('product', function ($product) {
                        $product->orderBy('category_id', request()->sort_by ? request()->sort_by : 'asc');
                    });
                });
            } else {
                $transactions = $transactions->orderBy(request()->arrange_by, request()->sort_by ? request()->sort_by : 'asc');
            }
        }

        if ($user->role == 'admin' || $user->role == 'warehouse') {
            $transactions = $transactions->paginate($limit);
        } else if ($user->role == 'cashier') {
            $transactions = $transactions->where('cashier_id', $user->id)->paginate($limit);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Transaksi berhasil diambil',
            'data' => $transactions,
        ], 200);
    }

    public function show($id)
    {
        $transaction = Transaction::with(['details', 'details.unit', 'cashier', 'cashier.store', 'member'])->findOrfail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaksi berhasil diambil',
            'data' => $transaction,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'nullable|exists:members,id',
            'discount' => 'required|numeric',
            'total' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'payment_method' => 'required|in:split,non_split',
            'products' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "Validasi gagal",
                'errors' => $validator->errors(),
            ], 400);
        } else {
            \DB::beginTransaction();
            $products = $request->products;

            $transaction = Transaction::create([
                'member_id' => $request->member_id ?? null,
                'cashier_id' => auth('sanctum')->user()->id,
                'nota_number' => $this->generateNotaNumber(),
                'date' => date('Y-m-d'),
                'hour' => date('H:i:s'),
                'status' => $request->status ?? 'paid',
                'discount' => $request->discount,
                'discount_global' => $request->discount_global ?? 0,
                'total' => $request->total,
                'grand_total' => $request->grand_total,
                'payment_method' => $request->payment_method,
                'cash' => 0,
                'transfer' => 0,
                'qris' => 0,
                'change' => 0,
            ]);

            if (isset($request->payment_discount) && $request->payment_discount > 0) {
                $transaction->payment_discount = ($request->total - $request->discount) * ($request->payment_discount / 100);
            }

            $transaction->payment_method = $request->payment_method;
            $transaction->cash = $request->cash ?? 0;
            $transaction->transfer = $request->transfer ?? 0;
            $transaction->qris = $request->qris ?? 0;
            $transaction->change = $request->change ?? 0;
            $transaction->save();

            foreach ($products as $product) {
                $check = Product::find($product['product_id']);

                if (!$check) {
                    \DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Produk tidak ditemukan',
                    ], 400);
                }

                if ($check->stock < $product['quantity_unit']) {
                    \DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Stok ' . $check->name . ' tidak mencukupi',
                    ], 400);
                }

                $unit = Unit::where('id', $product['unit_id'])->first();
                $unit_value = $unit->value ?? 1;
                $quantity_real = $product['quantity_unit'] * $unit_value;

                $transaction->details()->create([
                    'product_id' => $product['product_id'],
                    'unit_id' => $product['unit_id'],
                    'product_code' => $check['product_code'],
                    'product_name' => $check['product_name'],
                    'quantity' => $quantity_real,
                    'quantity_unit' => $product['quantity_unit'],
                    'price' => $product['price'],
                    'discount' => $product['discount'],
                    'sub_total' => $product['sub_total'],
                ]);

                if ($transaction->status != 'hold') {
                    $check->stock = $check->stock - $quantity_real;
                    $check->save();
                }
            }

            \DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil ditambahkan',
                'data' => $transaction->load(['details', 'cashier', 'member']),
            ], 200);
        }
    }

    public function useHold($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'nullable|exists:members,id',
            'discount' => 'required|numeric',
            'total' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'payment_method' => 'required|in:split,non_split',
            'products' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "Validasi gagal",
                'errors' => $validator->errors(),
            ], 400);
        }

        $transaction = Transaction::where('id', $id)->where('status', 'hold')->first();

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaksi tidak ditemukan',
            ]);
        } else {
            \DB::beginTransaction();
            $products = $request->products;

            $transaction->update([
                'member_id' => $request->member_id ?? null,
                'cashier_id' => auth('sanctum')->user()->id,
                'nota_number' => $this->generateNotaNumber(),
                'date' => date('Y-m-d'),
                'hour' => date('H:i:s'),
                'status' => 'paid',
                'discount' => $request->discount,
                'discount_global' => $request->discount_global ?? 0,
                'total' => $request->total,
                'grand_total' => $request->grand_total,
                'payment_method' => $request->payment_method,
                'cash' => 0,
                'transfer' => 0,
                'qris' => 0,
                'change' => 0,
            ]);

            if (isset($request->payment_discount) && $request->payment_discount > 0) {
                //              $transaction->payment_discount = ($request->total - $request->discount) - (($request->total - $request->discount) * ($request->payment_discount/100));
                $transaction->payment_discount = ($request->total - $request->discount) * ($request->payment_discount / 100);
            }

            $transaction->payment_method = $request->payment_method;
            $transaction->cash = $request->cash ?? 0;
            $transaction->transfer = $request->transfer ?? 0;
            $transaction->qris = $request->qris ?? 0;
            $transaction->change = $request->change ?? 0;
            $transaction->save();

            $transaction->details()->delete();

            foreach ($products as $product) {
                $check = Product::find($product['product_id']);

                if (!$check) {
                    \DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Produk tidak ditemukan',
                    ], 400);
                }

                if ($check->stock < $product['quantity_unit']) {
                    \DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Stok ' . $check->name . ' tidak mencukupi',
                    ], 400);
                }

                $unit = Unit::where('id', $product['unit_id'])->first();
                $unit_value = $unit->value ?? 1;
                $quantity_real = $product['quantity_unit'] * $unit_value;

                $transaction->details()->create([
                    'product_id' => $product['product_id'],
                    'unit_id' => $product['unit_id'],
                    'product_code' => $check['product_code'],
                    'product_name' => $check['product_name'],
                    'quantity' => $quantity_real,
                    'quantity_unit' => $product['quantity_unit'],
                    'price' => $product['price'],
                    'discount' => $product['discount'],
                    'sub_total' => $product['sub_total'],
                ]);

                $check->stock = $check->stock - $quantity_real;
                $check->save();
            }

            \DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil ditambahkan',
                'data' => $transaction->load(['details', 'cashier', 'member']),
            ], 200);
        }
    }

    private function generateNotaNumber()
    {
        $lastTransaction = Transaction::orderBy('created_at', 'desc')->where('date', date('Y-m-d'))->first();

        if ($lastTransaction) {
            $lastNotaNumber = $lastTransaction->nota_number;
            $lastNumber = explode('-', $lastNotaNumber)[2];
            $newNumber = intval($lastNumber) + 1;
            $newNumber = str_pad($newNumber, 5, '0', STR_PAD_LEFT);
            $newNotaNumber = 'TRX-' . date('Ymd') . '-' . $newNumber;
        } else {
            $newNumber = 1;
            $newNumber = str_pad($newNumber, 5, '0', STR_PAD_LEFT);
            $newNotaNumber = 'TRX-' . date('Ymd') . '-' . $newNumber;
        }

        return $newNotaNumber;
    }
}
