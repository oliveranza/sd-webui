const fs = require('fs');
const csv = require('csv-parser');
const express = require('express');
const bodyParser = require('body-parser');
const { format } = require('date-fns');
const { exec } = require('child_process');

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
 * @description Salva uma imagem no servidor.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} req.body - Corpo da requisição contendo a imagem a ser salva.
 * @param {string} req.body.data - Dados da imagem codificados em base64.
 * @param {object} res - Objeto de resposta do Express.
 * @returns {object} - Resposta contendo uma mensagem informando se a imagem foi salva com sucesso ou não.
 */
app.post('/saveImage', (req, res) => {
  const { data, seed } = req.body;
  const result = checkImgData(data);
  const filepath = defineFilepath(result.extname, seed);

  fs.writeFile(filepath, result.base64, { encoding: 'base64' }, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to save image');
    } else {
      res.json('Image saved successfully').status(200).send();
    }
  });
});

function defineFilepath(extname, seed) {
  const date = format(new Date(), 'yyyy-MM-dd');
  const dirName = `${__dirname}/images/${date}`;
  !fs.existsSync(dirName) && fs.mkdirSync(dirName);

  let filename = 0;
  const folder = fs.readdirSync(dirName);
  folder.forEach((item) => {
    if (item.includes(filename.toString().padStart(4, '0'))) {
      filename++;
    }
  });
  return `${dirName}/${filename.toString().padStart(4, '0')} - [${seed}]${extname}`;
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

/**
 * @description Abre a pasta de imagens do projeto no explorador do sistema operacional.
 * @route GET /openFolder
 * @access Public
 * @returns {Object} Retorna uma resposta JSON indicando que a pasta foi aberta.
 */
app.get('/openFolder', (req, res) => {
  let command;
  if (process.platform === 'win32') {
    command = 'explorer ';
  } else {
    command = 'xdg-open ';
  }
  exec(`${command} ${__dirname}\\images`);
  return res.json('Pasta aberta com sucesso');
});
/**
 * @description recupera a lista dos estilos.
 * @route GET /getStyles
 * @access Public
 * @returns {Object} Retorna uma resposta JSON com a lista de estilos salvas
 */
app.get('/getStyles', async (req, res) => {
  try {
    res.status(200).send(await getCSV());
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/saveStyles', async (req, res) => {
  const { data } = req.body;
  try {
    const result = await getCSV();
    result.push(data);
    const csvfinal = result
      .map((row, index) => {
        if (Array.isArray(row) && index > 0) {
          return row.join('","').replace(/"/, '').concat('"');
        } else if (Array.isArray(row) && index === 0) {
          return row.join(',');
        }
        return '';
      })
      .join('\n');
    fs.writeFile('styles.csv', csvfinal, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to save styles');
      } else {
        res.json('Style saved successfully!').status(200).send();
        console.log('Novo Style salvo: ');
        console.log(result[result.length - 1]);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to read styles');
  }
});

function getCSV() {
  return new Promise((resolve, reject) => {
    const results = [['name', 'prompt', 'negative_prompt']];

    fs.createReadStream(`${__dirname}/styles.csv`)
      .pipe(csv())
      .on('data', (data) => {
        data = Object.values(data);
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      });
  });
}
