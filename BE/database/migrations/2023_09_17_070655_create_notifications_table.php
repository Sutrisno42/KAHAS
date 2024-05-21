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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Judul notifikasi');
            $table->text('description')->nullable()->comment('Deskripsi notifikasi');
            $table->string('type')->default('info');
            $table->string('link')->nullable()->comment('Link notifikasi');
            $table->unsignedBigInteger('user_id')->nullable()->comment('User yang akan menerima notifikasi');
            $table->boolean('is_read')->default(false)->comment('Status notifikasi');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
