// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { sakService } from './services';

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
  alerts: { text: React.Node, type: string }[] = [];

  render() {
    return (
      <>
        {this.alerts.map((alert, i) => (
          <div key={i} className={'alert alert-' + alert.type} role="alert">
            {alert.text}
            <button
              className="close"
              onClick={() => {
                this.alerts.splice(i, 1);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </>
    );
  }

  static success(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'success' });
    });
  }

  static info(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'info' });
    });
  }

  static warning(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'warning' });
    });
  }

  static danger(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'danger' });
    });
  }
}

export class Saker extends Component<{ saker: [] }> {
  render() {
    return (
      <div>
        {this.props.saker.map((saker, i) => (
          <div className="col-md-4" key={i}>
            <NavLink exact to={'/sak/ensak/' + this.props.saker[i].overskrift + '/' + this.props.saker[i].tidspunkt}>
              <img src={this.props.saker[i].bilde} class="img-responsive" />
              <h3>{this.props.saker[i].overskrift}</h3>
            </NavLink>
          </div>
        ))}
      </div>
    );
  }
}

export class Newsfeed extends Component {
  saker = [];

  render() {
    return (
      <div>
        <marquee height="40">
          {this.saker.map((saker, i) => (
            <NavLink
              exact
              to={'/sak/ensak/' + this.saker[i].overskrift + '/' + this.saker[i].tidspunkt}
              key={i}
              style={{ margin: '20px' }}
            >
              {this.saker[i].overskrift} &nbsp; {this.saker[i].tidspunkt}
            </NavLink>
          ))}
        </marquee>
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
