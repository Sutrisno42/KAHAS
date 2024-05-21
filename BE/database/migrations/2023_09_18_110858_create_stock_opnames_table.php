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
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable()->comment('Produk yang diopname');
            $table->unsignedBigInteger('supplier_id')->nullable()->comment('Supplier asal produk');
            $table->unsignedBigInteger('amount')->default(0)->comment('Jumlah produk');
            $table->double('hpp_price')->default(0)->comment('Harga pokok penjualan');
            $table->string('faktur_number')->comment('Nomor faktur')->nullable();
            $table->date('faktur_date')->default(now())->comment('Tanggal faktur')->nullable();
            $table->date('expired_date')->default(now())->comment('Tanggal kadaluarsa')->nullable();
            $table->date('expired_notif_date')->comment('Tanggal notifikasi kadaluarsa')->nullable();
            $table->string('note')->comment('Catatan')->nullable();
            $table->string('responsible')->comment('Penanggung jawab')->nullable();
            $table->boolean('exp_notif')->default(true)->comment('Notifikasi kadaluarsa')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opnames');
    }
};
