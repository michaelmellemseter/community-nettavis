const Dao = require('./dao.js');

module.exports = class SakDao extends Dao {
  getSaker(callback) {
    super.query('select * from sak order by tidspunkt desc limit 20', [], callback);
  }

  getViktigeSaker(callback) {
    super.query('select * from sak where viktighet=1 order by tidspunkt desc limit 20', [], callback);
  }

  getSak(overskrift, tidspunkt, callback) {
    super.query('select * from sak where overskrift=? and tidspunkt=?', [overskrift, tidspunkt], callback);
  }

  getKatSak(kategori, callback) {
    super.query('select * from sak where kategori=? order by tidspunkt desc limit 20', [kategori], callback);
  }

  createSak(json, callback) {
    var val = [json.overskrift, json.innhold, json.bilde, json.viktighet, json.kategori];
    super.query(
      "insert into sak (overskrift,innhold,tidspunkt,bilde,viktighet,kategori) values (?,?,DATE_FORMAT(NOW(), '%Y-%m-%d %k:%i'),?,?,?)",
      val,
      callback
    );
  }

  updateSak(nokler, nyInfo, callback) {
    var val = [
      nyInfo.overskrift,
      nyInfo.innhold,
      nyInfo.tidspunkt,
      nyInfo.bilde,
      nyInfo.viktighet,
      nyInfo.kategori,
      nokler.overskrift,
      nokler.tidspunkt
    ];
    super.query(
      'update sak set overskrift=? ,innhold=? ,tidspunkt=? ,bilde=? ,viktighet=? ,kategori=? where overskrift=? and tidspunkt=?',
      val,
      callback
    );
  }

  deleteSak(overskrift, tidspunkt, callback) {
    super.query('delete from sak where overskrift=? and tidspunkt=?', [overskrift, tidspunkt], callback);
  }
};
