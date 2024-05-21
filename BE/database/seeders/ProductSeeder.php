<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('products')->truncate();
        DB::table('product_unit')->truncate();
        DB::table('stock_opnames')->truncate();

        $products = [
            [
                'category_id' => 1,
                'product_name' => 'Beras',
                'product_code' => 'PR0001',
                'stock' => 100,
                'price' => 15000,
            ],
            [
                'category_id' => 1,
                'product_name' => 'Gula',
                'product_code' => 'PR0002',
                'stock' => 100,
                'price' => 15000,
            ],
            [
                'category_id' => 1,
                'product_name' => 'Minyak Goreng',
                'product_code' => 'PR0003',
                'stock' => 100,
                'price' => 15000,
            ],
            [
                'category_id' => 3,
                'product_name' => 'Sabun',
                'product_code' => 'PR0008',
                'stock' => 100,
                'price' => 5000,
            ],
            [
                'category_id' => 3,
                'product_name' => 'Shampoo',
                'product_code' => 'PR0009',
                'stock' => 100,
                'price' => 18000,
            ],
        ];

        foreach ($products as $value) {
            \App\Models\Product::create($value);
        }

        $product_unit = [
            [
                'product_id' => 1,
                'unit_id' => 1,
                'price' => 15000,
                'minimum' => 1,
            ],
            [
                'product_id' => 1,
                'unit_id' => 1,
                'price' => 14000,
                'minimum' => 5,
            ],
            [
                'product_id' => 1,
                'unit_id' => 2,
                'price' => 12500,
                'minimum' => 1,
            ],
            [
                'product_id' => 2,
                'unit_id' => 1,
                'price' => 15000,
                'minimum' => 1,
            ],
            [
                'product_id' => 2,
                'unit_id' => 2,
                'price' => 14000,
                'minimum' => 1,
            ],
            [
                'product_id' => 3,
                'unit_id' => 1,
                'price' => 15000,
                'minimum' => 1,
            ],
            [
                'product_id' => 3,
                'unit_id' => 6,
                'price' => 13500,
                'minimum' => 1,
            ],
            [
                'product_id' => 3,
                'unit_id' => 5,
                'price' => 13000,
                'minimum' => 1,
            ],
            [
                'product_id' => 4,
                'unit_id' => 1,
                'price' => 5000,
                'minimum' => 1,
            ],
            [
                'product_id' => 4,
                'unit_id' => 2,
                'price' => 4500,
                'minimum' => 1,
            ],
            [
                'product_id' => 4,
                'unit_id' => 6,
                'price' => 4300,
                'minimum' => 1,
            ],
            [
                'product_id' => 5,
                'unit_id' => 1,
                'price' => 18000,
                'minimum' => 1,
            ],
            [
                'product_id' => 5,
                'unit_id' => 2,
                'price' => 17000,
                'minimum' => 1,
            ],
            [
                'product_id' => 5,
                'unit_id' => 6,
                'price' => 15000,
                'minimum' => 1,
            ],
            [
                'product_id' => 5,
                'unit_id' => 6,
                'price' => 14500,
                'minimum' => 5,
            ],
        ];

        foreach ($product_unit as $value) {
            \App\Models\ProductUnit::create($value);
        }

        $stock_opnames = [
            [
                'product_id' => 1,
                'supplier_id' => 1,
                'amount' => 100,
                'hpp_price' => 10000,
                'faktur_number' => 'F0001',
                'faktur_date' => '2023-01-01',
                'expired_date' => '2024-01-04',
                'expired_notif_date' => '2024-01-01',
                'note' => 'Penyesuaian stok opname',
                'responsible' => 'Manager Pusat',
            ],
            [
                'product_id' => 2,
                'supplier_id' => 1,
                'amount' => 100,
                'hpp_price' => 10000,
                'faktur_number' => 'F0002',
                'faktur_date' => '2023-01-01',
                'expired_date' => '2024-01-04',
                'expired_notif_date' => '2024-01-01',
                'note' => 'Penyesuaian stok opname',
                'responsible' => 'Manager Pusat',
            ],
            [
                'product_id' => 3,
                'supplier_id' => 1,
                'amount' => 100,
                'hpp_price' => 10000,
                'faktur_number' => 'F0003',
                'faktur_date' => '2023-01-01',
                'expired_date' => '2024-01-04',
                'expired_notif_date' => '2024-01-01',
                'note' => 'Penyesuaian stok opname',
                'responsible' => 'Manager Pusat',
            ],
            [
                'product_id' => 4,
                'supplier_id' => 1,
                'amount' => 100,
                'hpp_price' => 10000,
                'faktur_number' => 'F0004',
                'faktur_date' => '2023-01-01',
                'expired_date' => '2024-01-04',
                'expired_notif_date' => '2024-01-01',
                'note' => 'Penyesuaian stok opname',
                'responsible' => 'Manager Pusat',
            ],
            [
                'product_id' => 5,
                'supplier_id' => 1,
                'amount' => 100,
                'hpp_price' => 10000,
                'faktur_number' => 'F0005',
                'faktur_date' => '2023-01-01',
                'expired_date' => '2024-01-04',
                'expired_notif_date' => '2024-01-01',
                'note' => 'Penyesuaian stok opname',
                'responsible' => 'Manager Pusat',
            ],
        ];

        foreach ($stock_opnames as $value) {
            \App\Models\StockOpname::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
