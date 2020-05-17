import http from 'http'

http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end('Ok')
    })
    .listen(process.env.PORT && process.env.PORT !== '' ? process.env.PORT : 3000)
