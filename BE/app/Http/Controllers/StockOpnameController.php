<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductRefund;
use App\Models\ProductUnit;
use App\Models\StockOpname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockOpnameController extends Controller
{
    public function index()
    {
        $limit = request()->limit ?? 10;

        $product = Product::pluck('id')->toArray();

        // Subquery untuk mendapatkan record terbaru untuk setiap product_id
        $subQuery = StockOpname::select('product_id', DB::raw('MAX(updated_at) as latest_updated_at'))
            ->whereIn('product_id', $product)
            ->groupBy('product_id');

        $stockOpnames = StockOpname::with(['product', 'supplier', 'product.category'])
            ->joinSub($subQuery, 'latest_stock_opnames', function ($join) {
                $join->on('stock_opnames.product_id', '=', 'latest_stock_opnames.product_id')
                    ->on('stock_opnames.updated_at', '=', 'latest_stock_opnames.latest_updated_at');
            });

        if(request()->product_name && !empty(request()->product_name)){
            $stockOpnames = $stockOpnames->whereHas('product', function($query){
                $query->where('product_name', 'like', '%'.request()->product_name.'%')->orWhere('product_code', 'like', '%'.request()->product_name.'%');
            });
        }

        if(request()->product_code && !empty(request()->product_code)){
            $stockOpnames = $stockOpnames->whereHas('product', function($query){
                $query->where('product_code', 'like', '%'.request()->product_code.'%');
            });
        }

        if(request()->category_id && !empty(request()->category_id)){
            $stockOpnames = $stockOpnames->whereHas('product', function($query){
                $query->where('category_id', request()->category_id);
            });
        }

        if(request()->start_date && !empty(request()->start_date)){
            $stockOpnames = $stockOpnames->where('faktur_date', '>=', request()->start_date);
        }

        if(request()->end_date && !empty(request()->end_date)){
            $stockOpnames = $stockOpnames->where('faktur_date', '<=', request()->end_date);
        }

        if(request()->arrange_by && !empty(request()->arrange_by)){
            if(request()->arrange_by == 'input_date') {
                $stockOpnames = $stockOpnames->orderBy('faktur_date', request()->sort_by ? request()->sort_by : 'asc');
            } else {
                $stockOpnames = $stockOpnames->whereHas('product', function($query){
                    $query->orderBy(request()->arrange_by, request()->sort_by ? request()->sort_by : 'asc');
                });
            }
        } else {
            $stockOpnames = $stockOpnames->orderBy('latest_stock_opnames.latest_updated_at', 'desc');
        }

        $stockOpnames = $stockOpnames->paginate($limit);

        $stockOpnames->getCollection()->transform(function ($value) {
            $data = [
                'id' => $value->id,
                'product_id' => $value->product_id,
                'product_name' => $value->product->product_name,
                'product_code' => $value->product->product_code,
                'faktur_number' => $value->faktur_number,
                'faktur_date' => $value->faktur_date,
                'stock' => $value->product->stock,
                'hpp_price' => $value->hpp_price,
                'sub_total' => $value->product->stock * $value->hpp_price,
            ];

            return $data;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Data stock opname berhasil diambil',
            'data' => $stockOpnames,
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validator = \Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'supplier_id' => 'required|exists:suppliers,id',
                'amount' => 'required|integer',
                'hpp_price' => 'required|numeric',
                'expired_date' => 'required|date',
                'expired_notif_date' => 'required|date',
                'note' => 'nullable|string',
                'responsible' => 'nullable|string',
            ]);

            if($validator->fails()){
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            $stockOpname = new StockOpname();
            $stockOpname->product_id = $request->product_id;
            $stockOpname->supplier_id = $request->supplier_id;
            $stockOpname->amount = $request->amount;
            $stockOpname->hpp_price = $request->hpp_price;
            $stockOpname->faktur_number = $this->generateFakturNumber();
            $stockOpname->faktur_date = date('Y-m-d');
            $stockOpname->expired_date = $request->expired_date;
            $stockOpname->expired_notif_date = $request->expired_notif_date;
            $stockOpname->note = $request->note;
            $stockOpname->responsible = $request->responsible ?? 'Manager Pusat';
            $stockOpname->is_approved = true;
            $stockOpname->save();

            // di comment karena stock opname harus di approve dulu
             $product = $stockOpname->product;
             $product->stock = $product->stock + $stockOpname->amount;
             $product->save();

             if($request->has('unit_id') && $request->has('unit_price')) {
                 $unit = $request->unit_id;
                 $unit_price = $request->unit_price;
                 $minimum = $request->minimum;

                 $priceList = [];

                 foreach ($unit as $key => $value) {
                     $check = ProductUnit::where('product_id', $request->product_id)->where('unit_id', $value)->first();

                     if($check) {
                         DB::table('product_unit')
                             ->where('product_id', $request->product_id)
                             ->where('unit_id', $value)
                             ->update([
                                 'price' => $unit_price[$key],
                                 'minimum' => $minimum[$key] ?? 1,
                             ]);

                         $productUnit = $check;
                     } else {
                         $productUnit = new ProductUnit();
                         $productUnit->product_id = $request->product_id;
                         $productUnit->unit_id = $value;
                         $productUnit->price = $unit_price[$key];
                         $productUnit->minimum = $minimum[$key] ?? 1;
                         $productUnit->save();
                     }

                     $priceList[] = [
                        'unit_id' => $productUnit->unit_id,
                        'unit_name' => $productUnit->unit->unit_name,
                        'price' => $productUnit->price,
                        'minimum' => $productUnit->minimum,
                     ];
                 }
             }

            return response()->json([
                'status' => 'success',
                'message' => 'Data stock opname berhasil ditambahkan',
                'data' => [
                    'stock_opname' => $stockOpname,
                    'price_list' => $priceList ?? []
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($id)
    {
        $stockOpname = StockOpname::with(['product', 'supplier', 'product.category'])->find($id);

        if(!$stockOpname){
            return response()->json([
                'status' => 'error',
                'message' => 'Data stock opname tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data stock opname berhasil diambil',
            'data' => $stockOpname,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'supplier_id' => 'required|exists:suppliers,id',
            'hpp_price' => 'required|numeric',
            'amount' => 'required|integer',
            'note' => 'nullable|string',
            'responsible' => 'nullable|string',

            // nullable
            'product_id' => 'nullable|exists:products,id',
            'expired_date' => 'nullable|date',
            'expired_notif_date' => 'nullable|date',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $stockOpname = StockOpname::find($id);

        if(!$stockOpname){
            return response()->json([
                'status' => 'error',
                'message' => 'Data stock opname tidak ditemukan',
            ], 404);
        }

//        if($stockOpname->is_approved){
//            return response()->json([
//                'status' => 'error',
//                'message' => 'Data stock opname sudah di approve, tidak bisa diupdate',
//            ], 400);
//        }

        $product = $stockOpname->product;

        if(($product->stock - $stockOpname->amount) < 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stok produk pada data ini melebihi stok sekarang',
            ], 400);
        }

        $stockOpnameNew = StockOpname::find($id);
        $stockOpnameNew->product_id = $request->product_id ?? $stockOpname->product_id;
        $stockOpnameNew->supplier_id = $request->supplier_id;
        $stockOpnameNew->amount = $request->amount;
        $stockOpnameNew->hpp_price = $request->hpp_price;
        $stockOpnameNew->expired_date = $request->expired_date ?? $stockOpname->expired_date;
        $stockOpnameNew->expired_notif_date = $request->expired_notif_date ?? $stockOpname->expired_notif_date;
        $stockOpnameNew->note = $request->note ?? null;
        $stockOpnameNew->responsible = $request->responsible ?? null;
        $stockOpnameNew->is_approved = true;
        $stockOpnameNew->save();

        $product->stock = ($product->stock - $stockOpname->amount) + $stockOpnameNew->amount;
        $product->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Data stock opname berhasil diupdate',
            'data' => $stockOpnameNew->load('product')
        ], 200);
    }

    public function changeExpNotif(Request $request, $id) {
        $validator = \Validator::make($request->all(), [
            'exp_notif' => 'required|integer',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $stockOpname = StockOpname::find($id);
        $stockOpname->exp_notif = $request->exp_notif;
        $stockOpname->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Data stock opname berhasil diupdate',
            'data' => $stockOpname,
        ], 200);
    }

    public function refund(Request $request, $id) {
        $validator = \Validator::make($request->all(), [
            'amount' => 'required|integer',
            'responsible' => 'nullable|string',
            'note' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $stockOpname = StockOpname::find($id);

        if(!$stockOpname){
            return response()->json([
                'status' => 'error',
                'message' => 'Data stock opname tidak ditemukan',
            ], 404);
        }

        if($stockOpname->amount < $request->amount) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jumlah refund melebihi jumlah stock opname',
            ], 400);
        }

//        if($stockOpname->is_approved == false) {
//            return response()->json([
//                'status' => 'error',
//                'message' => 'Stock opname belum di approve',
//            ], 400);
//        }

        $stockOpname->amount = $stockOpname->amount - $request->amount;
        $stockOpname->save();

        $productRefund = new ProductRefund();
        $productRefund->stock_opname_id = $stockOpname->id;
        $productRefund->product_id = $stockOpname->product_id;
        $productRefund->total_refund = $request->amount;
        $productRefund->nominal = $request->amount * $stockOpname->hpp_price;
        $productRefund->faktur_number = $this->generateRefundNumber();
        $productRefund->refund_date = date('Y-m-d');
        $productRefund->responsible = $request->responsible ?? 'Manager Pusat';
        $productRefund->note = $request->note ?? null;
        $productRefund->status = $request->status ?? 'keluar';
        $productRefund->save();

        $product = $stockOpname->product;
        $product->stock = $product->stock - $request->amount;
        $product->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Data stock opname berhasil diupdate',
            'data' => $productRefund,
        ], 200);
    }

    public function approve($id) {
        $stockOpname = StockOpname::find($id);

        if(!$stockOpname){
            return response()->json([
                'status' => 'error',
                'message' => 'Data stock opname tidak ditemukan',
            ], 404);
        }

        if($stockOpname->is_approved){
            return response()->json([
                'status' => 'error',
                'message' => 'Data stock opname sudah di approve',
            ], 400);
        }

        $stockOpname->is_approved = true;
        $stockOpname->save();

        $product = $stockOpname->product;
        $product->stock = $product->stock + $stockOpname->amount;
        $product->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Data stock opname berhasil di approve',
            'data' => $stockOpname,
        ], 200);
    }

    private function generateFakturNumber()
    {
        $date = new \DateTime();
        $fakturNumber = 'F' . $date->format('YmdHis');
        return $fakturNumber;
    }

    private function generateRefundNumber()
    {
        $date = new \DateTime();
        $fakturNumber = 'R' . $date->format('YmdHis');
        return $fakturNumber;
    }
}
