require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page', message: 'Welcome to the Home Page!' });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});