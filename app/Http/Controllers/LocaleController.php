<?php

namespace App\Http\Controllers;

class LocaleController extends Controller {
  public function handle(string $language) {
    $locale = config('locale');

    return require_once lang_path("/$locale/i18next.php");
  }
  
  public function changeLanguage(string $language) {
    switch ($language) {
      case 'en-US':
        session()->put('locale', 'en');
        session()->put('faker_locale', 'en_US');
        break;
      case 'es-ES':
        session()->put('locale', 'es');
        session()->put('faker_locale', 'es_ES');
        break;
    }
  
    return back();
  }
}
