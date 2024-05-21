<?php

namespace App\Http\Controllers;

use App\Models\HistoryRepack;

class HistoryRepackController extends Controller
{
    public function index()
    {
        $history = new HistoryRepack();

        if (request()->has('product_name') && request('product_name') != '') {
            $history = $history->whereHas('origin', function ($query) {
                $query->where('product_name', 'like', '%' . request('product_name') . '%');
            })->orWhereHas('destinations', function ($query) {
                $query->where('product_name', 'like', '%' . request('product_name') . '%');
            });
        }

        if (request()->has('product_id') && request('product_id') != '') {
            $history = $history->where('product_id', request('product_id'));
        }

        if (request()->has('start_date') && request('start_date') != '') {
            $history = $history->where('date', '>=', request('start_date'));
        }

        if (request()->has('end_date') && request('end_date') != '') {
            $history = $history->where('date', '<=', request('end_date'));
        }

        if (request()->has('type') && request('type') != '') {
            $history = $history->where('type', request('type'));
        }

        if(request()->has('arrange_by') && request('arrange_by') != '') {
            if(request('arrange_by') == 'product_name') {
                $history = $history->with(['origin', 'destinations'])->whereHas('origin', function ($query) {
                    $query->orderBy('product_name', request('sort') ?? 'asc');
                })->orWhereHas('destinations', function ($query) {
                    $query->orderBy('product_name', request('sort') ?? 'asc');
                })->paginate(request('limit') ?? 10);
            } else {
                $history = $history->orderBy(request('arrange_by'), request('sort') ?? 'asc')->with(['origin', 'destinations'])->paginate(request('limit') ?? 10);
            }
        } else {
            $history = $history->with(['origin', 'destinations'])->orderBy('id', 'desc')->paginate(request('limit') ?? 10);
        }

        $response = [];

        foreach ($history as $key => $value) {
            if($value->type == 'in') {
                $origin_destination = $value->origin->product_name ?? null;
                $origin_destination_id = isset($value->origin->id) ? [$value->origin->id] : [];
            } else {
                $destination = $value->destinations;

                if($destination->count() > 1) {
                    $origin_destination = $destination->map(function ($item) {
                        return $item->product_name;
                    })->implode(', ');
                } else {
                    $origin_destination = $value->destinations->first()->product_name ?? null;
                }

                $origin_destination_id = $value->destinations->pluck('id')->toArray() ?? [];
            }

            $response[$key] = [
                'id' => $value->id,
                'product_id' => $value->product_id,
                'product_name' => $value->product->product_name,
                'quantity_in' => $value->quantity_in,
                'quantity_out' => $value->quantity_out,
                'origin_destination_id' => $origin_destination_id,
                'origin_destination' => $origin_destination,
                'date' => $value->date,
            ];
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data history repack berhasil diambil',
            'data' => $response
        ], 200);
    }

    public function show($id)
    {
        $history = HistoryRepack::find($id);
        $history->load(['origin', 'destinations']);

        if (!$history) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data history repack tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data history repack berhasil diambil',
            'data' => $history
        ], 200);
    }
}
