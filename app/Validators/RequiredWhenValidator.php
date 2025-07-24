<?php
namespace App\Validators;
use Illuminate\Validation\Validator as ValidatorInstance;
use Illuminate\Support\Facades\Validator;

class RequiredWhenValidator {
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
    $isRequired = true; $logicGate = 'none';
    while (count($parameters)) {
      $inputName = array_shift($parameters);
      $cond = array_shift($parameters);
      $expectValue = array_shift($parameters);
      if (array_key_exists($inputName, $inputs)) {
        switch ($cond) {
          case '==':
            switch ($logicGate) {
              case 'none':
                $isRequired = $inputs[$inputName] === $expectValue;
                break;
              case '||':
                $isRequired = $isRequired || ($inputs[$inputName] === $expectValue);
                if ($isRequired) { // only one is necesary to be true
                  return $isRequired;
                }
                break;
              case '&&':
                $isRequired = $isRequired && ($inputs[$inputName] === $expectValue);
                break;
              default:
                throw new \RuntimeException("$logicGate no implemented!!!!!");
            }
            break;
          default:
            throw new \RuntimeException("$cond no implemented!!");
        }
      } else {
          $isRequired = false;
      }
      $logicGate = array_shift($parameters);
    }

    if ($isRequired) {
      // apply required rule to the current attribute
      $fuckItem = data_get($inputs, $attribute, null);
      return $fuckItem !== null && $fuckItem !== '';
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
    $others = ''; $logicGate = null;
    while (count($parameters)) {
      $inputName = str_replace(['_', '-'], ' ', array_shift($parameters));
      $cond = array_shift($parameters);
      $expectValue = str_replace(['_', '-'], ' ', array_shift($parameters));
      $others .= ($logicGate ? " $logicGate " : "")."$inputName $cond $expectValue";
      $logicGate = array_shift($parameters);
      switch ($logicGate) {
          case '&&':
              $logicGate = __('and');
              break;
          case '||':
              $logicGate = __('or');
              break;
      }
    }

    return str_replace(':others', $others, $message);
  }
}
