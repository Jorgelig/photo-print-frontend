const express = require("express");
const app = express();
let listenPort = process.env.PORT || 3000;

app.use(express.static("build"))

 // Express serve up index.html file if it doesn't recognize route
 const path = require('path');
 app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
 });
 
app.listen(listenPort, ()=> {
  console.log("server running on port "+ listenPort);
})

