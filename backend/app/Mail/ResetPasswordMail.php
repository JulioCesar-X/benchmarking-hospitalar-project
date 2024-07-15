<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $frontendUrl = config('app.frontend_url');
        $resetUrl = $frontendUrl . '/reset-password?token=' . $this->token;

        return $this->from('hospmetrics@gmail.com')
        ->subject('Redefinição de Senha')
        ->view('emails.reset_password')
        ->with([
            'url' => $resetUrl
        ]);
    }
}