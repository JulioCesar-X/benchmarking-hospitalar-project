@extends('emails.layouts.email')

@section('content')
<h2>Nova Mensagem Recebida</h2>
<p>Informamos que acabaste de receber uma nova mensagem. Clique no botão abaixo para visualizá-la:</p>
<a href="{{ $url }}" class="button">Ver Mensagem</a>
<p>Se você não esperava por essa notificação, nenhuma ação é necessária.</p>
@endsection