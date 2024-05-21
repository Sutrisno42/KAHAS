<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();

        $user = [
            [
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'username' => 'admin',
                'phone' => '08121327323',
                'role' => 'admin',
                'password' => bcrypt('admin'),
            ],
            [
                'name' => 'Gudang',
                'email' => 'gudang@mail.com',
                'username' => 'gudang',
                'phone' => '08121327323',
                'role' => 'warehouse',
                'password' => bcrypt('gudang'),
            ],
            [
                'name' => 'Kasir',
                'email' => 'kasir@mail.com',
                'username' => 'kasir',
                'phone' => '08121327323',
                'role' => 'cashier',
                'password' => bcrypt('kasir'),
            ],
            [
                'name' => 'Cek Harga',
                'email' => 'cekharga@mail.com',
                'username' => 'cekharga',
                'phone' => '08121327323',
                'role' => 'price_check',
                'password' => bcrypt('cekharga'),
            ],
        ];

        foreach ($user as $value) {
            \App\Models\User::create($value);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
