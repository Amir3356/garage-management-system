<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Job Assignment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #059669;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .detail-row {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #059669;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
        }
        .value {
            font-size: 16px;
            color: #111827;
            margin-top: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Job Assigned</h1>
    </div>
    <div class="content">
        <p>Hello {{ $appointment->mechanic->name }},</p>
        <p>You have been assigned a new job. Here are the details:</p>

        <div class="detail-row">
            <div class="label">Customer Name</div>
            <div class="value">{{ $appointment->user->name }}</div>
        </div>

        <div class="detail-row">
            <div class="label">Customer Phone</div>
            <div class="value">{{ $appointment->user->phone ?? 'N/A' }}</div>
        </div>

        <div class="detail-row">
            <div class="label">Service</div>
            <div class="value">{{ $appointment->service->name }}</div>
        </div>

        <div class="detail-row">
            <div class="label">Vehicle</div>
            <div class="value">{{ $appointment->vehicle->car_name }} ({{ $appointment->vehicle->plate_number }})</div>
        </div>

        <div class="detail-row">
            <div class="label">Scheduled Date</div>
            <div class="value">{{ $appointment->scheduled_date ? date('F j, Y g:i A', strtotime($appointment->scheduled_date)) : 'Not scheduled' }}</div>
        </div>

        @if($appointment->notes)
        <div class="detail-row">
            <div class="label">Customer Notes</div>
            <div class="value">{{ $appointment->notes }}</div>
        </div>
        @endif

        <div class="footer">
            <p>Garage Management System</p>
            <p>Please check your dashboard for more details.</p>
        </div>
    </div>
</body>
</html>
