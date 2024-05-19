# Usando Node.js como base
FROM node:20

# Define informações do usuário (opcional, dependendo do ambiente)
# A criação de um usuário não root pode ajudar com questões de permissão
RUN useradd -m front

# Definindo o diretório de trabalho
WORKDIR /app

# Instalando Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiando os arquivos de dependência primeiro para otimizar o cache do build
COPY package.json package-lock.json ./

# Instalando dependências
RUN npm install

# Corrigindo possíveis problemas de permissão diretamente após a instalação
RUN chown -R front:front /app

# Trocando para o usuário não root
USER front

# Copiando o restante dos arquivos do projeto
COPY --chown=front:front . .

# Expondo a porta 4200 para acesso ao servidor de desenvolvimento
EXPOSE 4200

# Iniciando o aplicativo Angular com o proxy configurado
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000","--disable-host-check", "--proxy-config", "proxy.conf.json"]
