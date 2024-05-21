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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable()->comment('Kategori produk');
            $table->string('product_name')->comment('Nama produk');
            $table->string('product_code')->comment('Kode produk');
            $table->unsignedBigInteger('stock')->default(0)->comment('Stok produk');
            $table->double('price')->default(0)->comment('Harga produk');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
