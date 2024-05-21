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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nama customer');
            $table->string('code')->nullable()->comment('Kode customer');
            $table->string('phone')->nullable()->comment('Nomor telepon customer');
            $table->string('email')->nullable()->comment('Email customer');
            $table->text('address')->nullable()->comment('Alamat customer');
            $table->unsignedBigInteger('default_discount')->default(0)->comment('Diskon default customer');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
