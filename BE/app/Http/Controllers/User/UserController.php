<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\userRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //get all users with search
        if ($request->search) {
            $user = User::where('name', 'like', '%' . $request->search . '%')->paginate(10);
        } else {
            $user = User::paginate(10);
        }

        //return users
        return response()->json([
            'status' => 'success',
            'message' => 'User retrieved successfully',
            'data' => $user,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(userRequest $request)
    {
        //create user
        $user = User::create($request->validated());

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'data' => $user,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show user
        $user = User::with('permissions')->find($id);

        //if user not found
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        //return user
        return response()->json([
            'status' => 'success',
            'message' => 'User retrieved successfully',
            'data' => $user,
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string',
            'username' => 'required|string|unique:users,username,' . $id . ',id,deleted_at,NULL',
            'email' => 'required|email|unique:users,email,' . $id . ',id,deleted_at,NULL',
            'phone' => 'required|string|unique:users,phone,' . $id . ',id,deleted_at,NULL',
            'password' => 'nullable|string',
            'role' => 'required|string|in:admin,cashier,warehouse,price_check'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validator->errors(),
            ], 400);
        }

        //update user
        $user = User::find($id);

        //if user not found
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        if($request->has('password')){
            $user->password = bcrypt($request->password);
        }

        $user->name = $request->name;
        $user->username = $request->username;
        $user->phone = $request->phone;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->save();

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully',
            'data' => $user,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete user
        $user = User::find($id);

        //if user not found
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        //delete user
        $user->delete();

        //return data
        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully',
        ], 200);

    }

    public function changeStatus(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        $user->is_active = $request->is_active;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status user berhasil diubah',
            'data' => $user,
        ], 200);
    }
}
