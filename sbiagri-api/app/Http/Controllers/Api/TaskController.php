<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    // GET /api/tasks
    public function index(Request $request)
    {
        $query = Task::where('user_id', $request->user()->id)
            ->with('culture');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('culture_id')) {
            $query->where('culture_id', $request->culture_id);
        }

        $tasks = $query->orderBy('due_date', 'asc')->paginate(10);

        return response()->json($tasks);
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'due_date' => 'required|date',
            'culture_id' => 'nullable|exists:cultures,id',
            'status' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'due_date' => $request->due_date,
            'culture_id' => $request->culture_id,
            'status' => $request->status ?? 'À faire',
        ]);

        return response()->json([
            'task' => $task->load('culture'),
            'message' => 'Tâche créée avec succès'
        ], 201);
    }

    // GET /api/tasks/{id}
    public function show(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->with('culture')
            ->findOrFail($id);

        return response()->json($task);
    }

    // PUT /api/tasks/{id}
    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'due_date' => 'sometimes|required|date',
            'culture_id' => 'nullable|exists:cultures,id',
            'status' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->update($request->all());

        return response()->json([
            'task' => $task->load('culture'),
            'message' => 'Tâche modifiée avec succès'
        ]);
    }

    // DELETE /api/tasks/{id}
    public function destroy(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'Tâche supprimée avec succès'
        ]);
    }
}