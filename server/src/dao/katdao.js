const Dao = require('./dao.js');

module.exports = class KatDao extends Dao {
  getAllKat(callback) {
    super.query('select * from kategori', [], callback);
  }

  createOneKat(navn, callback) {
    super.query('insert into kategori (navn) values (?)', [navn], callback);
  }

  deleteOneKat(navn, callback) {
    super.query('delete from kategori where navn=?', [navn], callback);
  }
};
