@extends('emails.layouts.email')

@section('content')
<h2>Bem-vindo à HospMetrics</h2>
<p>Olá,</p>
<p>Você foi registrado com sucesso na nossa aplicação. Aqui estão suas credenciais de acesso:</p>
<p><strong>Email:</strong> {{ $email }}</p>
<p><strong>Senha:</strong> {{ $nif }} (seu NIF)</p>
<p>Por favor, altere sua senha após o primeiro login.</p>
<p>Estamos felizes em tê-lo conosco!</p>
<a href="{{ $url }}" class="button">clique aqui</a>
@endsection