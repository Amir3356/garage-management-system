<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotUsernameMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $username;

    public function __construct(string $username)
    {
        $this->username = $username;
    }

    public function build(): self
    {
        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Username</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; }
        .username-box { background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .username-box h2 { font-size: 24px; color: #2c3e50; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Username</h1>
        <p>Hello,</p>
        <p>You requested a reminder of your username for the Garage Management System.</p>
        <div class="username-box">
            <h2>' . htmlspecialchars($this->username) . '</h2>
        </div>
        <p>If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>';

        return $this->subject('Your Username - Garage Management System')
            ->html($html);
    }
}
