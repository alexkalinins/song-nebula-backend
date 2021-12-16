import express from "express";
import serverless from "serverless-http";
import getToken from "./auth/s2s_spotify";

import dotenv from 'dotenv';
dotenv.config();

import SpotifyController from './controller/SpotifyController';

const app = express();
const PORT = 3001;
 
app.get('/', async function (req, res) {
  let token='';
  try{
    token = await getToken();
  }catch(err){
    console.log(err);
  }

  await SpotifyController.getSong('798mI116dJdZ12n9CkdflI');

  res.send('Token: ' + token);
})

app.listen( PORT, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ PORT }` );
} );
 
module.exports.handler = serverless(app);