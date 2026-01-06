<?php

return [
    'payment_reminder' => [
        'subject' => 'Payment Reminder for Sale #:id',
        'greeting' => 'Hello :name,',
        'reminder_sale' => 'This is a reminder to complete the payment for Sale #:id',
        'reminder_account' => 'This is a reminder to complete the payment of ":description"',
        'amount' => 'Amount Due: $:amount',
        'action' => 'Pay Now',
        'salutation' => 'Regards: :app_name',
        'due_date' => 'Please complete your payment by :date',
        'thanks' => 'Thank you for your business!',
        'pay' => 'Pay',
        'notification_sale_primary' => 'Reminder for sale #:id',
    ],
    'low_stock' => [
        'primary' => 'The product ":product_name" have low stock',
        'secondary' => 'Only :stock its available',
        'action' => 'Restock',
    ],
];