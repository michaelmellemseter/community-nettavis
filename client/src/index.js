// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert } from './widgets';
import { sakService } from './services';
import { kategoriService } from './services';
import { Saker, Newsfeed } from './widgets';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  kategorier = [];

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <NavLink className="navbar-brand" exact to="/">
                OPPDALS-AVISA
              </NavLink>
            </div>
            <ul className="nav navbar-nav">
              <li>
                <NavLink exact to="/nyeste">
                  Nyeste
                </NavLink>
                );
              </li>
              {this.kategorier.map((kategorier, i) => (
                <li key={i}>
                  <NavLink exact to={'/saker/' + kategorier.navn}>
                    {kategorier.navn}
                  </NavLink>
                  );
                </li>
              ))}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <NavLink to="/kategori">Administrer kategoriene</NavLink>;
              </li>
              <li>
                <NavLink to="/registreringsside">
                  Legg til sak <span>&#43;</span>
                </NavLink>
                ;
              </li>
            </ul>
          </div>
        </nav>
        <Newsfeed />
      </div>
    );
  }

  mounted() {
    kategoriService
      .getKategorier()
      .then(kategorier => (this.kategorier = kategorier))
      .catch((error: Error) => console.error(error.message));
  }
}

class Home extends Component {
  viktigeSaker = [];

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row content">
            <Saker saker={this.viktigeSaker} />
          </div>
        </div>
      </div>
    );
  }

  mounted() {
    sakService
      .getViktigeSaker()
      .then(viktigeSaker => (this.viktigeSaker = viktigeSaker))
      .catch((error: Error) => console.error(error.message));
  }
}

class Nyeste extends Component {
  saker = [];

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row content">
            <Saker saker={this.saker} />
          </div>
        </div>
      </div>
    );
  }

  mounted() {
    sakService
      .getSaker()
      .then(saker => (this.saker = saker))
      .catch((error: Error) => console.error(error.message));
  }
}

class Kategori extends Component<{ match: { params: { kategori: string } } }> {
  sakerKategori = [];

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row content">
            <Saker saker={this.sakerKategori} />
          </div>
        </div>
      </div>
    );
  }

  mounted() {
    sakService
      .getSakIKat(this.props.match.params.kategori)
      .then(sakerKategori => (this.sakerKategori = sakerKategori))
      .catch((error: Error) => console.error(error.message));
  }
}

class RegSide extends Component {
  kategorier = [];
  overskrift = '';
  tekst = '';
  bilde = '';
  kategori = '';
  viktighet = 0;
  checkboksen = '';

