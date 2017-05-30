import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'rx-form';

export default class FormConnect extends PureComponent {
  static propTypes = {
    form: PropTypes.instanceOf(Form).isRequired,
    children: PropTypes.func.isRequired,
    whenForm: PropTypes.arrayOf(PropTypes.string),
    whenModel: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    whenForm: [],
    whenModel: [],
  };

  constructor(props, context) {
    super(props, context);

    let formObservable = props.form.getObservable();

    if (props.whenForm.length) {
      formObservable = props.form.when(props.whenForm);
    }

    this.formSubscription = formObservable.subscribe(() => this.forceUpdate());

    const modelObservable = props.form.getModel().getObservable();

    if (props.whenModel.length) {
      modelObservable.when(props.whenModel);
    }

    this.modelSubscription = modelObservable.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.formSubscription.unsubscribe();
    this.modelSubscription.unsubscribe();
  }

  formSubscription;
  modelSubscription;

  render() {
    return this.props.children(this.props.form);
  }
}
