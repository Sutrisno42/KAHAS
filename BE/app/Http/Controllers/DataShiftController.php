<?php

namespace App\Http\Controllers;

use App\Models\ProductReturn;
use Illuminate\Http\Request;
use App\Models\DataShift;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\DataShiftRequest;
use Illuminate\Support\Facades\Validator;

class DataShiftController extends Controller
{
    public function index()
    {
        $user = auth('sanctum')->user();
        $validator = Validator::make(request()->all(), [
            'cashier_name' => 'nullable|string',
            'date' => 'nullable|date',
            'arrange_by' => 'nullable|in:cashier_name,date',
            'sort_by' => 'nullable|in:asc,desc',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 400);
        }

        $dataShift = new DataShift;

        if($user->role == 'admin' || $user->role == 'warehouse'){
            if(request()->has('date') && !empty(request()->date)){
                $dataShift = $dataShift->whereDate('start_date', request()->date);
            }

            if(request()->has('cashier_name') && !empty(request()->cashier_name)){
                $dataShift = $dataShift->whereHas('cashier', function($cashier) {
                    $cashier->where('name', 'like', '%' . request()->cashier_name . '%');
                });
            }

            if(request()->has('arrange_by') && !empty(request()->arrange_by)){
                if(request()->arrange_by == 'date'){
                    $dataShift = $dataShift->orderBy('start_date', request()->sort_by ? request()->sort_by : 'asc');
                } else if (request()->arrange_by == 'cashier_name'){
                    $dataShift = $dataShift->with(['cashier' => function($cashier){
                        $cashier->orderBy('name', request()->sort_by ? request()->sort_by : 'asc');
                    }]);
                } else {
                    $dataShift = $dataShift->orderBy(request()->arrange_by, request()->sort_by ? request()->sort_by : 'asc');
                }
            }

            $dataShift = $dataShift->with('cashier')->paginate(request()->limit ?? 10);
        } else if($user->role == 'cashier'){
            $dataShift = $dataShift->where('cashier_id', $user->id)->with('cashier')->paginate(request()->limit ?? 10);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses',
            ], 401);
        }

        //return data shift
        return response()->json([
            'status' => 'success',
            'message' => 'Data shift retrieved successfully',
            'data' => $dataShift,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DataShiftRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'total_cash' => 'nullable|numeric',
            'total_transfer' => 'nullable|numeric',
            'total_qris' => 'nullable|numeric',
            'total_change' => 'nullable|numeric',
            'total_transaction' => 'nullable|numeric',
            'discount_transaction' => 'nullable|numeric',
            'discount_payment' => 'nullable|numeric',
            'discount_total' => 'nullable|numeric',
            'retur_total' => 'nullable|numeric',
            'retur_nominal' => 'nullable|numeric',
            'nota_total' => 'nullable|numeric',
            'initial_balance' => 'nullable|numeric',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validator->errors(),
            ], 400);
        }

        $user = auth('sanctum')->user();
        $check = DataShift::where('cashier_id', $user->id)->where('end_date', null)->first();

        if(!$check){
            return response()->json([
                'status' => 'error',
                'message' => 'Sesi shift belum ada',
            ], 400);
        } else {
            $transaction = Transaction::where('cashier_id', $user->id)
                ->where('status', 'paid')
                ->where('created_at', '>=', $check->start_date)
                ->where('created_at', '<=', date('Y-m-d H:i:s'))
                ->get();

            $retur = ProductReturn::whereHas('transaction', function($transaction) use ($user){
                        $transaction->where('cashier_id', $user->id)->where('status', 'paid');
                    })->where('created_at', '>=', $check->start_date)
                    ->where('created_at', '<=', date('Y-m-d H:i:s'))
                    ->get();

            $check->update([
                'end_date' => date('Y-m-d H:i:s'),
                'total_cash' => $request->total_cash ?? $transaction->sum('cash'),
                'total_transfer' => $request->total_transfer ?? $transaction->sum('transfer'),
                'total_qris' => $request->total_qris ?? $transaction->sum('qris'),
                'total_change' => $request->total_change ?? $transaction->sum('change'),
                'total_transaction' => $request->total_transaction ?? $transaction->sum('grand_total'),
                'discount_transaction' => $request->discount_transaction ?? $transaction->sum('discount'),
                'discount_payment' => $request->discount_payment ?? $transaction->sum('payment_discount'),
                'discount_total' => $request->discount_total ?? $transaction->sum('discount') + $transaction->sum('payment_discount'),
                'retur_total' => $request->retur_total ?? $retur->count(),
                'retur_nominal' => $request->retur_nominal ?? $retur->sum('sub_total'),
                'nota_total' => $request->nota_total ?? $transaction->count(),
            ]);

            $response = [
                'cashier_id' => $user->id,
                'cashier_name' => $user->name,
                'start_date' => date('d-m-Y H:i:s', strtotime($check->start_date)),
                'end_date' => date('d-m-Y H:i:s', strtotime($check->end_date)),
                'total_cash' => $check->total_cash,
                'total_transfer' => $check->total_transfer,
                'total_qris' => $check->total_qris,
                'total_change' => $check->total_change,
                'total_transaction' => $check->total_transaction,
                'discount_transaction' => $check->discount_transaction,
                'discount_payment' => $check->discount_payment,
                'discount_total' => $check->discount_total,
                'retur_total' => $check->retur_total,
                'retur_nominal' => $check->retur_nominal,
                'nota_total' => $check->nota_total,
                'initial_balance' => $check->initial_balance,
            ];

            // logout
            auth('sanctum')->user()->tokens()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Sesi shift berhasil ditutup',
                'data' => $response,
            ], 200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show data shift
        $dataShift = DataShift::where('id', $id)->with('cashier')->get();

        //data shift not found
        if (!$dataShift) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data shift not found',
            ], 404);
        }

        //return data shift
        return response()->json([
            'status' => 'success',
            'message' => 'Data shift retrieved successfully',
            'data' => $dataShift,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DataShiftRequest $request, string $id)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete data shift
        $dataShift = DataShift::find($id);

        //data shift not found
        if (!$dataShift) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data shift not found',
            ], 404);
        }

        //delete data shift
        $dataShift->delete();

        //return data shift
        return response()->json([
            'status' => 'success',
            'message' => 'Data shift deleted successfully',
        ], 200);
    }

    public function checkSesion() {
        $checkAda = DataShift::where('cashier_id', auth('sanctum')->user()->id)->where('end_date',null)->first();

        if($checkAda){
            return response()->json([
                'status' => 'success',
                'message' => 'Sesi shift masih ada',
                'data' => [
                    'sesi' => 'active'
                ]
            ], 200);
        }else{
            return response()->json([
                'status' => 'success',
                'message' => 'Sesi shift belum ada',
                'data' => [
                    'sesi' => 'inactive',
                ]
            ], 200);
        }
    }

    public function initialBalance(Request $request) {
        $validator = Validator::make($request->all(), [
            'initial_balance' => 'required|numeric',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'data' => $validator->errors(),
            ], 400);
        }

        $check = DataShift::where('cashier_id', auth('sanctum')->user()->id)->where('end_date',null)->first();

        if($check){
            return response()->json([
                'status' => 'error',
                'message' => 'Sesi shift sudah ada',
            ], 400);
        }

        $data =  DataShift::create([
            'cashier_id' => auth('sanctum')->user()->id,
            'start_date' => date('Y-m-d H:i:s'),
            'initial_balance' => $request->initial_balance,
        ]);

        $response = [
            'cashier_id' => auth('sanctum')->user()->id,
            'chasier_name' => auth('sanctum')->user()->name,
            'initial_balance' => $data->initial_balance,
            'start_date' => date('d-m-Y H:i:s', strtotime($data->start_date)),
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Saldo awal berhasil ditambahkan',
            'data' => $response,
        ], 200);
    }

    public function recap() {
        $user = auth('sanctum')->user();
        $check = DataShift::where('cashier_id', $user->id)->where('end_date', null)->first();

        if(!$check){
            return response()->json([
                'status' => 'error',
                'message' => 'Sesi shift belum ada',
            ], 400);
        } else {
            $transaction = Transaction::where('cashier_id', $user->id)
                ->where('status', 'paid')
                ->where('created_at', '>=', $check->start_date)
                ->where('created_at', '<=', date('Y-m-d H:i:s'))
                ->get();

            $retur = ProductReturn::whereHas('transaction', function($transaction) use ($user){
                $transaction->where('cashier_id', $user->id)->where('status', 'paid');
            })->where('created_at', '>=', $check->start_date)
                ->where('created_at', '<=', date('Y-m-d H:i:s'))
                ->get();

            $cashTransaction = $transaction->where('cash', '>', 0);
            $totalChange = $cashTransaction->sum('change');

            $response = [
                'cashier_id' => $user->id,
                'cashier_name' => $user->name,
                'start_date' => date('d-m-Y', strtotime($check->start_date)),
                'start_time' => date('H:i:s', strtotime($check->start_date)),
                'end_date' => date('d-m-Y'),
                'end_time' => date('H:i:s'),
                'total_cash' => $transaction->sum('cash') - $totalChange,
                'total_transfer' => $transaction->sum('transfer'),
                'total_qris' => $transaction->sum('qris'),
                'total_change' => $transaction->sum('change'),
                'total_transaction' => $transaction->sum('grand_total'),
                'discount_transaction' => $transaction->sum('discount'),
                'discount_payment' => $transaction->sum('payment_discount'),
                'discount_total' => $transaction->sum('discount') + $transaction->sum('payment_discount'),
                'retur_total' => $retur->count(),
                'retur_nominal' => $retur->sum('sub_total'),
                'nota_total' => $transaction->count(),
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'Rekap shift berhasil diambil',
                'data' => $response,
            ], 200);
        }
    }
}
