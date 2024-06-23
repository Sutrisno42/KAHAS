<?php

namespace App\Http\Controllers;

use App\Models\PrediksiPenjualan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PrediksiPenjualanController extends Controller
{
    //
    public function index(Request $request)
    {
        $prediksiPenjual = new PrediksiPenjualan();

        $validate = Validator::make($request->all(), [
            'search' => 'nullable|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validate->errors(),
            ], 400);
        }

        if ($request->search) {
            $prediksiPenjual = $prediksiPenjual->where('prediksi_penjualan.nama_produk', 'like', '%' . $request->search . '%');
        }

        if (request()->has('nama_produk')) {
            $prediksiPenjual = $prediksiPenjual->where('nama_produk', 'like', '%' . request()->nama_produk . '%');
        }
        if (request()->has('data1')) {
            $prediksiPenjual = $prediksiPenjual->where('data1', 'like', '%' . request()->data1  . '%');
        }
        if (request()->has('data2')) {
            $prediksiPenjual = $prediksiPenjual->where('data2', 'like', '%' . request()->data2 . '%');
        }
        if (request()->has('data3')) {
            $prediksiPenjual = $prediksiPenjual->where('data3', 'like', '%' . request()->data3 . '%');
        }
        if (request()->has('data4')) {
            $prediksiPenjual = $prediksiPenjual->where('data4', 'like', '%' . request()->data4 . '%');
        }
        if (request()->has('data5')) {
            $prediksiPenjual = $prediksiPenjual->where('data5', 'like', '%' . request()->data5 . '%');
        }

        $prediksiPenjual = $prediksiPenjual->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Prediksi retrieved successfully',
            'data' => $prediksiPenjual,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'nama_produk' => 'required|string',
            'data1' => 'required|integer',
            'data2' => 'required|integer',
            'data3' => 'required|integer',
            'data4' => 'required|integer',
            'data5' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        //create category
        $prediksiPenjualan = PrediksiPenjualan::create($request->all());

        //return prediksi
        return response()->json([
            'status' => 'success',
            'message' => 'prediksi created successfully',
            'data' => $prediksiPenjualan,
        ], 200);
    }

    public function show(string $id)
    {
        //show product
        $prediksiPenjual = PrediksiPenjualan::where('id', $id)->get();

        //predik not found
        if (!$prediksiPenjual) {
            return response()->json([
                'status' => 'error',
                'message' => 'predik not found',
            ], 404);
        }

        //return predik
        return response()->json([
            'status' => 'success',
            'message' => 'predik retrieved successfully',
            'data' => $prediksiPenjual,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string',
            'data1' => 'required|integer',
            'data2' => 'required|integer',
            'data3' => 'required|integer',
            'data4' => 'required|integer',
            'data5' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $prediksiPenjualan = PrediksiPenjualan::find($id);

        if (!$prediksiPenjualan) {
            return response()->json([
                'status' => 'error',
                'message' => 'prediksi not found',
            ], 404);
        }

        $prediksiPenjualan->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'prediksi updated successfully',
            'data' => $prediksiPenjualan,
        ], 200);
    }

    public function destroy($id)
    {
        $prediksiPenjualan = PrediksiPenjualan::find($id);

        if (!$prediksiPenjualan) {
            return response()->json([
                'status' => 'error',
                'message' => 'prediksi not found',
            ], 404);
        }

        $prediksiPenjualan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'prediksi deleted successfully',
        ], 200);
    }
}
