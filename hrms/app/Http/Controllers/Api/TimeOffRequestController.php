<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeOffRequest;
use App\Models\TimeOffCategory;
use Illuminate\Http\Request;

class TimeOffRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = TimeOffRequest::with(['staffMember', 'category', 'approvedByUser', 'author']);

        if ($request->filled('staff_member_id')) {
            $query->where('staff_member_id', $request->staff_member_id);
        }
        if ($request->filled('category_id')) {
            $query->where('time_off_category_id', $request->category_id);
        }
        if ($request->filled('status')) {
            $query->where('approval_status', $request->status);
        }
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->forPeriod($request->start_date, $request->end_date);
        }

        $requests = $request->boolean('paginate', true)
            ? $query->latest()->paginate($request->input('per_page', 15))
            : $query->latest()->get();

        return response()->json(['success' => true, 'data' => $requests]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_member_id' => 'required|exists:staff_members,id',
            'time_off_category_id' => 'required|exists:time_off_categories,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['approval_status'] = 'pending';
        $timeOffRequest = TimeOffRequest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Time off request submitted',
            'data' => $timeOffRequest->load(['staffMember', 'category']),
        ], 201);
    }

    public function show(TimeOffRequest $timeOffRequest)
    {
        return response()->json([
            'success' => true,
            'data' => $timeOffRequest->load(['staffMember', 'category', 'approvedByUser', 'author']),
        ]);
    }

    public function update(Request $request, TimeOffRequest $timeOffRequest)
    {
        if ($timeOffRequest->approval_status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot modify a processed request',
            ], 422);
        }

        $validated = $request->validate([
            'time_off_category_id' => 'sometimes|required|exists:time_off_categories,id',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date',
            'reason' => 'nullable|string',
        ]);

        $timeOffRequest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Time off request updated',
            'data' => $timeOffRequest->fresh(['staffMember', 'category']),
        ]);
    }

    /**
     * Approve or decline the time off request.
     */
    public function processApproval(Request $request, TimeOffRequest $timeOffRequest)
    {
        $validated = $request->validate([
            'action' => 'required|in:approved,declined',
            'approval_remarks' => 'nullable|string',
        ]);

        $timeOffRequest->update([
            'approval_status' => $validated['action'],
            'approved_by' => $request->user()->id,
            'approval_remarks' => $validated['approval_remarks'] ?? null,
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Time off request ' . $validated['action'],
            'data' => $timeOffRequest->fresh(['staffMember', 'category', 'approvedByUser']),
        ]);
    }

    /**
     * Get leave balance for a staff member.
     */
    public function getBalance(Request $request)
    {
        $request->validate([
            'staff_member_id' => 'required|exists:staff_members,id',
            'year' => 'nullable|integer',
        ]);

        $year = $request->year ?? now()->year;
        $staffMemberId = $request->staff_member_id;

        $categories = TimeOffCategory::active()->get();
        $balance = [];

        foreach ($categories as $category) {
            $used = TimeOffRequest::where('staff_member_id', $staffMemberId)
                ->where('time_off_category_id', $category->id)
                ->where('approval_status', 'approved')
                ->whereYear('start_date', $year)
                ->sum('total_days');

            $balance[] = [
                'category' => $category,
                'quota' => $category->annual_quota,
                'used' => (float) $used,
                'remaining' => max(0, $category->annual_quota - $used),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'year' => $year,
                'balance' => $balance,
            ],
        ]);
    }

    public function destroy(TimeOffRequest $timeOffRequest)
    {
        if ($timeOffRequest->approval_status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a processed request',
            ], 422);
        }

        $timeOffRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Time off request deleted',
        ]);
    }
}
