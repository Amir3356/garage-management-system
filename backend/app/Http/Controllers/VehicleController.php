<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->isAdmin()) {
            return response()->json(Vehicle::with('user')->get());
        }

        return response()->json(
            Vehicle::where('user_id', $request->user()->id)->get()
        );
    }

    public function show(Request $request, Vehicle $vehicle)
    {
        if (!$request->user()->isAdmin() && $vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($vehicle->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'car_name' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'plate_number' => 'required|string|max:255|unique:vehicles',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        $vehicle = Vehicle::create([
            'user_id' => $request->user()->id,
            'car_name' => $request->car_name,
            'model' => $request->model,
            'plate_number' => $request->plate_number,
            'year' => $request->year,
        ]);

        return response()->json($vehicle, 201);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        if (!$request->user()->isAdmin() && $vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'car_name' => 'sometimes|string|max:255',
            'model' => 'sometimes|string|max:255',
            'plate_number' => 'sometimes|string|max:255|unique:vehicles,plate_number,' . $vehicle->id,
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        $vehicle->update($request->only(['car_name', 'model', 'plate_number', 'year']));

        return response()->json($vehicle);
    }

    public function destroy(Request $request, Vehicle $vehicle)
    {
        if (!$request->user()->isAdmin() && $vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }
}
