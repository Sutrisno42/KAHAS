<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('store')->truncate();

        $store = [
            [
                'store_name' => 'Hardjosoewarno Mondorakan',
            ],
            [
                'store_name' => 'Hardjosoewarno Parangtritis',
            ],
        ];

        foreach ($store as $value) {
            \App\Models\Store::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
