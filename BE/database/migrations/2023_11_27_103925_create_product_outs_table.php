<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_outs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable()->comment('ID produk');
            $table->unsignedBigInteger('stock_opname_id')->nullable()->comment('ID stock opname');
            $table->bigInteger('total_out')->nullable()->comment('Total out');
            $table->double('nominal')->nullable()->comment('Nominal');
            $table->dateTime('out_date')->nullable()->comment('Tanggal out');
            $table->string('note')->nullable()->comment('Catatan');
            $table->string('responsible')->nullable()->comment('Penanggung jawab');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_outs');
    }
};
