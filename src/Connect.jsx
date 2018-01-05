/**
*
* FormConnect
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Model, Form, events } from 'rx-form';
import isEqual from 'lodash/isEqual';
import { merge } from 'rxjs/observable/merge';
import { filter } from 'rxjs/operator/filter';
import { debounceTime } from 'rxjs/operator/debounceTime';

class FormConnect extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static TICK = 33;

  constructor(props, context) {
    super(props, context);

    this.connect(props.target, props.attributes, props.debounce);
  }

  componentWillReceiveProps(next) {
    if (
      this.props.target !== next.target
      || !isEqual(this.props.attributes, next.attributes)
      || this.props.debounce !== next.debounce
    ) {
      this.connect(next.target, next.attributes, next.debounce);
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  subscription;

  /**
   * Connect to the target
   * @param {Form | Model} target
   * @param {(string | number)[]} attributes
   * @param {number} delay
   */
  connect(target, attributes, delay) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    let observable;

    if (target instanceof Model) {
      observable = target.getObservable();
    } else if (target instanceof Form) {
      observable = target.getModel().getObservable();
    } else {
      throw new Error('Connect::target must be an instance of Model or Form');
    }

    if (attributes.length) {
      observable = observable::filter(
        (event) => !!attributes.find((attr) => isEqual(attr, event.path)),
      );
    }

    if (delay) {
      observable = merge(
        observable::filter((event) => event instanceof events.SetValueEvent),
        observable::filter(
          (event) => !(event instanceof events.SetValueEvent),
        )::debounceTime(delay),
      );
    }

    this.subscription = observable.subscribe(() => this.forceUpdate());
  }

  render() {
    const { render, target } = this.props;

    return render(target);
  }
}

FormConnect.propTypes = {
  render: PropTypes.func.isRequired,
  target: PropTypes.oneOfType([PropTypes.instanceOf(Form), PropTypes.instanceOf(Model)]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  attributes: PropTypes.array,
  debounce: PropTypes.number,
};

FormConnect.defaultProps = {
  debounce: FormConnect.TICK,
  attributes: [],
};

export default FormConnect;
