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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('member_id')->nullable()->comment('ID customer jika ada');
            $table->unsignedBigInteger('cashier_id')->nullable()->comment('ID kasir dari tabel users');
            $table->string('nota_number')->nullable()->comment('Nomor nota');
            $table->date('date')->comment('Tanggal transaksi');
            $table->time('hour')->comment('Jam transaksi');
            $table->string('status')->default('hold')->comment('Status transaksi');
            $table->double('discount')->default(0)->comment('Diskon transaksi');
            $table->double('discount_global')->default(0)->comment('Diskon global transaksi');
            $table->double('total')->default(0)->comment('Total transaksi');
            $table->double('grand_total')->default(0)->comment('Grand total transaksi');
            $table->enum('payment_method', ['cash', 'edc'])->default('cash')->comment('Metode pembayaran');
            $table->double('cash')->default(0)->comment('Jumlah uang yang dibayarkan');
            $table->double('edc')->default(0)->comment('Jumlah uang yang dibayarkan melalui EDC');
            $table->double('change')->default(0)->comment('Jumlah kembalian');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
