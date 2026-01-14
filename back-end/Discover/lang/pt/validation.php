<?php

return [
    'attributes' => [
        'name' => 'nome',
        'last_name' => 'sobrenome',
        'phone' => 'número de telefone',
        'birthday' => 'data de nascimento',
        'email' => 'endereço de email',
        'password' => 'senha',
        'password_confirmation' => 'confirmação de senha',
        'image' => 'imagem',
        'gender' => 'género',
        'language' => 'idioma',
        'about' => 'sobre mim',
        'remember_me' => 'lembrar-me',
    ],

    // Generic messages
    'required' => 'O campo :attribute é obrigatório.',
    'email' => 'O :attribute deve ser um endereço de email válido.',
    'unique' => 'Este :attribute já está em uso.',
    'min' => [
        'string' => 'O :attribute deve ter pelo menos :min caracteres.',
    ],
    'confirmed' => 'A confirmação de :attribute não corresponde.',
    'date' => 'O :attribute deve ser uma data válida.',
    'before' => 'O :attribute deve ser uma data anterior a :date.',
    'after' => 'O :attribute deve ser uma data posterior a :date.',
    'image' => 'O :attribute deve ser uma imagem.',
    'mimes' => 'O :attribute deve ser um ficheiro do tipo: :values.',
    'max' => [
        'string' => 'O :attribute não pode ter mais de :max caracteres.',
        'file' => 'O :attribute não pode ter mais de :max kilobytes.',
    ],
    'in' => 'O :attribute selecionado é inválido.',
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',

    //user
    'login' => [
        'invalid_credentials' => 'Email ou senha inválidos.',
        'success' => 'Login efetuado com sucesso.',
        'failed' => 'Falha no login.',
    ],
    'register' => [
        'success' => 'Registo efetuado com sucesso.',
        'failed' => 'Falha no registo.',
    ],
    'validation' => [
        'email_exists' => 'Este email já está registado.',
        'phone_exists' => 'Este número de telefone já está em uso.',
        'birthday_invalid' => 'Data de nascimento inválida.',
    ],
    'logout' => [
        'success' => 'Sessão terminada com sucesso.',
        'failed' => 'Falha ao terminar sessão.',
    ],

    'token' => [
        'invalid' => 'Token inválido.',
        'expired' => 'Token expirado.',
        'revoked' => 'Token revogado.',
    ],
];
