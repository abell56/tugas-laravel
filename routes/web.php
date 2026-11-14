<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (Single Page Application - React)
|--------------------------------------------------------------------------
| Seluruh URL selain /api/* akan diarahkan ke view 'app'
| yang me-mount aplikasi React.js.
*/
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
