@component('mail::message')
# Redefinição de Senha

Você solicitou a redefinição de sua senha. Clique no botão abaixo para redefini-la:

@component('mail::button', ['url' => $url])
Redefinir Senha
@endcomponent

Se você não solicitou a redefinição de senha, nenhuma ação é necessária.

Obrigado,<br>
{{ config('app.name') }}
@endcomponent