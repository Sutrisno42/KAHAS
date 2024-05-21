<?php

namespace App\Http\Controllers;

use App\Http\Requests\supplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $suppliers = new Supplier();

        if ($request->name) {
            $suppliers = $suppliers->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->phone) {
            $suppliers = $suppliers->where('phone', 'like', '%' . $request->phone . '%');
        }

        if ($request->arrange_by) {
            $suppliers = $suppliers->orderBy($request->arrange_by, $request->sort_by ? $request->sort_by : 'asc');
        }

        //get all suppliers with search
        if ($request->search) {
            $suppliers = $suppliers->with('products')->where('name', 'like', '%' . $request->search . '%')->paginate(10);
        } else {
            $suppliers = $suppliers->with('products')->paginate(10);
        }

        foreach ($suppliers as $supplier) {
            $supplier->products = $supplier->products->groupBy('id');
        }

        //return suppliers
        return response()->json([
            'status' => 'success',
            'message' => 'Suppliers retrieved successfully',
            'data' => $suppliers,
        ], 200);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(supplierRequest $request)
    {
        //create supplier
        $supplier = Supplier::create($request->validated());

        //return supplier
        return response()->json([
            'status' => 'success',
            'message' => 'Supplier created successfully',
            'data' => $supplier,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show supplier
        $supplier = Supplier::where('suppliers.id', $id)->with(['products', 'products.stockOpnames'])->first();

        //supplier not found
        if (!$supplier) {
            return response()->json([
                'status' => 'error',
                'message' => 'Supplier not found',
            ], 404);
        }

        //return supplier
        return response()->json([
            'status' => 'success',
            'message' => 'Supplier retrieved successfully',
            'data' => $supplier,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(supplierRequest $request, string $id)
    {
        //update supplier
        $supplier = Supplier::find($id);

        //supplier not found
        if (!$supplier) {
            return response()->json([
                'status' => 'error',
                'message' => 'Supplier not found',
            ], 404);
        }

        $supplier->update($request->validated());

        //return supplier
        return response()->json([
            'status' => 'success',
            'message' => 'Supplier updated successfully',
            'data' => $supplier,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete supplier
        $supplier = Supplier::find($id);

        //supplier not found
        if (!$supplier) {
            return response()->json([
                'status' => 'error',
                'message' => 'Supplier not found',
            ], 404);
        }

        $supplier->delete();

        //return supplier
        return response()->json([
            'status' => 'success',
            'message' => 'Supplier deleted successfully',
        ], 200);

    }
}
