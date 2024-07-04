const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'static.json');
const destination = path.join(__dirname, 'dist', 'static.json');

fs.copyFile(source, destination, (err) => {
  if (err) {
    console.error('Erro ao copiar o arquivo static.json:', err);
  } else {
    console.log('Arquivo static.json copiado com sucesso para o diretório dist.');
  }
});