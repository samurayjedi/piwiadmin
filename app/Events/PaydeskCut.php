<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\PaydeskPartialCut;

class PaydeskCut {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PaydeskPartialCut $cut;

    /**
     * Create a new event instance.
     */
    public function __construct(int $cut_id) {
        $this->cut = PaydeskPartialCut::with([
            'session',
            'session.paydesk',
            'session.openings',
            'session.openings.payment_method',
            'user',
            'amounts',
            'amounts.payment_method'
        ])->findOrFail($cut_id);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
