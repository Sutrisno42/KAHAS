<?php

namespace App\Http\Controllers;

use App\Http\Requests\productRequest;
use App\Models\Category;
use App\Models\HistoryRepack;
use App\Models\Product;
use App\Models\ProductExpired;
use App\Models\ProductOut;
use App\Models\ProductRefund;
use App\Models\StockOpname;
use App\Models\ProductUnit;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::with(['category', 'priceLists', 'stockOpname']);

        $limit = $request->limit ?? 10;

        $validate = Validator::make($request->all(), [
            'search' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'product_name' => 'nullable|string',
            'product_code' => 'nullable|string',
            'arrange_by' => 'nullable|in:product_name,product_code,created_at,category_id',
            'sort_by' => 'nullable|in:asc,desc',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validate->errors(),
            ], 400);
        }

        if ($request->search) {
            $products = $products->where('products.product_name', 'like', '%' . $request->search . '%')->orWhere('products.product_code', 'like', '%' . $request->search . '%');
        }

        if ($request->category_id) {
            $products = $products->where('products.category_id', $request->category_id);
        }

        if ($request->product_name) {
            $products = $products->where('products.product_name', 'like', '%' . $request->product_name . '%')->orWhere('products.product_code', 'like', '%' . $request->product_name . '%');
        }

        if ($request->product_code) {
            $products = $products->where('products.product_code', 'like', '%' . $request->product_code . '%');
        }

        if ($request->arrange_by) {
            $products = $products->orderBy('products.' . $request->arrange_by, $request->sort_by ? $request->sort_by : 'asc');
        }

        $products = $products->paginate($limit);

        //return products
        return response()->json([
            'status' => 'success',
            'message' => 'Products retrieved successfully',
            'data' => $products,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(productRequest $request)
    {
        //create product
        $date = new \DateTime();

        if($request->has('category_id') && $request->category_id != '') {
            $category_id = $request->category_id;
        } else {
            if($request->has('category_name') && $request->category_name != '' && $request->has('category_code') && $request->category_code != '') {
                $category = Category::create([
                    'category_name' => $request->category_name,
                    'code' => $request->category_code,
                ]);

                $category_id = $category->id;
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Nama dan kode kategori tidak boleh kosong',
                ], 400);
            }
        }

        $product = Product::create([
            'category_id' => $category_id,
            'product_name' => $request->product_name,
            'product_code' => $request->product_code,
            'stock' => $request->stock,
            'price' => $request->price,
            'discount' => $request->discount,
        ]);

        $stockOpname = StockOpname::create([
            'product_id' => $product->id,
            'supplier_id' => $request->supplier_id,
            'amount' => $request->stock,
            'hpp_price' => $request->hpp_price,
            'faktur_number' => $request->faktur_number,
            'faktur_date' =>  $date->format('Y-m-d'),
            'expired_date' => $request->expired_date,
            'expired_notif_date' => $request->expired_notif_date,
        ]);

        //input unit in array
        $unit = $request->unit_id;
        $unit_price = $request->unit_price;
        $minimum = $request->minimum;

        $priceList = [];

        foreach ($unit as $key => $value) {
            $productUnit = ProductUnit::create([
                'product_id' => $product->id,
                'unit_id' => $value,
                'price' => $unit_price[$key],
                'minimum' => $minimum[$key] ?? 1,
            ]);

            $priceList[] = $productUnit;
        }

        $data = [
            'product' => $product->load('category'),
            'stock_opname' => $stockOpname,
            'price_list' => $priceList
        ];

        //return product
        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'data' => $data,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show product
        $product = Product::where('products.id', $id)->with('category')->with('stockOpnames.supplier')->with('priceLists')->get();

        //product not found
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        //return product
        return response()->json([
            'status' => 'success',
            'message' => 'Product retrieved successfully',
            'data' => $product,
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(productRequest $request, string $id)
    {
        //update product
        $product = Product::find($id);
        $stockOpname = StockOpname::where('product_id',$id)->first();
        $productUnit = ProductUnit::where('product_id',$id)->delete();

        //product not found
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        //update product
        $product->update([
            'category_id' => $request->category_id,
            'product_name' => $request->product_name,
            'product_code' => $request->product_code,
            'stock' => $request->stock,
            'price' => $request->price,
            'discount' => $request->discount,
        ]);

        $stockOpname->update([
            'product_id' => $product->id,
            'supplier_id' => $request->supplier_id,
            'amount' => $request->stock,
            'hpp_price' => $request->hpp_price,
            'faktur_number' => $request->faktur_number,
            'expired_date' => $request->expired_date,
            'expired_notif_date' => $request->expired_notif_date,
        ]);

        //input unit in array
        $unit = $request->unit_id;
        $unit_price = $request->unit_price;
        $minimum = $request->minimum;

        foreach ($unit as $key => $value) {

            //create product unit
            $productUnitCreate = ProductUnit::create([
                'product_id' => $id,
                'unit_id' => $value,
                'price' => $unit_price[$key],
                'minimum' => $minimum[$key] ?? 1,
            ]);
        }

        $data = [
            'product' => $product,
            'stockOpname' => $stockOpname,
            'productUnit' => $productUnitCreate
        ];

        //return product
        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'data' => $data,
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete product
        $product = Product::find($id);

        //product not found
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        //delete product
        $product->delete();

        //return product
        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully',
        ], 200);
    }

    public function checkPrice(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'unit_id' => 'required|exists:units,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validate->errors(),
            ], 400);
        }

        $unitId = $request->unit_id;
        $productId = $request->product_id;
        $quantity = $request->quantity;

        $product = Product::find($productId);
        $productUnit = ProductUnit::where('product_id', $productId)->where('unit_id', $unitId)->where('minimum', '<=', $quantity)->orderBy('minimum', 'desc')->first();

        if (!$productUnit) {
            $price = $product->price;
            $discount = $product->discount;
            $subTotal = ($price * $quantity) - $discount;
        } else {
            $price = $productUnit->price;
            $discount = $product->discount;
            $subTotal = ($price * $quantity) - $discount;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Harga produk berhasil diambil',
            'data' => [
                'price' => $price,
                'discount' => $discount,
                'sub_total' => $subTotal,
            ]
        ], 200);
    }

    public function history($id) {
        $product = Product::find($id);

        if(!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        if(request()->has('start_date') && request()->has('end_date') && request()->start_date != '' && request()->end_date != '') {
            $startDate = request()->start_date;
            $endDate = request()->end_date;

            $stockOpnames = StockOpname::with('supplier')->where('amount', '>', 0)->where('product_id', $id)->whereBetween('created_at', [$startDate, $endDate])->orderBy('faktur_date', 'desc')->orderBy('id', 'DESC')->get();
            $productRefund = ProductRefund::where('product_id', $id)->whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc')->with('stockOpname.supplier')->get();
            $productExpired = ProductExpired::where('product_expireds.product_id', $id)
                ->join('stock_opnames', 'stock_opnames.id', '=', 'product_expireds.stock_opname_id')
                ->join('suppliers', 'suppliers.id', '=', 'stock_opnames.supplier_id')
                ->whereBetween('product_expireds.created_at', [$startDate, $endDate])
                ->orderBy('product_expireds.created_at', 'desc')
                ->select(['product_expireds.id as product_expired_id', 'product_expireds.product_id', 'product_expireds.total_expired as total', 'product_expireds.expired_date as date', 'product_expireds.note', 'product_expireds.responsible', 'suppliers.name as supplier_name', \DB::raw('product_expireds.total_expired * stock_opnames.hpp_price as nominal')])
                ->get();
            $productOut = ProductOut::where('product_outs.product_id', $id)
                ->join('stock_opnames', 'stock_opnames.id', '=', 'product_outs.stock_opname_id')
                ->join('suppliers', 'suppliers.id', '=', 'stock_opnames.supplier_id')
                ->whereBetween('product_outs.created_at', [$startDate, $endDate])
                ->orderBy('product_outs.created_at', 'desc')
                ->select(['product_outs.id as product_out_id', 'product_outs.product_id', 'product_outs.total_out as total', 'product_outs.out_date as date', 'product_outs.note', 'product_outs.responsible', 'suppliers.name as supplier_name', 'product_outs.nominal as nominal'])
                ->get();
            $transactions = TransactionDetail::where('product_id', $id)->whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc')->with('transaction.cashier')->get();
        } else {
            $stockOpnames = StockOpname::with('supplier')->where('amount', '>', 0)->where('product_id', $id)->orderBy('faktur_date', 'desc')->orderBy('id', 'DESC')->get();
            $productRefund = ProductRefund::where('product_id', $id)->orderBy('created_at', 'desc')->with('stockOpname.supplier')->get();
            $productExpired = ProductExpired::where('product_expireds.product_id', $id)
                ->join('stock_opnames', 'stock_opnames.id', '=', 'product_expireds.stock_opname_id')
                ->join('suppliers', 'suppliers.id', '=', 'stock_opnames.supplier_id')
                ->orderBy('product_expireds.created_at', 'desc')
                ->select(['product_expireds.id as product_expired_id', 'product_expireds.product_id', 'product_expireds.total_expired as total', 'product_expireds.expired_date as date', 'product_expireds.note', 'product_expireds.responsible', 'suppliers.name as supplier_name', \DB::raw('product_expireds.total_expired * stock_opnames.hpp_price as nominal')])
                ->get();
            $productOut = ProductOut::where('product_outs.product_id', $id)
                ->join('stock_opnames', 'stock_opnames.id', '=', 'product_outs.stock_opname_id')
                ->join('suppliers', 'suppliers.id', '=', 'stock_opnames.supplier_id')
                ->orderBy('product_outs.created_at', 'desc')
                ->select(['product_outs.id as product_out_id', 'product_outs.product_id', 'product_outs.total_out as total', 'product_outs.out_date as date', 'product_outs.note', 'product_outs.responsible', 'suppliers.name as supplier_name', 'product_outs.nominal as nominal'])
                ->get();
            $transactions = TransactionDetail::where('product_id', $id)->orderBy('created_at', 'desc')->with('transaction.cashier')->get();
        }

        $productExpired = $productExpired->map(function($item) {
            $item['type'] = 'expired';
            return $item;
        });

        $productOut = $productOut->map(function($item) {
            $item['type'] = 'out';
            return $item;
        });

        $productExpired = $productExpired->concat($productOut->toArray())->sortByDesc('created_at');

        return response()->json([
            'status' => 'success',
            'message' => 'Data riwayat produk berhasil diambil',
            'data' => [
                'product' => $product->load('category'),
                'stock_opnames' => $stockOpnames,
                'product_refund' => $productRefund,
                'product_expired' => $productExpired,
                'transactions' => $transactions,
            ],
        ], 200);
    }

    public function printLabel(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'product_id' => 'required|array',
            'product_id.*' => 'required|exists:products,id',
            'total' => 'required|array',
            'total.*' => 'required|integer',
            'expired_date' => 'required|array',
            'expired_date.*' => 'required|date',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validate->errors(),
            ], 400);
        }

        $product = Product::whereIn('id', $request->product_id)->get();

