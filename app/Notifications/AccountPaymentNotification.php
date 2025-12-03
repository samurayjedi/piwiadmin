<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\PayableAccount;

class AccountPaymentNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private PayableAccount $account)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $amountToPaid = $this->account->total_amount - $this->account->amount_paid;

        return (new MailMessage)
            ->subject($this->account->description)
            ->greeting(__('piwi.payment_reminder.greeting', ['name' => $notifiable->name]))
            ->line(__('piwi.payment_reminder.reminder_account', ['description' => $this->account->description]))
            ->line(__('piwi.payment_reminder.amount', ['amount' => number_format($amountToPaid, 2)]))
            ->action(__('piwi.payment_reminder.action'), route('inventory.stock.payable_accounts', ['id' => $this->account->id]))
            ->salutation(__('piwi.payment_reminder.salutation', [
                'app_name' => config('app.name'),
            ]))
            ->line(__('piwi.payment_reminder.due_date', ['date' => $this->account->due_date]))
            ->line(__('piwi.payment_reminder.thanks'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $amountToPaid = $this->account->total_amount - $this->account->amount_paid;

        return [
            'id' => $this->account->id,
            'primary' => $this->account->description,
            'secondary' => __('piwi.payment_reminder.amount', ['amount' => number_format($amountToPaid, 2)]),
            'route_name' => 'inventory.stock.payable_accounts',
            'route_attrs' => ['id' => $this->account->id],
            'action' => __('piwi.payment_reminder.pay')
        ];
    }
}
