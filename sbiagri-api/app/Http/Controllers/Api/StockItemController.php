<?php

namespace App\Http\Controllers\Api;

use App\Models\StockItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class StockItemController extends Controller
{
    // GET /api/stocks
    public function index(Request $request)
    {
        $query = StockItem::where('user_id', $request->user()->id);

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Filtre : uniquement les stocks en alerte
        if ($request->filled('low_stock') && $request->low_stock == 'true') {
            $query->whereColumn('quantity', '<=', 'alert_threshold');
        }

        $stocks = $query->orderBy('name', 'asc')->paginate(10);

        return response()->json($stocks);
    }

    // POST /api/stocks
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'alert_threshold' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stock = StockItem::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'quantity' => $request->quantity,
            'unit' => $request->unit,
            'alert_threshold' => $request->alert_threshold,
        ]);

        return response()->json([
            'stock' => $stock,
            'message' => 'Article ajouté au stock'
        ], 201);
    }

    // GET /api/stocks/{id}
    public function show(Request $request, $id)
    {
        $stock = StockItem::where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json($stock);
    }

    // PUT /api/stocks/{id}
    public function update(Request $request, $id)
    {
        $stock = StockItem::where('user_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|numeric|min:0',
            'unit' => 'sometimes|required|string|max:50',
            'alert_threshold' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stock->update($request->all());

        return response()->json([
            'stock' => $stock,
            'message' => 'Stock modifié avec succès'
        ]);
    }

    // DELETE /api/stocks/{id}
    public function destroy(Request $request, $id)
    {
        $stock = StockItem::where('user_id', $request->user()->id)->findOrFail($id);
        $stock->delete();

        return response()->json([
            'message' => 'Article supprimé du stock'
        ]);
    }
}