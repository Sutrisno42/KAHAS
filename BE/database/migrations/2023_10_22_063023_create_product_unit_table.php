<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductUnitTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_unit', function (Blueprint $table) {
            $table->foreignId('product_id')->onDelete('set null')->nullable()->comment('ID Produk ambil dari tabel products');
            $table->foreignId('unit_id')->onDelete('set null')->nullable()->comment('ID Satuan ambil dari tabel units');
            $table->integer('minimum')->nullable()->comment('Jumlah minimum produk');
            $table->double('price')->nullable()->comment('Harga produk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_unit');
    }
}
