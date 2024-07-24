<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $nif;
    public $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($nif, $email)
    {
        $this->nif = $nif;
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $url_app = config('app.frontend_url');
        return $this->from('hospmetrics@gmail.com')
            ->subject('Bem-vindo à HospMetrics')
            ->view('emails.welcome_mail')
            ->with([
                'nif' => $this->nif,
                'email' => $this->email,
                'url' => $url_app
            ]);
           
    }
}
