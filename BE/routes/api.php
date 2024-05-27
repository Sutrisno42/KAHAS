<?php

use App\Http\Controllers\StoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Menu\MenuController;
use App\Http\Controllers\Menu\PermissionController;
use App\Http\Controllers\Master\UnitController;
use App\Http\Controllers\Master\CategoriesController;
use App\Http\Controllers\Master\TransactionTypeController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DataShiftController;
use App\Http\Controllers\PrediksiPenjualanController;

Route::get('/', function () {
    return response([
        'status' => 'success',
        'code' => 200,
        'message' => 'This api is working',
        'data' => [
            'load_time' => date('Y-m-d H:i:s'),
            'load_speed' => microtime(true) - LARAVEL_START,
        ]
    ]);
});

//login
Route::post('auth/login', [App\Http\Controllers\Auth\LoginController::class, '__invoke']);

//group middleware
Route::middleware(['auth:sanctum'])->group(function () {
    //logout
    Route::post('auth/logout', [App\Http\Controllers\Auth\LogoutController::class, 'index']);
    //profile
    Route::get('auth/profile', [App\Http\Controllers\Auth\ProfileController::class, 'index']);

    //menu
    Route::apiResource('menu', MenuController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('menu/{id}', [App\Http\Controllers\Menu\MenuController::class, 'update']);

    //category
    Route::apiResource('master/category', CategoriesController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('master/category/{id}', [App\Http\Controllers\Master\CategoriesController::class, 'update']);

    //unit
    Route::apiResource('master/unit', UnitController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('master/unit/{id}', [App\Http\Controllers\Master\UnitController::class, 'update']);

    //permission
    Route::apiResource('permission', PermissionController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('permission/{id}', [App\Http\Controllers\Menu\PermissionController::class, 'update']);

    //transaction
    Route::apiResource('master/transaction-type', TransactionTypeController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('master/transaction-type/{id}', [App\Http\Controllers\Master\TransactionTypeController::class, 'update']);

    //supplier
    Route::apiResource('supplier', SupplierController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('supplier/{id}', [App\Http\Controllers\SupplierController::class, 'update']);

    //user
    Route::apiResource('user', UserController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('user/{id}', [App\Http\Controllers\User\UserController::class, 'update']);

    //member
    Route::apiResource('member', MemberController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('member/{id}', [App\Http\Controllers\MemberController::class, 'update']);

    //product
    Route::apiResource('product', ProductController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('product/{id}', [App\Http\Controllers\ProductController::class, 'update']);
    Route::get('product/{id}/history', [App\Http\Controllers\ProductController::class, 'history']);

    //data shift
    Route::apiResource('data-shift', DataShiftController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('data-shift/{id}', [App\Http\Controllers\DataShiftController::class, 'update']);

    // khusus untuk kasir
    Route::get('check-session', [App\Http\Controllers\DataShiftController::class, 'checkSesion']);
    Route::post('initial-balance', [App\Http\Controllers\DataShiftController::class, 'initialBalance']);
    Route::apiResource('transaction', App\Http\Controllers\TransactionController::class)->only(['index', 'store', 'show']);
    Route::post('transaction/{id}', [App\Http\Controllers\TransactionController::class, 'useHold']);
    Route::apiResource('product-return', App\Http\Controllers\ProductReturnController::class)->only(['index', 'store', 'show']);
    Route::post('product-return/{id}/status', [App\Http\Controllers\ProductReturnController::class, 'changeStatus']);
    Route::get('recap-shift', [App\Http\Controllers\DataShiftController::class, 'recap']);
    Route::post('check-price', [App\Http\Controllers\ProductController::class, 'checkPrice']);

    // untuk admin
    Route::get('dashboard', App\Http\Controllers\DashboardController::class);
    Route::apiResource('cashier', App\Http\Controllers\CashierController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('cashier/{id}', [App\Http\Controllers\CashierController::class, 'update']);
    Route::post('user/{id}/status', [App\Http\Controllers\User\UserController::class, 'changeStatus']);

    Route::apiResource('stock-opname', App\Http\Controllers\StockOpnameController::class)->only(['index', 'store', 'show']);
    Route::post('stock-opname/{id}', [App\Http\Controllers\StockOpnameController::class, 'update']);
    Route::post('stock-opname/{id}/exp-notif', [App\Http\Controllers\StockOpnameController::class, 'changeExpNotif']);
    Route::post('stock-opname/{id}/refund', [App\Http\Controllers\StockOpnameController::class, 'refund']);
    Route::post('stock-opname/{id}/approve', [App\Http\Controllers\StockOpnameController::class, 'approve']);

    Route::get('report/financial', [App\Http\Controllers\ReportController::class, 'financial']);
    Route::get('report/financial/{id}', [App\Http\Controllers\ReportController::class, 'financialDetail']);
    Route::get('report/sales', [App\Http\Controllers\ReportController::class, 'sales']);
    Route::get('report/sales/{id}', [App\Http\Controllers\ReportController::class, 'salesDetail']);

    Route::get('notification', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::get('notification/{id}/{type}', [App\Http\Controllers\NotificationController::class, 'show']);
    Route::get('notification/{id}/{type}/read', [App\Http\Controllers\NotificationController::class, 'read']);

    Route::apiResource('product-out', App\Http\Controllers\ProductOutController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('product-out/{id}', [App\Http\Controllers\ProductOutController::class, 'update']);

    Route::post('product-label', [App\Http\Controllers\ProductController::class, 'printLabel']);
    Route::post('product-repack', [App\Http\Controllers\ProductController::class, 'repack']);

    Route::apiResource('history-repack', App\Http\Controllers\HistoryRepackController::class)->only(['index', 'show']);

    //store
    Route::apiResource('store', StoreController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('store/{id}', [App\Http\Controllers\StoreController::class, 'update']);

    Route::apiResource('prediksi', PrediksiPenjualanController::class)->only(['index', 'store', 'show']);
});
