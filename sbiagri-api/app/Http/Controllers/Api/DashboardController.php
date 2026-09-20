<?php

namespace App\Http\Controllers\Api;

use App\Models\Culture;
use App\Models\Task;
use App\Models\StockItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    // GET /api/dashboard/summary
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        // Compteurs
        $totalCultures = Culture::where('user_id', $userId)->count();
        $totalTasks = Task::where('user_id', $userId)->where('status', '!=', 'Terminée')->count();
        $lowStocks = StockItem::where('user_id', $userId)
            ->whereColumn('quantity', '<=', 'alert_threshold')
            ->count();

        // Prochaines tâches (5 max)
        $upcomingTasks = Task::where('user_id', $userId)
            ->where('status', '!=', 'Terminée')
            ->with('culture')
            ->orderBy('due_date', 'asc')
            ->limit(5)
            ->get();

        // Stocks en alerte
        $alertStocks = StockItem::where('user_id', $userId)
            ->whereColumn('quantity', '<=', 'alert_threshold')
            ->orderBy('quantity', 'asc')
            ->get();

        return response()->json([
            'counters' => [
                'total_cultures' => $totalCultures,
                'total_tasks' => $totalTasks,
                'low_stocks' => $lowStocks,
            ],
            'upcoming_tasks' => $upcomingTasks,
            'alert_stocks' => $alertStocks,
        ]);
    }
}