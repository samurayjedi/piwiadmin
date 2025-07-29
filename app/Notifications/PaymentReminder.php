<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use  App\Models\Sales\Sale;

class PaymentReminder extends Notification
{
    use Queueable;

    public $sale;

    /**
     * Create a new notification instance.
     */
    public function __construct(Sale $sale) {
        $this->sale = $sale;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array {
        $amountToPaid = $this->sale->total_amount - $this->sale->amount_paid;

        return [
            'sale_id' => $this->sale->id,
            'toPay' => $amountToPaid,
            'message' => 'The following sale is pending for payment',
            'action_url' => url('/sales/sale/'.$this->sale->id),
        ];
    }
}
