<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('data_shifts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cashier_id')->nullable()->comment('ID kasir dari tabel users');
            $table->dateTime('start_date')->comment('Tanggal awal buka shift');
            $table->dateTime('end_date')->nullable()->comment('Tanggal akhir buka shift');
            $table->double('total_cash')->nullable()->comment('Total cash');
            $table->double('total_transfer')->nullable()->comment('Total transfer');
            $table->double('total_qris')->nullable()->comment('Total qris');
            $table->double('total_transaction')->nullable()->comment('Total transaksi');
            $table->double('discount_cash')->nullable()->comment('Diskon cash');
            $table->double('discount_transfer')->nullable()->comment('Diskon transfer');
            $table->double('discount_qris')->nullable()->comment('Diskon qris');
            $table->double('discount_total')->nullable()->comment('Diskon total');
            $table->integer('retur_total')->nullable()->comment('Total retur');
            $table->double('retur_nominal')->nullable()->comment('Nominal retur');
            $table->integer('nota_total')->nullable()->comment('Total nota');
            $table->double('initial_balance')->nullable()->comment('Saldo awal');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_shifts');
    }
};
