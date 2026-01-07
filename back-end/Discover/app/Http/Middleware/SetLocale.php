<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for locale in request header
        $locale = $request->header('Accept-Language');
        
        // If not in header, check query parameter
        if (!$locale) {
            $locale = $request->query('lang', config('app.locale'));
        }
        
        // Extract language code (e.g., 'en' from 'en-US' or 'en-GB')
        $locale = substr($locale, 0, 2);
        
        // Support only 'en' and 'pt'
        if (!in_array($locale, ['en', 'pt'])) {
            $locale = config('app.locale', 'pt');
        }
        
        App::setLocale($locale);
        
        return $next($request);
    }
}
