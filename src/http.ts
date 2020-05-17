import express from 'express'
//routes
import guilds from './routes/guilds'


const app = express()

app.get('/', (req, res) => res.send('Ok'))

app.use('/api/v1/guilds', guilds)

app.listen(process.env.PORT && process.env.PORT !== '' ? process.env.PORT : 3000)


