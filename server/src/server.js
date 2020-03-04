// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';

var mysql = require('mysql');
var bodyParser = require('body-parser');
var apiRoutes = express.Router();

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json
app.use(bodyParser.json()); // for å tolke JSON

const SakDao = require('./dao/sakdao.js');
const KatDao = require('./dao/katdao.js');

var pool = mysql.createPool({
  connectionLimit: 2,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'michame',
  password: 'Q9lAOno1',
  database: 'michame',
  debug: false
});

let sakDao = new SakDao(pool);
let katDao = new KatDao(pool);

//Get alle saker
app.get('/saker', (req, res) => {
  console.log('/saker: fikk request fra klient');
  sakDao.getSaker((status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Get alle viktige
app.get('/saker/viktige', (req, res) => {
  console.log('/sak/viktige: fikk request fra klient');
  sakDao.getViktigeSaker((status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Get alle saker i en kategori
app.get('/saker/:kategori', (req, res) => {
  console.log('/sak/:kategori: fikk request fra klient');
  sakDao.getKatSak(req.params.kategori, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Get en sak
app.get('/sak/ensak/:overskrift/:tidspunkt', (req, res) => {
  console.log('/sak/ensak/:overskrift/:tidspunkt: fikk request fra klient');
  sakDao.getSak(req.params.overskrift, req.params.tidspunkt, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Create sak
app.post('/sak', (req, res) => {
  console.log('Fikk PUT-request fra klienten');
  sakDao.createSak(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Update sak
app.put('/sak/:overskrift/:tidspunkt', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  sakDao.updateSak({ overskrift: req.params.overskrift, tidspunkt: req.params.tidspunkt }, req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Delete sak
app.delete('/sak/:overskrift/:tidspunkt', (req, res) => {
  console.log('Fikk DELETE-request fra klienten');
  sakDao.deleteSak(req.params.overskrift, req.params.tidspunkt, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Get alle kategoriene
app.get('/kategori', (req, res) => {
  console.log('/kategori: fikk request fra klient');
  katDao.getAllKat((status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Create kategori
app.post('/kategori/:navn', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  katDao.createOneKat(req.params.navn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

//Delete kategori
app.delete('/kategori/:navn', (req, res) => {
  console.log('Fikk DELETE-request fra klienten');
  katDao.deleteOneKat(req.params.navn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started');
    resolve();
  });
});

var server = app.listen(8080);