//        $expiredDate = StockOpname::where('product_id', $product->id)->where('expired_date', '>=', date('Y-m-d'))->orderBy('expired_date', 'asc')->first()->expired_date ?? null;
//
//        if(is_null($expiredDate)) {
//            $expiredDate = StockOpname::where('product_id', $product->id)->orderBy('expired_date', 'desc')->first()->expired_date ?? null;
//        }

        $packingDate = Carbon::now()->format('Y-m-d');

        $data = [];

        foreach($product as $key => $item) {
            $data[] = [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'product_code' => $item->product_code,
                'price' => floatval($item->price),
                'total' => intval($request->total[$key]),
                'price_total' => floatval($item->price) * intval($request->total[$key]),
                'packing_date' => $packingDate,
                'expired_date' => date('Y-m-d', strtotime($request->expired_date[$key])),
                'packing_date_formated' => Carbon::parse($packingDate)->locale('id')->isoFormat('dddd, D MMMM Y'),
                'expired_date_formated' => Carbon::parse($request->expired_date[$key])->locale('id')->isoFormat('dddd, D MMMM Y'),
            ];
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data label produk berhasil diambil',
            'data' => $data,
        ], 200);
    }

    public function repack(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'origin_product_id' => 'required|exists:products,id',
            'current_stock' => 'required|integer',
            'destination' => 'required|array',
            'destination.*.product_id' => 'required|exists:products,id',
            'destination.*.stock_added' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validate->errors(),
            ], 400);
        }

        $originProduct = Product::find($request->origin_product_id);

        if(is_null($originProduct)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // check stock
        if($request->current_stock > $originProduct->stock) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stok produk asal melebihi stok yang ada',
            ], 400);
        }

        if($request->current_stock == $originProduct->stock) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stok produk asal tidak berubah',
            ], 400);
        }

        $origin = HistoryRepack::create([
            'product_id' => $originProduct->id,
            'origin_id' => $originProduct->id,
            'quantity_in' => 0,
            'quantity_out' => $originProduct->stock - $request->current_stock,
            'type' => 'out',
            'date' => date('Y-m-d'),
        ]);

        $originProduct->update([
            'stock' => $request->current_stock,
        ]);

        $product_id = [];

        if($request->destination) {
            foreach($request->destination as $destination) {
                $destinationProduct = Product::find($destination['product_id']);

                if(is_null($destinationProduct)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Produk tujuan tidak ditemukan',
                    ], 404);
                }

                $destinationProduct->update([
                    'stock' => $destinationProduct->stock + $destination['stock_added'],
                ]);

                HistoryRepack::create([
                    'product_id' => $destinationProduct->id,
                    'origin_id' => $originProduct->id,
                    'destination_id' => json_encode([$destinationProduct->id]),
                    'quantity_in' => $destination['stock_added'],
                    'quantity_out' => 0,
                    'type' => 'in',
                    'date' => date('Y-m-d'),
                ]);

                $product_id[] = $destinationProduct->id;
            }
        }

        $origin->update([
            'destination_id' => json_encode($product_id),
        ]);

        $destinationProduct = Product::whereIn('id', $product_id)->with('category', 'stockOpnames.supplier', 'priceLists')->get();
        $originProduct->load('category', 'stockOpnames.supplier', 'priceLists');

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil di repack',
            'data' => [
                'origin_product' => $originProduct,
                'destination_product' => $destinationProduct,
            ]
        ], 200);
    }
}
