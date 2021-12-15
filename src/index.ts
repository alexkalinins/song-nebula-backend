import express from "express";
import serverless from "serverless-http";

const app = express();
const PORT = 3001;
 
app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen( PORT, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ PORT }` );
} );
 
module.exports.handler = serverless(app);