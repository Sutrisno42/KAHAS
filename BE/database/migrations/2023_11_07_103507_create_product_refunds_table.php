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
        Schema::create('product_refunds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable()->comment('ID produk');
            $table->unsignedBigInteger('stock_opname_id')->nullable()->comment('ID opname');
            $table->bigInteger('total_refund')->default(0)->comment('Total refund');
            $table->double('nominal')->default(0)->comment('Nominal');
            $table->string('faktur_number')->comment('Nomor faktur')->nullable();
            $table->date('refund_date')->default(now())->comment('Tanggal refund')->nullable();
            $table->string('responsible')->comment('Penanggung jawab')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_refunds');
    }
};
