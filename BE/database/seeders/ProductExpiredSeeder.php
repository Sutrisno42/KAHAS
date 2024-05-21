<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductExpiredSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('product_expireds')->truncate();

        $productExpired = [
            [
                'product_id' => 1,
                'stock_opname_id' => 1,
                'total_expired' => 10,
                'note' => 'Kadaluarsa',
                'responsible' => 'Manager Pusat',
                'expired_date' => '2021-01-01',
            ],
            [
                'product_id' => 2,
                'stock_opname_id' => 2,
                'total_expired' => 10,
                'note' => 'Kadaluarsa',
                'responsible' => 'Manager Pusat',
                'expired_date' => '2021-01-01',
            ],
        ];

        foreach ($productExpired as $value) {
            \App\Models\ProductExpired::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
