<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AttachmentMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(protected string $name, protected string $path) {

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
      return $this
        ->markdown('mail.attachment_mail')
        ->with(['name' => $this->name])
        ->subject($this->name)
        ->attach($this->path);
    }
}
