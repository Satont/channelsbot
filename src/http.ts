import express from 'express';

import guilds from './routes/guilds';
import createdChannels from './routes/createdChannels';
import channelsForJoin from './routes/channelsForJoin';

const app = express();

app.get('/', (req, res) => res.send('Ok'));

app.use('/api/v1/guilds', guilds);
app.use('/api/v1/channels/created', createdChannels);
app.use('/api/v1/channels/joinable', channelsForJoin);

app.listen(process.env.PORT && process.env.PORT !== '' ? process.env.PORT : 3000);
