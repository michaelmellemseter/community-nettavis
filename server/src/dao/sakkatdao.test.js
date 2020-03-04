// @flow

let mysql = require('mysql');
let fs = require('fs');

const KatDao = require('./katdao.js');
const SakDao = require('./sakdao.js');
const runsqlfile = require('./runsqlfile.js');

var pool = mysql.createPool({
  connectionLimit: 2,
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'supertestdb',
  debug: false,
  multipleStatements: true
});

let katdao = new KatDao(pool);
let sakdao = new SakDao(pool);

beforeAll(done => {
  runsqlfile('server/src/dao/create_tables.sql', pool, () => {
    runsqlfile('server/src/dao/create_testdata.sql', pool, done);
  });
});

afterAll(() => {
  pool.end();
});

test('get alle kategorier fra db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.length).toBe(2);
    expect(data[0].navn).toBe('Sport');
    done();
  }
  katdao.getAllKat(callback);
});

test('add kategori til db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  katdao.createOneKat('Innenriks', callback);
});

test('delete kategori til db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  katdao.deleteOneKat('Sport', callback);
});

test('get alle saker fra db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.length).toBe(2);
    expect(data[0].overskrift).toBe('Test2');
    done();
  }
  sakdao.getSaker(callback);
});

test('get alle viktige saker fra db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe('Test2');
    done();
  }
  sakdao.getViktigeSaker(callback);
});

test('get en sak fra db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe('Test');
    done();
  }
  sakdao.getSak('Test', '2018-09-07 00:00:00', callback);
});

test('get alle saker fra en kategori fra db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe('Test');
    done();
  }
  sakdao.getKatSak('Sport', callback);
});

test('add sak til db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  sakdao.createSak(
    {
      overskrift: 'Test3',
      innhold: 'Flere tester',
      tidspunkt: '2018-11-20 13:21:11',
      bilde: 'url',
      viktighet: 0,
      kategori: 'Innenriks'
    },
    callback
  );
});

test('update sak til db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  sakdao.updateSak(
    { overskrift: 'Test', tidspunkt: '2018-09-07 00:00:00' },
    {
      overskrift: 'Test3',
      innhold: 'Flere tester',
      tidspunkt: '2018-09-14 00:00:00',
      bilde: 'url',
      viktighet: 1,
      kategori: 'Innenriks'
    },
    callback
  );
});

test('delete sak fra db', done => {
  function callback(status, data) {
    console.log('Test callback: status=' + status + ', data=' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  sakdao.deleteSak('Test2', '2018-09-17 10:15:00', callback);
});
