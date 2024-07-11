<?php

$password = 'atec123';
$storedHash = '$2y$10$CKruLhLOu6dPw9P8YuUfI.a3AjEYB47iVPmyIFXzrD8...'; // Copie o hash diretamente do banco de dados

echo "Senha original: $password\n";
echo "Hash armazenado: $storedHash\n";

if (password_verify($password, $storedHash)) {
    echo "A senha fornecida corresponde ao hash armazenado.\n";
} else {
    echo "A senha fornecida não corresponde ao hash armazenado.\n";
}
