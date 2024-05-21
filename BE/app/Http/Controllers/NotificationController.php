<?php

namespace App\Http\Controllers;

use App\Models\ExpiredNotif;
use App\Models\ReturnNotif;

class NotificationController extends Controller
{
    public function index()
    {
        $expired = ExpiredNotif::where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->select('*', \DB::raw("'expired' as type"))
            ->get();

        $return = ReturnNotif::where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->select('*', \DB::raw("'return' as type"))
            ->get();

        $notifications = $expired->toBase()->merge($return)->sortByDesc('created_at');
        $notifications = array_values($notifications->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Data notifikasi berhasil diambil',
            'data' => $notifications,
        ], 200);
    }

    public function show($id, $type)
    {
        if($type == 'return'){
            $notification = ExpiredNotif::with(['product', 'product.category', 'stockOpname'])->find($id);
        } else if($type == 'expired'){
            $notification = ReturnNotif::with(['product', 'product.category', 'productReturn'])->find($id);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Tipe notifikasi tidak sesuai',
            ], 404);
        }

        if(!$notification){
            return response()->json([
                'status' => 'error',
                'message' => 'Data notifikasi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data notifikasi berhasil diambil',
            'data' => $notification,
        ], 200);
    }

    public function read($id, $type)
    {
        if($type == 'return'){
            $notification = ReturnNotif::find($id);
        } else if($type == 'expired'){
            $notification = ExpiredNotif::find($id);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Tipe notifikasi tidak sesuai',
            ], 404);
        }

        if(!$notification){
            return response()->json([
                'status' => 'error',
                'message' => 'Data notifikasi tidak ditemukan',
            ], 404);
        }

        $notification->is_read = true;
        $notification->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi berhasil dibaca',
        ], 200);
    }
}
