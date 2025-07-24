<?php
namespace App\Validators;
use Illuminate\Validation\Validator as ValidatorInstance;
use Illuminate\Support\Facades\Validator;

class RequiredIfArrayIncludes {
  /**
   * Determine if the validation rule passes.
   *
   * @param  string  $attribute
   * @param  mixed  $value
   * @param  array  $parameters
   * @param  ValidatorInstance  $validator
   * @return bool
   */
  public static function passes($attribute, $value, $parameters, $validator) {
    $inputs = $validator->getData();
    $key = array_shift($parameters);
    if (!array_key_exists($key, $inputs)) {
      // if the array not exists, obviously the field will not be required....
      return true;
    }
    $haystack = $inputs[$key];
    $isRequired = true;
    foreach ($parameters as $param) {
      $isRequired = $isRequired && in_array($param, $haystack);
    }

    if ($isRequired) {
      // apply required rule to the current attribute
      $validatorAux = Validator::make([$attribute => $value], [
        $attribute => 'required',
      ]);
      if ($validatorAux->fails()) {
        return false;
      }
    }

    // true === no problem
    return true;
  }

  /**
   * Get the validation error message.
   *
   * @return string
   */
  public static function message($message, $attribute, $rule, $parameters) {
    $key = array_shift($parameters);
    $items = implode(',', $parameters);
    
    return str_replace([':array', ':items'], [$key, $items], $message);
  }
}
