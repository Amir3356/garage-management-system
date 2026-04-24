<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentsBatchScheduled extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $vehicle;
    public $appointments;
    public $totalPrice;
    public $scheduledDate;
    public $notes;

    public function __construct($user, $vehicle, $appointments, $scheduledDate, $notes)
    {
        $this->user = $user;
        $this->vehicle = $vehicle;
        $this->appointments = $appointments;
        $this->scheduledDate = $scheduledDate;
        $this->notes = $notes;
        $this->totalPrice = collect($appointments)->sum(function($apt) {
            return $apt->service->price ?? 0;
        });
    }

    public function build()
    {
        $serviceCount = count($this->appointments);
        $subject = $serviceCount > 1
            ? "New Appointment Scheduled - {$serviceCount} Services - Garage Management System"
            : "New Appointment Scheduled - Garage Management System";

        return $this->subject($subject)
            ->view('emails.appointments-batch-scheduled');
    }
}
