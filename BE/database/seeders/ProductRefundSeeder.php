<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductRefundSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('product_refunds')->truncate();

        $productRefund = [
            [
                'stock_opname_id' => 1,
                'product_id' => 1,
                'total_refund' => 10,
                'nominal' => 15000,
                'faktur_number' => 'R0001',
                'refund_date' => '2021-01-01',
                'responsible' => 'Manager Pusat',
            ],
            [
                'stock_opname_id' => 2,
                'product_id' => 2,
                'total_refund' => 10,
                'nominal' => 15000,
                'faktur_number' => 'R0002',
                'refund_date' => '2021-01-01',
                'responsible' => 'Manager Pusat',
            ],
        ];

        foreach ($productRefund as $value) {
            \App\Models\ProductRefund::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
