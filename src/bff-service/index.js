import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cache from './cache.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
    const { originalUrl, method, body } = req;
    const recipient = originalUrl.split('/')[1];
    const apiURL = originalUrl.slice(recipient.length + 1);

    const recipientURL = process.env[recipient];

    if(recipientURL) {
        const request = {
            method,
            url: `${recipientURL}${apiURL}`,
            ...(Object.keys(body || {}).length > 0 && {data: body}),
        };
        const requestString = JSON.stringify(request);
        const cachedResult = cache.load(requestString);
        if(!cachedResult) {
            console.log('usual');
            axios(request)
            .then(({ data }) => {
                res.json(data);
                cache.save(requestString, data);
            })
            .catch(error => {
                if(error.response) {
                    const {
                        status,
                        data
                    } = error.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({ error: error.message });
                }
            })
        } else {
            console.log('cached result');
            res.json(cachedResult);
        }
    } else {
        res.status(502).json({ error: 'Cannot process request' });
    }
})

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
