<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('payment_method', ['split', 'non_split'])->default('non_split')->comment('Metode pembayaran')->change();
            $table->dropColumn('edc');
            $table->double('transfer')->default(0)->after('cash')->comment('Jumlah uang yang dibayarkan melalui transfer');
            $table->double('qris')->default(0)->after('transfer')->comment('Jumlah uang yang dibayarkan melalui qris');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'edc'])->default('cash')->comment('Metode pembayaran')->change();
            $table->dropColumn('transfer');
            $table->dropColumn('qris');
            $table->double('edc')->default(0)->after('cash')->comment('Jumlah uang yang dibayarkan melalui EDC');
        });
    }
};
