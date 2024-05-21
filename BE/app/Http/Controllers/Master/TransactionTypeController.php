<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\transactionTypeRequest;
use App\Models\TransactionType;

class TransactionTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get all data
        $transactionType = TransactionType::all();

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'Transaction Type retrieved successfully',
            'data' => $transactionType,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(transactionTypeRequest $request)
    {
        //create transaction type
        $transactionType = TransactionType::create($request->validated());

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'Transaction Type created successfully',
            'data' => $transactionType,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //search transaction type
        $transactionType = TransactionType::find($id);

        //transaction type not found
        if (!$transactionType) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Transaction Type not found',
            ], 404);
        }

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'Transaction Type retrieved successfully',
            'data' => $transactionType,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(transactionTypeRequest $request, string $id)
    {
        //update transaction type
        $transactionType = TransactionType::find($id);

        //transaction type not found
        if (!$transactionType) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Transaction Type not found',
            ], 404);
        }

        //update transaction type
        $transactionType->update($request->validated());

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'Transaction Type updated successfully',
            'data' => $transactionType,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete transaction type
        $transactionType = TransactionType::find($id);

        //transaction type not found
        if (!$transactionType) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Transaction Type not found',
            ], 404);
        }

        //delete transaction type
        $transactionType->delete();

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'Transaction Type deleted successfully',
        ], 200);
    }
}
