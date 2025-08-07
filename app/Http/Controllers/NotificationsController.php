<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationsController extends Controller {
    public function markAsRead($notificationId) {
        $notification = auth()->user()->notifications()->find($notificationId);
        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead() {
        auth()->user()->unreadNotifications->markAsRead();

        return back();
    }
}
