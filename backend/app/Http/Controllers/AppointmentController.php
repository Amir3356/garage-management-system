<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Mail\AppointmentScheduled;
use App\Mail\MechanicAssigned;
use App\Mail\AppointmentsBatchScheduled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 10);

        if ($user->isAdmin()) {
            return response()->json(
                Appointment::with(['user', 'vehicle', 'service', 'mechanic'])
                    ->paginate($perPage)
            );
        }

        if ($user->isMechanic()) {
            return response()->json(
                Appointment::with(['user', 'vehicle', 'service', 'mechanic'])
                    ->where('assigned_mechanic_id', $user->id)
                    ->paginate($perPage)
            );
        }

        return response()->json(
            Appointment::with(['vehicle', 'service', 'mechanic'])
                ->where('user_id', $user->id)
                ->paginate($perPage)
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
            'service_id' => 'nullable|exists:services,id',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
            'scheduled_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $serviceIds = $request->service_ids ?? ($request->service_id ? [$request->service_id] : []);

        if (empty($serviceIds)) {
            return response()->json(['message' => 'Please select at least one service'], 422);
        }

        $appointments = [];

        $user = $request->user();

        foreach ($serviceIds as $serviceId) {
            $appointment = Appointment::create([
                'user_id' => $user->id,
                'vehicle_id' => $request->vehicle_id,
                'service_id' => $serviceId,
                'status' => 'pending',
                'notes' => $request->notes,
                'scheduled_date' => $request->scheduled_date,
            ]);

            $appointment->load(['user', 'vehicle', 'service']);
            $appointments[] = $appointment;
        }

        // Send single email notification with all services
        if (!empty($appointments)) {
            try {
                $vehicle = $appointments[0]->vehicle;
                Mail::to('amirsiraj1995@gmail.com')->send(new AppointmentsBatchScheduled(
                    $user,
                    $vehicle,
                    $appointments,
                    $request->scheduled_date,
                    $request->notes
                ));
            } catch (\Exception $e) {
                \Log::error('Failed to send admin notification: ' . $e->getMessage());
            }
        }

        return response()->json($appointments, 201);
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

        $appointment->load(['user', 'vehicle', 'service', 'mechanic']);

        // Send email notification to mechanic
        if ($mechanic->email) {
            try {
                Mail::to($mechanic->email)->send(new MechanicAssigned($appointment));
            } catch (\Exception $e) {
                \Log::error('Failed to send mechanic notification: ' . $e->getMessage());
            }
        }

        return response()->json($appointment);
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
