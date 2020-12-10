const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
    const { originalUrl, method, body } = req;
    const recipient = originalUrl.split('/')[1];
    const apiURL = originalUrl.slice(recipient.length + 1);

    const recipientURL = process.env[recipient];

    if(recipientURL) {
        axios({
            method,
            url: `${recipientURL}${apiURL}`,
            ...(body && ({ data: body })),
        })
        .then(({ data }) => {
            res.json(data);
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
        res.status(502).json({ error: 'Cannot process request' });
    }
})

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
