<?php

namespace App\Http\Controllers\Api;

use App\Models\Culture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class CultureController extends Controller
{
    // GET /api/cultures
    public function index(Request $request)
    {
        $query = Culture::where('user_id', $request->user()->id);

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // Filtre par statut
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $cultures = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($cultures);
    }

    // POST /api/cultures
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'surface' => 'required|numeric|min:0',
            'planting_date' => 'required|date',
            'status' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $culture = Culture::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'type' => $request->type,
            'surface' => $request->surface,
            'planting_date' => $request->planting_date,
            'status' => $request->status ?? 'Semis',
        ]);

        return response()->json([
            'culture' => $culture,
            'message' => 'Culture créée avec succès'
        ], 201);
    }

    // GET /api/cultures/{id}
    public function show(Request $request, $id)
    {
        $culture = Culture::where('user_id', $request->user()->id)
            ->with('tasks')
            ->findOrFail($id);

        return response()->json($culture);
    }

    // PUT /api/cultures/{id}
    public function update(Request $request, $id)
    {
        $culture = Culture::where('user_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:100',
            'surface' => 'sometimes|required|numeric|min:0',
            'planting_date' => 'sometimes|required|date',
            'status' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $culture->update($request->all());

        return response()->json([
            'culture' => $culture,
            'message' => 'Culture modifiée avec succès'
        ]);
    }

    // DELETE /api/cultures/{id}
    public function destroy(Request $request, $id)
    {
        $culture = Culture::where('user_id', $request->user()->id)->findOrFail($id);
        $culture->delete();

        return response()->json([
            'message' => 'Culture supprimée avec succès'
        ]);
    }
}