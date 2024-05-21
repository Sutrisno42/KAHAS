<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberRequest;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $members = new Member();
        $limit = $request->limit ?? 10;

        if ($request->has('search') && !empty($request->search)) {
            $members = Member::where('name', 'like', '%' . $request->search . '%');
        }

        if($request->has('name') && !empty($request->name)){
            $members = $members->where('name', 'like', '%' . $request->name . '%');
        }

        if($request->has('code') && !empty($request->code)){
            $members = $members->where('code', 'like', '%' . $request->code . '%');
        }

        if($request->has('phone') && !empty($request->phone)){
            $members = $members->where('phone', 'like', '%' . $request->phone . '%');
        }

        if($request->has('email') && !empty($request->email)){
            $members = $members->where('email', 'like', '%' . $request->email . '%');
        }

        if($request->has('address') && !empty($request->address)){
            $members = $members->where('address', 'like', '%' . $request->address . '%');
        }

        if($request->has('arrange_by') && !empty($request->arrange_by)){
            $members = $members->orderBy($request->arrange_by, $request->sort_by ? $request->sort_by : 'asc');
        }

        $members = $members->paginate($limit);

        return response()->json([
            'status' => 'success',
            'message' => 'Data member berhasil diambil',
            'data' => $members,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MemberRequest $request)
    {
        //create member
        $member = Member::create($request->validated());

        //return member
        return response()->json([
            'status' => 'success',
            'message' => 'Member created successfully',
            'data' => $member,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show member
        $member = Member::find($id);

        //member not found
        if (!$member) {
            return response()->json([
                'status' => 'error',
                'message' => 'Member not found',
            ], 404);
        }

        $member->load('transactions');

        //return member
        return response()->json([
            'status' => 'success',
            'message' => 'Member retrieved successfully',
            'data' => $member,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MemberRequest $request, string $id)
    {
        //update member
        $member = Member::find($id);

        //member not found
        if (!$member) {
            return response()->json([
                'status' => 'error',
                'message' => 'Member not found',
            ], 404);
        }

        //update member
        $member->update($request->validated());

        //return member
        return response()->json([
            'status' => 'success',
            'message' => 'Member updated successfully',
            'data' => $member,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete member
        $member = Member::find($id);

        //member not found
        if (!$member) {
            return response()->json([
                'status' => 'error',
                'message' => 'Member not found',
            ], 404);
        }

        $member->delete();

        //return member
        return response()->json([
            'status' => 'success',
            'message' => 'Member deleted successfully',
            'data' => $member,
        ], 200);
    }
}
