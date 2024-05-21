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
        Schema::create('product_returns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id')->nullable()->comment('ID transaksi');
            $table->unsignedBigInteger('product_id')->nullable()->comment('ID produk');
            $table->string('product_name')->nullable()->comment('Nama produk, isi otomatis dari relasi transaction detail');
            $table->string('product_code')->nullable()->comment('Kode produk, isi otomatis dari relasi transaction detail');
            $table->double('price')->default(0)->comment('Harga produk, isi otomatis dari relasi transaction detail');
            $table->bigInteger('quantity')->default(0)->comment('Jumlah produk');
            $table->double('discount')->default(0)->comment('Diskon produk');
            $table->double('sub_total')->default(0)->comment('Sub total produk, hitung dari (price * quantity) - discount');
            $table->string('reason')->nullable()->comment('Alasan pengembalian produk');
            $table->string('status')->default('pending')->comment('Status pengembalian produk');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_returns');
    }
};
