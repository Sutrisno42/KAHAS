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
        // product_id
        // product_name
        // product_code
        // price
        // quantity
        // discount
        // sub_total
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id')->nullable()->comment('ID transaksi');
            $table->unsignedBigInteger('product_id')->nullable()->comment('ID produk');
            $table->unsignedBigInteger('unit_id')->nullable()->comment('ID satuan');
            $table->string('product_name')->nullable()->comment('Nama produk, isi otomatis dari relas product_id');
            $table->string('product_code')->nullable()->comment('Kode produk, isi otomatis dari relasi product_id');
            $table->double('price')->default(0)->comment('Harga produk, isi otomatis dari relasi product_id');
            $table->bigInteger('quantity')->default(0)->comment('Jumlah produk');
            $table->bigInteger('quantity_unit')->default(0)->comment('Jumlah produk berdasarkan satuan');
            $table->double('discount')->default(0)->comment('Diskon produk');
            $table->double('sub_total')->default(0)->comment('Sub total produk, hitung dari (price * quantity) - discount');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
    }
};
