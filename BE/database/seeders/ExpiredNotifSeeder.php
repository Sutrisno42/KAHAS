<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExpiredNotifSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('expired_notifs')->truncate();

        $expiredNotif = [
            [
                'product_id' => 1,
                'stock_opname_id' => 1,
                'title' => 'Ada produk yang sudah akan kadaluarsa',
                'description' => "Product Beras dengan nomor faktur F0001 akan kadaluarsa pada tanggal 01-01-2021",
            ],
            [
                'product_id' => 2,
                'stock_opname_id' => 2,
                'title' => 'Ada produk yang sudah akan kadaluarsa',
                'description' => "Product Gula dengan nomor faktur F0002 akan kadaluarsa pada tanggal 01-01-2021",
            ],
        ];

        foreach ($expiredNotif as $value) {
            \App\Models\ExpiredNotif::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
