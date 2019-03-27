require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
app.get('/', function (req, res) {
  res.json('Hello World')
});
 
app.get('/user', function (req, res) {
  res.json('get User')
});

app.post('/user', function (req, res) {

  let body = req.body;

  if (body.name === undefined || body.age === undefined) {
    res.status(400).json({
      response: {},
      status: 400,
      message: 'More parameters needed.'
    });
  } else {
    res.json({
      response: body,
      status: 200,
      message: 'ok'
    });
  }

});

app.put('/user/:id', function (req, res) {

  let id = req.params.id;

  res.json({
    id
  });
});

app.delete('/user', function (req, res) {
  res.json('delete User')
});

app.listen(process.env.PORT, () => {
    console.log(`Running on port: ${process.env.PORT}`);
});