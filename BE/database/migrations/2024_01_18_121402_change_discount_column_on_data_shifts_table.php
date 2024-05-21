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
        Schema::table('data_shifts', function (Blueprint $table) {
            $table->dropColumn('discount_cash');
            $table->dropColumn('discount_transfer');
            $table->dropColumn('discount_qris');

            $table->double('total_change')->nullable()->comment('Total kembalian')->after('total_qris');
            $table->double('discount_transaction')->nullable()->comment('Total diskon transaksi')->after('total_transaction');
            $table->double('discount_payment')->nullable()->comment('Total diskon pembayaran')->after('discount_transaction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_shifts', function (Blueprint $table) {
            $table->double('discount_cash')->nullable()->comment('Diskon cash')->after('total_transaction');
            $table->double('discount_transfer')->nullable()->comment('Diskon transfer')->after('discount_cash');
            $table->double('discount_qris')->nullable()->comment('Diskon qris')->after('discount_transfer');

            $table->dropColumn('total_change');
            $table->dropColumn('discount_transaction');
            $table->dropColumn('discount_payment');
        });
    }
};
