@extends('emails.layouts.email')

@section('content')
<h2>Redefinição de Senha</h2>
<p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para redefini-la:</p>
<a href="{{ $url }}" class="button">Redefinir Senha</a>
<p>Se você não solicitou a redefinição de senha, nenhuma ação é necessária.</p>
@endsection