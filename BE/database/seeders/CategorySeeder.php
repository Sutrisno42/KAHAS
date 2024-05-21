<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('categories')->truncate();

        $category = [
            [
                'category_name' => 'Makanan',
                'code' => 'CT0001',
            ],
            [
                'category_name' => 'Minuman',
                'code' => 'CT0002',
            ],
            [
                'category_name' => 'Peralatan Mandi',
                'code' => 'CT0003',
            ],
            [
                'category_name' => 'Peralatan Dapur',
                'code' => 'CT0004',
            ],
            [
                'category_name' => 'Peralatan Rumah Tangga',
                'code' => 'CT0005',
            ],
        ];

        foreach ($category as $value) {
            \App\Models\Category::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
