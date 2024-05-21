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
        Schema::create('product_expireds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable()->comment('ID produk');
            $table->unsignedBigInteger('stock_opname_id')->nullable()->comment('ID opname');
            $table->bigInteger('total_expired')->default(0)->comment('Total expired');
            $table->string('note')->comment('Catatan')->nullable();
            $table->string('responsible')->comment('Penanggung jawab')->nullable();
            $table->date('expired_date')->default(now())->comment('Tanggal kadaluarsa')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_expireds');
    }
};
