<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth('sanctum')->user()->with('permissions')->with('permissions.menu')->first();

        return response()->json($user, 200);
    }
}
