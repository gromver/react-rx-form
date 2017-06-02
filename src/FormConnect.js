import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'rx-form';

export default class FormConnect extends PureComponent {
  static propTypes = {
    form: PropTypes.instanceOf(Form).isRequired,
    children: PropTypes.func.isRequired,
    whenForm: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
    whenModel: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
  };

  static defaultProps = {
    whenForm: [],
    whenModel: [],
  };

  constructor(props, context) {
    super(props, context);

    const observable = props.form.getObservable();

    if (props.whenForm === true) {
      observable.whenFormChanged();
    } else if (Array.isArray(props.whenForm) && props.whenForm.length) {
      observable.whenStateChanged(props.whenForm);
    }

    if (props.whenModel === true) {
      observable.whenModelChanged();
    } else if (Array.isArray(props.whenModel) && props.whenModel.length) {
      observable.whenAttributesChanged(props.whenModel);
    }

    this.subscription = observable.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  subscription;

  render() {
    return this.props.children(this.props.form);
  }
}
