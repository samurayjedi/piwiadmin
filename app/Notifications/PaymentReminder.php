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
        $amountToPaid = $this->sale->total_amount - $this->sale->amount_paid;

        return (new MailMessage)
            ->subject(__('piwi.payment_reminder.subject', ['id' => $this->sale->id]))
            ->greeting(__('piwi.payment_reminder.greeting', ['name' => $notifiable->name]))
            ->line(__('piwi.payment_reminder.reminder', ['id' => $this->sale->id]))
            ->line(__('piwi.payment_reminder.amount', ['amount' => number_format($amountToPaid, 2)]))
            ->action(__('piwi.payment_reminder.action'), route('sales', ['id' => $this->sale->id]))
            ->salutation(__('piwi.payment_reminder.salutation', [
                'app_name' => config('app.name'),
            ]))
            ->line(__('piwi.payment_reminder.due_date', ['date' => $this->sale->due_date]))
            ->line(__('piwi.payment_reminder.thanks'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array {

        return [
            'sale_id' => $this->sale->id,
            'message' => __('piwi.payment_reminder.reminder', ['id' => $this->sale->id]),
            'route' => 'sales',
            'action' => __('piwi.payment_reminder.pay'),
        ];
    }
}
