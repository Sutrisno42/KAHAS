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
        Schema::create('prediksi_penjualan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk')->comment('Nama Produk');
            $table->integer('data1')->comment('September 2023');
            $table->integer('data2')->comment('October 2023');
            $table->integer('data3')->comment('November 2023');
            $table->integer('data4')->comment('Desember 2023');
            $table->integer('data5')->comment('Januari 2024');
            $table->timestamps();
            // $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prediksi_penjualan');
    }
};
