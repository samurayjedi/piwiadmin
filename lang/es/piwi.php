<?php

return [
    'payment_reminder' => [
        'subject' => 'Recordatorio de pago para la Venta #:id',
        'greeting' => 'Hola :name,', 
        'reminder_sale' => 'Este es un recordatorio para completar el pago de la Venta #:id',
        'reminder_account' => 'Este es un recordatorio para completar el pago de ":description"',
        'amount' => 'Monto adeudado: $:amount',
        'action' => 'Pagar ahora',
        'salutation' => 'Atentamente, el equipo de :app_name',
        'due_date' => 'Por favor complete su pago antes del :date',
        'thanks' => '¡Gracias por su preferencia!',
        'pay' => 'Pagar',
        'notification_sale_primary' => 'Recordatorio para venta #:id',
    ],
    'low_stock' => [
        'primary' => 'El producto ":product_name" tiene bajo stock',
        'secondary' => 'Solo :stock estan disponibles',
        'action' => 'Surtir',
    ],
];