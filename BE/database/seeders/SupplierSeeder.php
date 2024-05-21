<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('suppliers')->truncate();

        $suppliers = [
            [
                'name' => 'PT. Sinar Jaya',
                'phone' => '08121327323',
            ],
            [
                'name' => 'PT. Maju Mundur',
                'phone' => '08121210010',
            ],
        ];

        foreach ($suppliers as $value) {
            \App\Models\Supplier::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
