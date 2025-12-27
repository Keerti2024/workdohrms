<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\DocumentLocationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class DocumentLocationController extends Controller
{
    protected $locationService;

    public function __construct(DocumentLocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    /**
     * List all Locations
     */
    public function index()
    {
        try {
            $locations = $this->locationService->getAllLocations();
            return response()->json(['success' => true, 'data' => $locations]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Show Location
     */
    public function show($id)
    {
        try {
            $location = $this->locationService->getLocation($id);
            if (!$location) return response()->json(['success' => false, 'message' => 'Not Found'], 404);
            return response()->json(['success' => true, 'data' => $location]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update Location (Status only)
     */
    public function update(Request $request, $id)
    {
        // Only allow updating is_active on the main record
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $location = $this->locationService->updateLocation($id, $request->all());
            return response()->json(['success' => true, 'message' => 'Status Updated', 'data' => $location]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update Configuration (Credentials etc)
     */
    public function updateConfig(Request $request, $id)
    {
        // Validation depends on the type, but standard fields:
        $validator = Validator::make($request->all(), [
            'bucket' => 'sometimes|string',
            'region' => 'sometimes|string',
            'access_key' => 'sometimes|string',
            'secret_key' => 'sometimes|string',
            'endpoint' => 'sometimes|url', // Only for Wasabi
            'root_path' => 'sometimes|string', // Only for Local
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $config = $this->locationService->updateConfiguration($id, $request->all());
            return response()->json(['success' => true, 'message' => 'Configuration Updated', 'data' => $config]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
