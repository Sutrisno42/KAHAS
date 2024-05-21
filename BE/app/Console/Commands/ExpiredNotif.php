<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ExpiredNotif extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notif:expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notification to user when product is expired';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $stockOpnames = \App\Models\StockOpname::where('expired_notif_date','<=' ,now()->format('Y-m-d'))->get();

            foreach ($stockOpnames as $stockOpname) {
                $product = $stockOpname->product;
                $check = \App\Models\ExpiredNotif::where('product_id', $product->id)->where('stock_opname_id', $stockOpname->id)->first();

                if (!empty($check)) {
                    continue;
                }

                \App\Models\ExpiredNotif::create([
                    'product_id' => $product->id,
                    'stock_opname_id' => $stockOpname->id,
                    'title' => 'Ada produk yang sudah akan kadaluarsa',
                    'description' => "Product {$product->product_name} dengan nomor faktur {$stockOpname->faktur_number} akan kadaluarsa pada tanggal {$stockOpname->expired_date->format('d-m-Y')}",
                ]);
            }
        } catch (\Throwable $th) {
            \Log::error($th->getMessage());
        }
    }
}
