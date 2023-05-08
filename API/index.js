const express = require('express');
const fs = require('fs');
const { format } = require('date-fns');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const { log } = require('console');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/**
* @description Retorna uma mensagem indicando que a API está funcionando.
* @route GET /teste 
* @returns {object} Retorna um objeto com a mensagem de sucesso.
* @throws {Error} Se ocorrer um erro ao processar a requisição.
*/
app.get('/teste', (req, res) => {
  return res.json('A API está funcionando');
});


/**
 * @description Abre a pasta de imagens do projeto no explorador do sistema operacional.
 * @route GET /openFolder
 * @access Public
 * @returns {Object} Retorna uma resposta JSON indicando que a pasta foi aberta.
 */
app.get('/openFolder', (req, res) => {
  if (process.platform === 'win32') {
    // no Windows, usa o comando 'explorer'
    exec(`explorer D:\\Repositorio Local\\sd-webui\\API\\images`);
  } else {
    // em outros sistemas operacionais, usa o comando 'xdg-open'
    exec(`xdg-open`);
  }
  return res.json('Opened');
});


/**
 * @description Salva uma imagem no servidor.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} req.body - Corpo da requisição contendo a imagem a ser salva.
 * @param {string} req.body.data - Dados da imagem codificados em base64.
 * @param {object} res - Objeto de resposta do Express.
 * @returns {object} - Resposta contendo uma mensagem informando se a imagem foi salva com sucesso ou não.
 */
app.post('/saveImage', (req, res) => {
  const { data } = req.body;
  const result = checkImgData(data);
  const filepath = defineFilepath(result.extname);

  fs.writeFile(filepath, result.base64, { encoding: 'base64' }, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to save image');
    } else {
      res.json('Image saved successfully').status(200).send();
    }
  });
});

function defineFilepath(extname) {
  const date = format(new Date(), 'yyyy-MM-dd');
  const dirName = `D:/Repositorio Local/sd-webui/API/images/${date}`;
  !fs.existsSync(dirName) && fs.mkdirSync(dirName);

  let filename = 0;
  while (fs.existsSync(dirName + '/' + filename.toString().padStart(4, '0') + extname)) {
    filename++;
  }

  return path.join(dirName, filename.toString().padStart(4, '0') + extname);
}

function checkImgData(data) {
  const reg = /^data:image\/([\w+]+);base64,([\s\S]+)/;
  const match = data.match(reg);
  let baseType = {
    jpeg: 'jpg',
  };

  baseType['svg+xml'] = 'svg';

  if (!match) {
    throw new Error('image base64 data error');
  }

  const extname = baseType[match[1]] ? baseType[match[1]] : match[1];

  return {
    extname: '.' + extname,
    base64: match[2],
  };
}
