<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $notificationLink;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($notificationLink)
    {
        $this->notificationLink = $notificationLink;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('hospmetrics@gmail.com')
            ->subject('Nova Notificação Recebida')
            ->view('emails.notification')
            ->with([
                'url' => $this->notificationLink,
            ]);
    }
}