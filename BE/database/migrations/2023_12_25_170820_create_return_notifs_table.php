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
        Schema::create('return_notifs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable()->comment('ID produk');
            $table->unsignedBigInteger('product_return_id')->nullable()->comment('ID retur');
            $table->string('title')->comment('Judul')->nullable();
            $table->text('description')->comment('Deskripsi')->nullable();
            $table->boolean('is_read')->default(false)->nullable()->comment('Status notifikasi');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_notifs');
    }
};
