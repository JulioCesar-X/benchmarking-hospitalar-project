# Sistema de Gestão de Serviços Benchmark Hospitalar

Este repositório contém o projeto final para a UFCD 5425 - Curso Técnico Especialista em Tecnologias e Programação de Sistemas de Informação da ATEC. O sistema de gestão de serviços Benchmark Hospitalar é uma aplicação web desenvolvida com Laravel para o backend e Angular para o frontend. Utiliza Docker para facilitar a criação e gestão do ambiente de desenvolvimento.

## Requisitos

- Docker
- Docker Compose

## Tecnologias Utilizadas

- Laravel: Framework PHP para o backend da aplicação.
- Angular: Framework frontend para a interface do usuário.
- PostgreSQL: Sistema de gerenciamento de banco de dados.
- Nginx: Servidor web para servir o frontend Angular.


## Configuração e Uso

### Clonar o Repositório:

<code>git clone https://github.com/JulioCesar-X/benchmarking-hospitalar-project.git</code>

### Iniciando o Ambiente de Desenvolvimento:

<code>cd seu-repositorio</code><br>
<code>docker-compose up -d</code>

### Acessando a Aplicação:

- Backend Laravel: http://localhost:8000
- Frontend Angular: http://localhost:4200

### Configuração Inicial:

#### Instalar Dependências do Laravel:

- Navegue até o diretório raiz do seu projeto.
Execute os seguintes comandos para instalar as dependências do Laravel, copiar o arquivo .env.example e gerar a chave de aplicativo:

<code>composer install</code><br>
<code>cp .env.example .env</code><br>
<code>php artisan key:generate</code><br>

 Isso irá instalar as dependências do Laravel, copiar o arquivo de configuração e gerar a chave de aplicativo, tudo localmente no seu ambiente de desenvolvimento, fora do container.

- Na raiz do projeto vá iniciar o angular:
<code>cd frontend</code><br>
<code>npm install</code><br>
<code>ng serve</code><br>

## Dentro do container

<code>docker-compose exec laravel-app composer install</code>

#### Configuração do Ambiente:

<code>docker-compose exec laravel-app cp .env.example .env</code><br>
<code>docker-compose exec laravel-app php artisan key:generate</code><br>

Verifique se as configurações de banco de dados em `.env` correspondem às configuradas em `docker-compose.yml`.

### Desenvolvimento:

Você pode editar o código fonte do Laravel e Angular localmente em sua máquina. As alterações serão refletidas nos contêineres Docker.
Para aplicar alterações que requerem reinicialização do contêiner ou atualização de configurações, use:

<code>docker-compose restart</code>

### Parando o Ambiente:

Para parar e remover os contêineres, use:

<code>docker-compose down</code>

## Contribuições

Este trabalho está sendo realizado em grupo. Contribuições para o projeto são bem-vindas. Certifique-se de que qualquer pull request ou mudanças mantenham compatibilidade com a configuração do Docker.