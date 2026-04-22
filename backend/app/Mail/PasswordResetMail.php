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
        $html = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; }
        .otp-code { background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .otp-code h2 { font-size: 32px; letter-spacing: 5px; color: #2c3e50; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello ' . htmlspecialchars($this->username) . ',</p>
        <p>You requested to reset your password. Use this OTP:</p>
        <div class="otp-code">
            <h2>' . $this->otp . '</h2>
        </div>
        <p>This OTP expires in 15 minutes.</p>
    </div>
</body>
</html>';

        return $this->subject('Password Reset - Garage Management System')
            ->html($html);
    }
}
