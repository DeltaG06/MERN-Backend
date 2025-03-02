// Import express from express
import express from 'express';
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 6439

// Get ther file path from the URL of current module
const __filename = fileURLToPath(import.meta.url)
//Get the directory name from the file path
const __dirname = dirname(__filename)
//serving up hTML filefrom /public directory
app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname,'public','index.html'));

});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});