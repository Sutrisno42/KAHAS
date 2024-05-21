<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Http\Requests\menuRequest;
use App\Models\Menu;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get all menus
        $menu = Menu::all();

        //return menus
        return response()->json([
            'status' => 'success',
            'message' => 'Menu retrieved successfully',
            'data' => $menu,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(menuRequest $request)
    {
        //create menu
        $menu = Menu::create($request->validated());

        //return menu
        return response()->json([
            'status' => 'success',
            'message' => 'Menu created successfully',
            'data' => $menu,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show menu
        $menu = Menu::find($id);

        //menu not found
        if (!$menu) {
            return response()->json([
                'status' => 'error',
                'message' => 'Menu not found',
            ], 404);
        }

        //return menu
        return response()->json([
            'status' => 'success',
            'message' => 'Menu retrieved successfully',
            'data' => $menu,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(menuRequest $request, string $id)
    {
        //update menu
        $menu = Menu::find($id);

        //menu not found
        if (!$menu) {
            return response()->json([
                'status' => 'error',
                'message' => 'Menu not found',
            ], 404);
        }

        $menu->update($request->validated());

        //return menu
        return response()->json([
            'status' => 'success',
            'message' => 'Menu updated successfully',
            'data' => $menu,
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete menu
        $menu = Menu::find($id);

        //menu not found
        if (!$menu) {
            return response()->json([
                'status' => 'error',
                'message' => 'Menu not found',
            ], 404);
        }
        $menu->delete();

        //return menu
        return response()->json([
            'status' => 'success',
            'message' => 'Menu deleted successfully',
            'data' => $menu,
        ], 200);
    }
}
