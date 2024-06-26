<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            $respone['message'] = $validator->errors();

            return response()->json($respone, 201);
        } else {

            // $user = User::whereUsername($request->username)->first();
            $user = User::whereUsername($request->username)->with('store')->first();

            if (!$user || !Hash::check($request->password, $user->password)) {

                $data['message'] = 'Username atau password salah !';

                return response()->json($data, 401);
            } else {
                if (!$user->is_active) {
                    $data['message'] = 'Akun anda dinonaktifkan, silahkan hubungi admin !';

                    return response()->json($data, 401);
                }

                $data['message'] = 'Berhasil login';
                $data['data'] = [
                    'token' => $user->createToken("API TOKEN")->plainTextToken,
                    'user' => $user,
                ];
                $data['errors'] = '';
            }
        }

        return response()->json($data, 200);
    }
}
