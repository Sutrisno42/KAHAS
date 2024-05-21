<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('units')->truncate();

        $units = [
            [
                'unit_name' => 'Pcs',
                'unit_value' => 1,
            ],
            [
                'unit_name' => 'Lusin',
                'unit_value' => 12,
            ],
            [
                'unit_name' => 'Kodi',
                'unit_value' => 20,
            ],
            [
                'unit_name' => 'Gross',
                'unit_value' => 144,
            ],
            [
                'unit_name' => 'Box',
                'unit_value' => 100,
            ],
            [
                'unit_name' => 'Dus',
                'unit_value' => 24,
            ],
        ];

        foreach ($units as $value) {
            \App\Models\Unit::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
