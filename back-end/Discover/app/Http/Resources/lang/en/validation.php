<?php

return [
    'attributes' => [
        'name' => 'first name',
        'last_name' => 'last name',
        'phone' => 'phone number',
        'birthday' => 'birth date',
        'email' => 'email address',
        'password' => 'password',
        'password_confirmation' => 'password confirmation',
        'image' => 'image',
        'gender' => 'gender',
        'language' => 'language',
        'about' => 'about me',
        'remember_me' => 'remember me',
    ],

    // Generic messages
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute must be a valid email address.',
    'unique' => 'This :attribute is already taken.',
    'min' => [
        'string' => 'The :attribute must be at least :min characters.',
    ],
    'confirmed' => 'The :attribute confirmation does not match.',
    'date' => 'The :attribute must be a valid date.',
    'before' => 'The :attribute must be a date before :date.',
    'after' => 'The :attribute must be a date after :date.',
    'image' => 'The :attribute must be an image.',
    'mimes' => 'The :attribute must be a file of type: :values.',
    'max' => [
        'string' => 'The :attribute may not be greater than :max characters.',
        'file' => 'The :attribute may not be greater than :max kilobytes.',
    ],
    'in' => 'The selected :attribute is invalid.',
    'boolean' => 'The :attribute field must be true or false.',



    //user
    'login' => [
        'invalid_credentials' => 'Invalid email or password.',
        'success' => 'Login successful.',
        'failed' => 'Login failed.',

    ],
    'register' => [
        'success' => 'Registration successful.',
        'failed' => 'Registration failed.',
    ],
    'validation' => [
        'email_exists' => 'This email is already registered.',
        'phone_exists' => 'This phone number is already in use.',
        'birthday_invalid' => 'Invalid birth date.',
    ],
    'logout' => [
        'success' => 'Logout successful.',
        'failed' => 'Logout failed.',
    ],
    'token' => [
        'success' => 'Token generated successfully',
        'failed' => 'Failed to generate token.',
    ],
    "auth" => [
        'success' => 'Authentication successful.',
        'failed' => 'Authentication failed.',
        'user_not_authenticated' => 'User not authenticated.',
    ],

];
