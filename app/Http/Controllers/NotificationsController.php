<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class NotificationsController extends Controller {
    public function markAsRead($notificationId) {
        $notification = auth()->user()->notifications()->find($notificationId);
        $notification->markAsRead();
        $redirect = request()->get('redirect', null);
        $redirect_attrs = request()->get('redirect_attrs', []);

        if ($redirect && Route::has($redirect)) {
            return redirect()->route($redirect, $redirect_attrs);
        }

        return back();
    }

    public function markAllAsRead() {
        auth()->user()->unreadNotifications->markAsRead();

        return back();
    }
}
