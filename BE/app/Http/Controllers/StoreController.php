<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        //get all store
        $store = new Store();

        if (request()->has('store_name')) {
            $store = $store->where('store_name', 'like', '%' . request()->store_name . '%');
        }

        // if (request()->has('arrange_by') && !empty(request()->arrange_by)) {
        //     $store = $store->orderBy(request()->arrange_by, request()->sort_by == 'desc' ? 'desc' : 'asc');
        // }

        $store = $store->get();

        //return store
        return response()->json([
            'status' => 'success',
            'message' => 'Store retrieved successfully',
            'data' => $store,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'store_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        //create store
        $store = Store::create($request->all());

        //return store
        return response()->json([
            'status' => 'success',
            'message' => 'store created successfully',
            'data' => $store,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show store
        $store = Store::find($id);

        //store not found
        if (!$store) {
            return response()->json([
                'status' => 'error',
                'message' => 'store not found',
            ], 404);
        }

        //return store
        return response()->json([
            'status' => 'success',
            'message' => 'store retrieved successfully',
            'data' => $store,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = \Validator::make($request->all(), [
            'store_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        //update store
        $store = Store::find($id);

        //store not found
        if (!$store) {
            return response()->json([
                'status' => 'error',
                'message' => 'store not found',
            ], 404);
        }

        $store->update($request->all());

        //return store
        return response()->json([
            'status' => 'success',
            'message' => 'store updated successfully',
            'data' => $store,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete store
        $store = Store::find($id);

        //store not found
        if (!$store) {
            return response()->json([
                'status' => 'error',
                'message' => 'store not found',
            ], 404);
        }

        $store->delete();

        //return store
        return response()->json([
            'status' => 'success',
            'message' => 'store deleted successfully',
        ], 200);
    }
}
