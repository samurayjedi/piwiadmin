<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Models\Sale;

class ESCPosController extends Controller {
    public function certificate() {
        $path = storage_path('app/qz-tray/digital-certificate.txt');
        if (!file_exists($path)) {
            \Log::error('Certificate file not exists!!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }
        $certificate = file_get_contents($path);

        return response()->json([
            'certificate' => $certificate,
        ]);
    }
    

    public function sign() {
        request()->validate(['toSign' => 'required|string']);
        $toSign = request('toSign');
        $keyPath = storage_path('app/qz-tray/private-key.pem');
        if (!file_exists($keyPath)) {
            \Log::error('Private key file not exists!!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }
        $key = openssl_pkey_get_private("file://{$keyPath}");
        if (!$key) {
            \Log::error('Cannot open the private key file!!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }
        $signature = null;
        $signed = openssl_sign($toSign, $signature, $key, OPENSSL_ALGO_SHA512);
        if (!$signed) {
            \Log::error('Signing failed!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }

        // Return base64 encoded signature
        return response(base64_encode($signature))
            ->header('Content-Type', 'text/plain');
    }

    public function print_esc_pos(string $file) {
        $f = base64_decode($file);
        $path = storage_path('app/public/tmp/' . $f);
        if (!file_exists($path)) {
            throw ValidationException::withMessages([
                'kernel_panic' => __('The file not exists!!.'),
            ]);
        }

        return Inertia::render('ESCPos', [
            'file' => $f,
        ]);
    }
}
