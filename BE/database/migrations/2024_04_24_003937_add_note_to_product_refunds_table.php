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
        Schema::table('product_refunds', function (Blueprint $table) {
            $table->text('note')->nullable()->after('responsible');
            $table->string('status')->default('keluar')->after('note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_refunds', function (Blueprint $table) {
            $table->dropColumn('note');
            $table->dropColumn('status');
        });
    }
};
