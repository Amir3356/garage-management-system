<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return response()->json(
                Appointment::with(['user', 'vehicle', 'service', 'mechanic'])->get()
            );
        }

        if ($user->isMechanic()) {
            return response()->json(
                Appointment::with(['user', 'vehicle', 'service', 'mechanic'])
                    ->where('assigned_mechanic_id', $user->id)
                    ->get()
            );
        }

        return response()->json(
            Appointment::with(['vehicle', 'service', 'mechanic'])
                ->where('user_id', $user->id)
                ->get()
        );
    }

    public function show(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if (!$user->isAdmin() && 
            $appointment->user_id !== $user->id && 
            $appointment->assigned_mechanic_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($appointment->load(['user', 'vehicle', 'service', 'mechanic']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'user_id' => $request->user()->id,
            'vehicle_id' => $request->vehicle_id,
            'service_id' => $request->service_id,
            'status' => 'pending',
            'notes' => $request->notes,
            'scheduled_date' => $request->scheduled_date,
        ]);

        return response()->json($appointment->load(['vehicle', 'service']), 201);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if ($user->isClient() && $appointment->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->isMechanic() && $appointment->assigned_mechanic_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
            'scheduled_date' => 'nullable|date',
        ]);

        $data = $request->only(['status', 'notes', 'scheduled_date']);

        if ($request->status === 'completed') {
            $data['completed_at'] = now();
        }

        $appointment->update($data);

        return response()->json($appointment->load(['user', 'vehicle', 'service', 'mechanic']));
    }

    public function assignMechanic(Request $request, Appointment $appointment)
    {
        $request->validate([
            'mechanic_id' => 'required|exists:users,id',
        ]);

        $mechanic = \App\Models\User::find($request->mechanic_id);

        if (!$mechanic->isMechanic()) {
            return response()->json(['message' => 'Selected user is not a mechanic'], 422);
        }

        $appointment->update([
            'assigned_mechanic_id' => $request->mechanic_id,
            'status' => 'in_progress',
        ]);

        return response()->json($appointment->load(['user', 'vehicle', 'service', 'mechanic']));
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        if (!$request->user()->isAdmin() && $appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }

    public function stats()
    {
        return response()->json([
            'total' => Appointment::count(),
            'pending' => Appointment::pending()->count(),
            'in_progress' => Appointment::inProgress()->count(),
            'completed' => Appointment::completed()->count(),
            'revenue' => Appointment::completed()
                ->join('services', 'appointments.service_id', '=', 'services.id')
                ->sum('services.price'),
        ]);
    }
}
