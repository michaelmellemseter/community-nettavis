DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS sak;

CREATE TABLE kategori  (
  navn varchar(30),
  PRIMARY KEY (navn)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE sak  (
  overskrift varchar(70),
  innhold text,
  tidspunkt varchar(20),
  bilde varchar(500),
  viktighet int(11),
  kategori varchar(30),
  PRIMARY KEY (overskrift, tidspunkt)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;