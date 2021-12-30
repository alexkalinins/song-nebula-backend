import express from "express";
import serverless from "serverless-http";
import ClusterRoute from './routes/cluster_radio';
import SpotifyRoute from './routes/spotify';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'


dotenv.config();

const app = express();
const PORT = 3001;

const nebulaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // tell client about rate limit
  legacyHeaders: false
});

const radioLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // tell client about rate limit
  legacyHeaders: false
});

 
app.get('/', async function (req, res) {
    res.send('Hello World!');
})

app.use('/spotify', nebulaLimiter);
app.use('/spotify', SpotifyRoute);

app.use('/cluster_radio', radioLimiter);
app.use('/cluster_radio', ClusterRoute);

app.listen( PORT, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ PORT }` );
} );
 
module.exports.handler = serverless(app);