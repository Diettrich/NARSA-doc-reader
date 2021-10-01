const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use('/bootstrap/dist/css', express.static(path.join(__dirname, './node_modules/bootstrap/dist/css')));
app.use('/bootstrap/dist/js', express.static(path.join(__dirname, './node_modules/bootstrap/dist/js')));
app.use('/cropperjs', express.static(path.join(__dirname, './node_modules/cropperjs/dist')));

app.get('/', (req, res) => {
    res.redirect('/index/html');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});