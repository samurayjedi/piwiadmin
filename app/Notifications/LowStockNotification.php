<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Product;

class LowStockNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Product $product)
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
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array {
        return [
            'id' => $this->product->id,
            'primary' => __('piwi.low_stock.primary', ['product_name' => $this->product->name]),
            'secondary' => __('piwi.low_stock.secondary', [
                'stock' => number_format($this->product->stock, 2) . ' ' . $this->product->getMeasurementSuffix(),
            ]),
            'route_name' => 'inventory',
            'route_attrs' => ['ids' => [$this->product->id]],
            'action' => __('piwi.low_stock.action')
        ];
    }
}
