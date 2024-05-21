<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get all categories
        $category = new Category();

        if(request()->has('category_name')){
            $category = $category->where('category_name', 'like', '%'.request()->category_name.'%');
        }

        if(request()->has('code')){
            $category = $category->where('code', 'like', '%'.request()->code.'%');
        }

        if (request()->has('arrange_by') && !empty(request()->arrange_by)) {
            $category = $category->orderBy(request()->arrange_by, request()->sort_by == 'desc' ? 'desc' : 'asc');
        }

        $category = $category->get();

        //return categories
        return response()->json([
            'status' => 'success',
            'message' => 'Category retrieved successfully',
            'data' => $category,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'category_name' => 'required|string',
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        //create category
        $category = Category::create($request->all());

        //return category
        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully',
            'data' => $category,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show category
        $category = Category::find($id);

        //category not found
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }

        //return category
        return response()->json([
            'status' => 'success',
            'message' => 'Category retrieved successfully',
            'data' => $category,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = \Validator::make($request->all(), [
            'category_name' => 'required|string',
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        //update category
        $category = Category::find($id);

        //category not found
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }

        $category->update($request->all());

        //return category
        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully',
            'data' => $category,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete category
        $category = Category::find($id);

        //category not found
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        //return category
        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully',
        ], 200);

    }
}
