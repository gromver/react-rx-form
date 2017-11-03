/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'rx-model';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/add/operator/debounceTime';
import utils from './utils';

export default class FormConnect extends PureComponent {
  static TICK = 33;

  static propTypes = {
    form: PropTypes.instanceOf(Form).isRequired,
    children: PropTypes.func.isRequired,
    whenForm: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
    whenModel: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
    debounce: PropTypes.number,
  };

  static defaultProps = {
    debounce: FormConnect.TICK,
    whenForm: false,
    whenModel: false,
  };

  constructor(props, context) {
    super(props, context);

    this.connect(props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.form !== nextProps.form
      || !utils.compareAttributes(this.props.whenForm, nextProps.whenForm)
      || !utils.compareAttributes(this.props.whenModel, nextProps.whenModel)
      || this.props.debounce !== nextProps.debounce
    ) {
      this.connect(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  subscription;

  connect({ form, whenForm, whenModel, debounce: delay }) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const stateObservable = form.getStateObservable();
    const attributeObservable = form.getAttributeObservable();
    const validationObservable = form.getValidationObservable();

    const observables = [];

    if (whenModel !== false) {
      const attributes = Array.isArray(whenModel) ? whenModel : [];

      observables.push(attributeObservable.when(attributes));
      validationObservable.when(attributes);

      if (delay > 0) {
        observables.push(validationObservable.debounceTime(delay));
      } else {
        observables.push(validationObservable);
      }
    }

    if (whenForm !== false) {
      const properties = Array.isArray(whenForm) ? whenForm : [];

      observables.push(stateObservable.when(properties));
    }

    this.subscription = merge(...observables).subscribe(() => this.forceUpdate());
  }

  render() {
    return this.props.children(this.props.form);
  }
}
