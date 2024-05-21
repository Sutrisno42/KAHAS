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
        if (Schema::hasColumn('transactions', 'edc'))
        {
            Schema::table('transactions', function (Blueprint $table)
            {
                $table->dropColumn('edc');
            });
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->double('payment_discount')->default(0)->comment('Potongan pembayaran')->after('change');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('transactions', 'payment_discount'))
        {
            Schema::table('transactions', function (Blueprint $table)
            {
                $table->dropColumn('payment_discount');
            });
        }
    }
};
