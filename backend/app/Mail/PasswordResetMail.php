<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $otp;
    public string $username;

    public function __construct(string $otp, string $username)
    {
        $this->otp = $otp;
        $this->username = $username;
    }

    public function build(): self
    {
        return $this->subject('Password Reset - Garage Management System')
            ->view('emails.password-reset')
            ->with([
                'otp' => $this->otp,
                'username' => $this->username,
            ]);
    }
}
