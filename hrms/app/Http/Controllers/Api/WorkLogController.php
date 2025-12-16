<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkLog;
use App\Models\StaffMember;
use Illuminate\Http\Request;
use Carbon\Carbon;

class WorkLogController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkLog::with(['staffMember', 'author']);

        if ($request->filled('staff_member_id')) {
            $query->where('staff_member_id', $request->staff_member_id);
        }
        if ($request->filled('date')) {
            $query->forDate($request->date);
        }
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->forPeriod($request->start_date, $request->end_date);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $logs = $request->boolean('paginate', true)
            ? $query->latest('log_date')->paginate($request->input('per_page', 15))
            : $query->latest('log_date')->get();

        return response()->json(['success' => true, 'data' => $logs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_member_id' => 'required|exists:staff_members,id',
            'log_date' => 'required|date',
            'status' => 'required|in:present,absent,half_day,on_leave,holiday',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'late_minutes' => 'nullable|integer|min:0',
            'early_leave_minutes' => 'nullable|integer|min:0',
            'overtime_minutes' => 'nullable|integer|min:0',
            'break_minutes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['author_id'] = $request->user()->id;
        $log = WorkLog::updateOrCreate(
            [
                'staff_member_id' => $validated['staff_member_id'],
                'log_date' => $validated['log_date'],
            ],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Work log saved',
            'data' => $log->load('staffMember'),
        ], 201);
    }

    /**
     * Clock in for current user.
     */
    public function clockIn(Request $request)
    {
        $staffMember = StaffMember::where('user_id', $request->user()->id)->first();
        
        if (!$staffMember) {
            return response()->json([
                'success' => false,
                'message' => 'Staff member not found',
            ], 404);
        }

        $today = now()->toDateString();
        $log = WorkLog::updateOrCreate(
            [
                'staff_member_id' => $staffMember->id,
                'log_date' => $today,
            ],
            [
                'clock_in' => now()->format('H:i'),
                'clock_in_ip' => $request->ip(),
                'status' => 'present',
                'author_id' => $request->user()->id,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Clocked in successfully',
            'data' => $log,
        ]);
    }

    /**
     * Clock out for current user.
     */
    public function clockOut(Request $request)
    {
        $staffMember = StaffMember::where('user_id', $request->user()->id)->first();
        
        if (!$staffMember) {
            return response()->json([
                'success' => false,
                'message' => 'Staff member not found',
            ], 404);
        }

        $today = now()->toDateString();
        $log = WorkLog::where('staff_member_id', $staffMember->id)
            ->where('log_date', $today)
            ->first();

        if (!$log) {
            return response()->json([
                'success' => false,
                'message' => 'No clock in record found for today',
            ], 422);
        }

        $log->update([
            'clock_out' => now()->format('H:i'),
            'clock_out_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Clocked out successfully',
            'data' => $log,
        ]);
    }

    /**
     * Bulk create/update work logs.
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'logs' => 'required|array',
            'logs.*.staff_member_id' => 'required|exists:staff_members,id',
            'logs.*.log_date' => 'required|date',
            'logs.*.status' => 'required|in:present,absent,half_day,on_leave,holiday',
            'logs.*.clock_in' => 'nullable|date_format:H:i',
            'logs.*.clock_out' => 'nullable|date_format:H:i',
        ]);

        $created = [];
        foreach ($validated['logs'] as $logData) {
            $logData['author_id'] = $request->user()->id;
            $created[] = WorkLog::updateOrCreate(
                [
                    'staff_member_id' => $logData['staff_member_id'],
                    'log_date' => $logData['log_date'],
                ],
                $logData
            );
        }

        return response()->json([
            'success' => true,
            'message' => count($created) . ' work logs processed',
            'data' => $created,
        ], 201);
    }

    /**
     * Get attendance summary for a period.
     */
    public function summary(Request $request)
    {
        $request->validate([
            'staff_member_id' => 'required|exists:staff_members,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $logs = WorkLog::where('staff_member_id', $request->staff_member_id)
            ->forPeriod($request->start_date, $request->end_date)
            ->get();

        $summary = [
            'total_days' => Carbon::parse($request->start_date)->diffInDays(Carbon::parse($request->end_date)) + 1,
            'present' => $logs->where('status', 'present')->count(),
            'absent' => $logs->where('status', 'absent')->count(),
            'half_day' => $logs->where('status', 'half_day')->count(),
            'on_leave' => $logs->where('status', 'on_leave')->count(),
            'holiday' => $logs->where('status', 'holiday')->count(),
            'total_late_minutes' => $logs->sum('late_minutes'),
            'total_overtime_minutes' => $logs->sum('overtime_minutes'),
            'total_early_leave_minutes' => $logs->sum('early_leave_minutes'),
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    public function show(WorkLog $workLog)
    {
        return response()->json([
            'success' => true,
            'data' => $workLog->load(['staffMember', 'author']),
        ]);
    }

    public function update(Request $request, WorkLog $workLog)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:present,absent,half_day,on_leave,holiday',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'late_minutes' => 'nullable|integer|min:0',
            'early_leave_minutes' => 'nullable|integer|min:0',
            'overtime_minutes' => 'nullable|integer|min:0',
            'break_minutes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $workLog->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Work log updated',
            'data' => $workLog->fresh('staffMember'),
        ]);
    }

    public function destroy(WorkLog $workLog)
    {
        $workLog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Work log deleted',
        ]);
    }
}
