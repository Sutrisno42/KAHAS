<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Http\Requests\permissionRequest;
use App\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get all permissions
        $permission = Permission::with('menu')->with('user')->get();

        //return permissions
        return response()->json([
            'status' => 'success',
            'message' => 'Permission retrieved successfully',
            'data' => $permission,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(permissionRequest $request)
    {
        //create permission
        $permission = Permission::create($request->validated());

        //return permission
        return response()->json([
            'status' => 'success',
            'message' => 'Permission created successfully',
            'data' => $permission,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //search permission
        $permission = Permission::find($id);

        //permission not found
        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission not found',
            ], 404);
        }

        //return permission
        return response()->json([
            'status' => 'success',
            'message' => 'Permission retrieved successfully',
            'data' => $permission,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(permissionRequest $request, string $id)
    {
        //update permission
        $permission = Permission::find($id);

        //permission not found
        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission not found',
            ], 404);
        }

        $permission->update($request->validated());

        //return permission
        return response()->json([
            'status' => 'success',
            'message' => 'Permission updated successfully',
            'data' => $permission,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete permission
        $permission = Permission::find($id);

        //permission not found
        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission not found',
            ], 404);
        }

        $permission->delete();

        //return permission
        return response()->json([
            'status' => 'success',
            'message' => 'Permission deleted successfully',
            'data' => $permission,
        ], 200);
    }
}
