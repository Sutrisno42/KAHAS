<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CashierController extends Controller
{
    public function index()
    {
        $cashiers = User::where('role', 'cashier');
        $limit = request()->limit ?? 10;

        if (request()->has('name') && request('name') != '') {
            $cashiers = $cashiers->where('name', 'like', '%' . request('name') . '%');
        }

        if (request()->has('phone') && request('phone') != '') {
            $cashiers = $cashiers->where('phone', 'like', '%' . request('phone') . '%');
        }

        if (request()->has('username') && request('username') != '') {
            $cashiers = $cashiers->where('username', 'like', '%' . request('username') . '%');
        }

        if (request()->has('email') && request('email') != '') {
            $cashiers = $cashiers->where('email', 'like', '%' . request('email') . '%');
        }

        if (request()->has('arrange_by') && request('arrange_by') != '') {
            $cashiers = $cashiers->orderBy(request('arrange_by'), request('sort_by') ?? 'asc');
        }

        $cashiers = $cashiers->paginate($limit);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kasir berhasil diambil',
            'data' => $cashiers,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validator->errors(),
            ], 400);
        }

        $validate = $validator->validated();

        $validate['password'] = bcrypt(request('password'));
        $validate['role'] = 'cashier';

        $cashier = User::create($validate);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kasir berhasil ditambahkan',
            'data' => $cashier,
        ], 200);
    }

    public function show($id)
    {
        $cashier = User::where('role', 'cashier')->find($id);
        $cashier = $cashier->load(['transactions', 'dataShift']);

        if (!$cashier) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data kasir tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data kasir berhasil diambil',
            'data' => $cashier,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $cashier = User::where('role', 'cashier')->find($id);

        if (!$cashier) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data kasir tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make(request()->all(), [
            'name' => 'required|string',
            'username' => 'required|string|unique:users,username,' . $id,
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'required|string|unique:users,phone,' . $id,
            'password' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validator->errors(),
            ], 400);
        }

        $validate = $validator->validated();

        $validate['name'] = request('name');
        $validate['username'] = request('username');
        $validate['email'] = request('email');
        $validate['phone'] = request('phone');

        if (!empty(request('password') && request('password') != '')) {
            $validate['password'] = bcrypt(request('password'));
        }

        $cashier->update($validate);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kasir berhasil diubah',
            'data' => $cashier,
        ], 200);
    }

    public function destroy($id)
    {
        $cashier = User::where('role', 'cashier')->find($id);

        if (!$cashier) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data kasir tidak ditemukan',
            ], 404);
        }

        $cashier->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data kasir berhasil dihapus',
        ], 200);
    }
}