  render() {
    return (
      <ul>
        <div className="container-fluid">
          <h2>Legg til en nyhetsak:</h2>
          <h4>Overskrift:</h4>
          <input onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.overskrift = event.target.value)} />
          <h4>Tekst:</h4>
          <textarea
            rows="10"
            cols="100"
            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tekst = event.target.value)}
          />
          <h4>URL til bilde:</h4>
          <input onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.bilde = event.target.value)} />
          <h4>Kategori:</h4>
          <select onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.kategori = event.target.value)}>
            {this.kategorier.map((kategorier, i) => (
              <option value={kategorier.navn} key={i}>
                {kategorier.navn}
              </option>
            ))}
          </select>
          <h4>Er denne nyheten viktig?</h4>
          <form onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.checkboksen = event.target.value)}>
            Ja <input type="radio" name="check" value="ja" /> &nbsp; Nei <input type="radio" name="check" value="nei" />
          </form>
          <br />
          <button type="button" className="btn btn-success" onClick={this.save}>
            Legg til sak
          </button>
        </div>
      </ul>
    );
  }

  mounted() {
    kategoriService
      .getKategorier()
      .then(kategorier => (this.kategorier = kategorier))
      .catch((error: Error) => console.error(error.message));
  }

  save() {
    if (!this.kategori) this.kategori = this.kategorier[0].navn;

    if (!this.overskrift || !this.tekst || !this.bilde || !this.kategori) return null;

    if (this.checkboksen == 'ja') this.viktighet = 1;

    sakService
      .createSak(this.overskrift, this.tekst, this.bilde, this.viktighet, this.kategori)
      .then(() => {
        if (this.overskrift && this.tekst && this.bilde && this.kategori) history.push('/nyeste');
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class LeggTilKat extends Component {
  kategorier = [];
  nyKat = '';
  delKat = '';

  render() {
    return (
      <ul>
        <div classNameName="container-fluid">
          <h2>Legg til en kategori:</h2>
          <h4>Ny kategori:</h4>
          <input onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.nyKat = event.target.value)} />
          <br />
          <p />
          <button type="button" onClick={this.save}>
            Send inn
          </button>
          <p id="fullfort" />
          <h2>Slett en kategori:</h2>
          <select onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.delKat = event.target.value)}>
            {this.kategorier.map((kategorier, i) => (
              <option value={kategorier.navn} key={i}>
                {kategorier.navn}
              </option>
            ))}
          </select>
          <br />
          <p />
          <button type="button" onClick={this.del}>
            Slett
          </button>
        </div>
      </ul>
    );
  }

  mounted() {
    kategoriService
      .getKategorier()
      .then(kategorier => (this.kategorier = kategorier))
      .catch((error: Error) => console.error(error.message));
  }

  save() {
    if (!this.nyKat) return null;

    kategoriService
      .createKategori(this.nyKat)
      .then(() => {
        window.location.reload();
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  del() {
    if (!this.delKat) return null;

    kategoriService
      .deleteKategori(this.delKat)
      .then(() => {
        window.location.reload();
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class Sak extends Component<{ match: { params: { overskrift: string, tidspunkt: string } } }> {
  saken = '';

  render() {
    return (
      <ul>
        <div className="container-fluid">
          <h1>{this.saken.overskrift}</h1>
          <img src={this.saken.bilde} className="img-responsive" />
          <br />
          <p>{this.saken.innhold}</p>
          <p>{this.saken.tidspunkt}</p>
          <button type="button" className="btn btn-success" onClick={this.endre}>
            Endre sak
          </button>
        </div>
      </ul>
    );
  }

  mounted() {
    sakService
      .getSak(this.props.match.params.overskrift, this.props.match.params.tidspunkt)
      .then(sak => (this.saken = sak[0]))
      .catch((error: Error) => Alert.danger(error.message));
  }

  endre() {
    history.push('/sak/endre/' + this.saken.overskrift + '/' + this.saken.tidspunkt);
  }
}

class EndreSak extends Component<{ match: { params: { overskrift: string, tidspunkt: string } } }> {
  saken = '';
  kategorier = [];
  overskrift = '';
  innhold = '';
  bilde = '';
  kategori = '';
  viktighet = 0;
  checkboksen = 'nei';

  // sleit med å legge til flere defaultValues eller values i annet enn input fields,
  // la jeg til values o.l. kom verdien fra den orginale saken opp, men det gikk ikke å endre den på siden
  render() {
    return (
      <ul>
        <div className="container-fluid">
          <h2>Endre nyhetsaken:</h2>
          <h4>Endre overskriften:</h4>
          <input
            defaultValue={this.saken.overskrift}
            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.overskrift = event.target.value)}
          />
          <h4>Tekst: (NB: Om du lar feltet stå blankt vil den orginale teksten forbli)</h4>
          <textarea
            rows="10"
            cols="100"
            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.innhold = event.target.value)}
          />
          <h4>URL til bilde:</h4>
          <input
            defaultValue={this.saken.bilde}
            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.bilde = event.target.value)}
          />
          <h4>Kategori:</h4>
          <select onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.kategori = event.target.value)}>
            {this.kategorier.map((kategorier, i) => (
              <option value={kategorier.navn} key={i}>
                {kategorier.navn}
              </option>
            ))}
          </select>
          <h4>Er denne nyheten viktig?</h4>
          <form onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.checkboksen = event.target.value)}>
            Ja <input type="radio" name="check" value="ja" /> &nbsp; Nei <input type="radio" name="check" value="nei" />
          </form>
          <br />
          <button type="button" className="btn btn-success" onClick={this.update}>
            Endre
          </button>
          <h3>Slett denne saken</h3>
          <button type="button" className="btn btn-danger" onClick={this.del}>
            Slett
          </button>
        </div>
      </ul>
    );
  }

  mounted() {
    sakService
      .getSak(this.props.match.params.overskrift, this.props.match.params.tidspunkt)
      .then(sak => (this.saken = sak[0]))
      .catch((error: Error) => Alert.danger(error.message));

    kategoriService
      .getKategorier()
      .then(kategorier => (this.kategorier = kategorier))
      .catch((error: Error) => console.error(error.message));
  }

  update() {
    if (!this.overskrift) this.overskrift = this.saken.overskrift;
    if (!this.innhold) this.innhold = this.saken.innhold;
    if (!this.bilde) this.bilde = this.saken.bilde;
    if (!this.kategori) this.kategori = this.kategorier[0].navn;

    if (this.checkboksen == 'ja') this.viktighet = 1;

    sakService
      .updateSak(
        this.overskrift,
        this.innhold,
        this.saken.tidspunkt,
        this.bilde,
        this.viktighet,
        this.kategori,
        this.saken.overskrift
      )
      .then(() => {
        if (this.overskrift && this.innhold && this.bilde && this.kategori)
          history.push('/sak/ensak/' + this.overskrift + '/' + this.saken.tidspunkt);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  del() {
    sakService
      .deleteSak(this.saken.overskrift, this.saken.tidspunkt)
      .catch((error: Error) => Alert.danger(error.message));
    history.push('/');
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/registreringsside" component={RegSide} />
        <Route path="/sak/ensak/:overskrift/:tidspunkt" component={Sak} />
        <Route path="/sak/endre/:overskrift/:tidspunkt" component={EndreSak} />
        <Route path="/saker/:kategori" component={Kategori} />
        <Route path="/nyeste" component={Nyeste} />
        <Route path="/kategori" component={LeggTilKat} />
      </div>
    </HashRouter>,
    root
  );
