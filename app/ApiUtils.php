<?php
namespace App;
use Illuminate\Support\Facades\Validator;

class ApiUtils {
    public static function validate(array $rules, $values = null) {
        $fields = $values ?? request()->all();
        $validation = Validator::make($fields, $rules);
        if ($validation->fails()) {
            return response()->json([
                'status' => 0,
                'errors' => $validation->errors(),
            ]);
        }

        return null;
    }
}