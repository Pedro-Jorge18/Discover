<?php

namespace App\Http\Controllers\Auth;

use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;

class GoogleAuthController extends Controller
{
        public function redirectToGoogle(){
        //redirect to google 
     return Socialite::driver('google')->redirect();
    }
     
    public function loginWithGoogle(Request $request){
        try{
 
         $googleUser = Socialite::driver('google')->user();
           
          // If the user exists, update their record; otherwise, create a new one
          $user = User::updateOrCreate([
        'google_id' => $googleUser->id,
        ], [
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'password' => bcrypt('1234test'),
        ]);
 
         Auth::login($user);
         return redirect()->route('home');
 
    } catch (Exception $e) {
            dd('Error Message ', $e->getMessage());
        }
    }
}
