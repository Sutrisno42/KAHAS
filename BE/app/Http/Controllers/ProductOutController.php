<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductOut;
use App\Models\StockOpname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductOutController extends Controller
{
    public function index()
    {
        $productOut = ProductOut::with(['product', 'stockOpname']);

        if(request()->has('product_name') && !empty(request()->product_name)){
            $productOut = $productOut->whereHas('product', function($product) {
                $product->where('name', 'like', '%' . request()->product_name . '%');
            });
        }

        if(request()->has('total_out') && !empty(request()->total_out)){
            $productOut = $productOut->where('total_out', request()->total_out);
        }

        if(request()->has('start_date') && !empty(request()->start_date)){
            $productOut = $productOut->where('out_date', '>=', request()->start_date);
        }

        if(request()->has('end_date') && !empty(request()->end_date)){
            $productOut = $productOut->where('out_date', '<=', request()->end_date);
        }

        if(request()->has('arrange_by') && !empty(request()->arrange_by)){
            $productOut = $productOut->orderBy(request()->arrange_by, request()->sort_by ? request()->sort_by : 'asc');
        }

        $productOut = $productOut->paginate(request()->limit ?? 10);

        return response()->json([
            'status' => 'success',
            'message' => 'Product out berhasil diambil',
            'data' => $productOut,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'stock_opname_id' => 'required|exists:stock_opnames,id',
            'total_out' => 'required|integer',
            'note' => 'nullable',
            'responsible' => 'nullable',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $stockOpname = StockOpname::find($request->stock_opname_id);
        $product = Product::find($stockOpname->product_id);
        $nominal = $stockOpname->hpp_price * $request->total_out;

        // cek stock product
        if($product->stock < $request->total_out){
            return response()->json([
                'status' => 'error',
                'message' => 'Stock product tidak mencukupi',
            ], 400);
        }

        // update stock product
        $product->stock = $product->stock - $request->total_out;
        $product->save();

        $productOut = ProductOut::create([
            'product_id' => $stockOpname->product_id,
            'stock_opname_id' => $request->stock_opname_id,
            'total_out' => $request->total_out,
            'nominal' => $nominal,
            'out_date' => now(),
            'note' => $request->note ?? null,
            'responsible' => $request->responsible ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product out berhasil ditambahkan',
            'data' => $productOut,
        ], 200);
    }

    public function show($id)
    {
        $productOut = ProductOut::find($id);

        if(!$productOut){
            return response()->json([
                'status' => 'error',
                'message' => 'Product out tidak ditemukan',
            ], 404);
        }

        $productOut->load(['product', 'stockOpname', 'stockOpname.supplier', 'product.category']);

        return response()->json([
            'status' => 'success',
            'message' => 'Product out berhasil diambil',
            'data' => $productOut,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'stock_opname_id' => 'exists:stock_opnames,id',
            'total_out' => 'integer',
            'note' => 'nullable',
            'responsible' => 'nullable',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $productOut = ProductOut::find($id);

        if(!$productOut){
            return response()->json([
                'status' => 'error',
                'message' => 'Product out tidak ditemukan',
            ], 404);
        }

        $stockOpname = StockOpname::find($request->stock_opname_id);
        $product = Product::find($stockOpname->product_id);
        $nominal = $stockOpname->hpp_price * $request->total_out;
        $stock_exist = $product->stock + $productOut->total_out;

        // cek stock product
        if($stock_exist < $request->total_out){
            return response()->json([
                'status' => 'error',
                'message' => 'Stock product tidak mencukupi',
            ], 400);
        }

        // update stock product
        $product->stock = $stock_exist - $request->total_out;
        $product->save();

        $productOut->update([
            'product_id' => $stockOpname->product_id ?? $productOut->product_id,
            'stock_opname_id' => $request->stock_opname_id ?? $productOut->stock_opname_id,
            'total_out' => $request->total_out ?? $productOut->total_out,
            'nominal' => $nominal ?? $productOut->nominal,
            'note' => $request->note ?? $productOut->note,
            'responsible' => $request->responsible ?? $productOut->responsible,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product out berhasil diupdate',
            'data' => $productOut,
        ], 200);
    }

    public function destroy($id)
    {
        $productOut = ProductOut::find($id);

        if(!$productOut){
            return response()->json([
                'status' => 'error',
                'message' => 'Product out tidak ditemukan',
            ], 404);
        }

        // update product
        $product = Product::find($productOut->product_id);
        $product->stock = $product->stock + $productOut->total_out;
        $product->save();

        $productOut->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product out berhasil dihapus',
        ], 200);
    }
}
