<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\PaydeskSession;

class PaydeskClosed {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PaydeskSession $session;

    /**
     * Create a new event instance.
     */
    public function __construct(int $session_id) {
        $this->session = PaydeskSession::with([
            'paydesk',
            'user',
            'openings',
            'openings.payment_method',
            'closures',
            'closures.payment_method',
        ])->findOrFail($session_id);
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
