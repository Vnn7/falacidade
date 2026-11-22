const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.resolve(process.argv[2] || 'dist');
const tipos = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
  '.ttf': 'font/ttf', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css' };
http.createServer((req, res) => {
  let arquivo = path.resolve(raiz, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (arquivo !== raiz && !arquivo.startsWith(raiz + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(arquivo) || fs.statSync(arquivo).isDirectory()) arquivo = path.join(raiz, 'index.html');
  res.setHeader('Content-Type', tipos[path.extname(arquivo)] || 'application/octet-stream');
  fs.createReadStream(arquivo).on('error', () => { res.writeHead(404).end(); }).pipe(res);
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173'));
