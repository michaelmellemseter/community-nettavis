// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Sak {
  overskrift: string;
  innhold: string;
  tidspunkt: string;
  bilde: string;
  viktighet: number;
  kategori: string;
}

class SakService {
  getSaker(): Promise<Sak[]> {
    return axios.get('/saker');
  }

  getSak(overskrift: string, tidspunkt: string): Promise<Sak[]> {
    return axios.get('/sak/ensak/' + overskrift + '/' + tidspunkt);
  }

  getViktigeSaker(): Promise<Sak[]> {
    return axios.get('/saker/viktige');
  }

  getSakIKat(kategori: string): Promise<Sak[]> {
    return axios.get('/saker/' + kategori);
  }

  updateSak(
    overskrift: string,
    innhold: string,
    tidspunkt: string,
    bilde: string,
    viktighet: number,
    kategori: string,
    gammelOverskrift: string
  ): Promise<void> {
    var sak = new Sak();
    sak.overskrift = overskrift;
    sak.innhold = innhold;
    sak.tidspunkt = tidspunkt;
    sak.bilde = bilde;
    sak.viktighet = viktighet;
    sak.kategori = kategori;
    return axios.put('/sak/' + gammelOverskrift + '/' + tidspunkt, sak);
  }

  createSak(overskrift: string, innhold: string, bilde: string, viktighet: number, kategori: string): Promise<void> {
    var sak = new Sak();
    sak.overskrift = overskrift;
    sak.innhold = innhold;
    sak.bilde = bilde;
    sak.viktighet = viktighet;
    sak.kategori = kategori;
    return axios.post('/sak', sak);
  }

  deleteSak(overskrift: string, tidspunkt: string): Promise<void> {
    return axios.delete('/sak/' + overskrift + '/' + tidspunkt);
  }
}

export let sakService = new SakService();

class Kategori {
  navn: string;
}

class KategoriService {
  getKategorier(): Promise<Kategori[]> {
    return axios.get('/kategori');
  }

  createKategori(navn: string): Promise<void> {
    return axios.post('/kategori/' + navn);
  }

  deleteKategori(navn: string): Promise<void> {
    return axios.delete('/kategori/' + navn);
  }
}

export let kategoriService = new KategoriService();
