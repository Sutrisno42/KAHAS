<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\unitRequest;
use App\Models\Unit;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get all units
        $unit = Unit::all();

        //return units
        return response()->json([
            'status' => 'success',
            'message' => 'Unit retrieved successfully',
            'data' => $unit,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(unitRequest $request)
    {
        //create unit
        $unit = Unit::create($request->all());

        //return unit
        return response()->json([
            'status' => 'success',
            'message' => 'Unit created successfully',
            'data' => $unit,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show unit
        $unit = Unit::find($id);

        //unit not found
        if (!$unit) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unit not found',
            ], 404);
        }

        //return unit
        return response()->json([
            'status' => 'success',
            'message' => 'Unit retrieved successfully',
            'data' => $unit,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(unitRequest $request, string $id)
    {
        //update unit
        $unit = Unit::find($id);

        //unit not found
        if (!$unit) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unit not found',
            ], 404);
        }

        //update unit
        $unit->update($request->all());

        //return unit
        return response()->json([
            'status' => 'success',
            'message' => 'Unit updated successfully',
            'data' => $unit,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete unit
        $unit = Unit::find($id);

        //unit not found
        if (!$unit) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unit not found',
            ], 404);
        }

        //delete unit
        $unit->delete();

        //return unit
        return response()->json([
            'status' => 'success',
            'message' => 'Unit deleted successfully',
        ], 200);
    }
}
