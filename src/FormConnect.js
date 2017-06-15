import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'rx-form';
import { MutationState } from 'rx-model/states';
import { debounce } from 'rxjs/add/operator/debounce';
import { empty } from 'rxjs/observable/empty';
import { interval } from 'rxjs/observable/interval';

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
    whenForm: [],
    whenModel: [],
    debounce: FormConnect.TICK,
  };

  constructor(props, context) {
    super(props, context);

    const observable = props.form.getObservable();

    if (props.whenForm === true) {
      observable.whenForm();
    } else if (Array.isArray(props.whenForm) && props.whenForm.length) {
      observable.whenForm(props.whenForm);
    }

    if (props.whenModel === true) {
      observable.whenModel();
      observable.whenValidation();
    } else if (Array.isArray(props.whenModel) && props.whenModel.length) {
      observable.whenModel(props.whenModel);
      observable.whenValidation(props.whenModel);
    }

    if (props.debounce > 0) {
      this.subscription = observable
        .debounce((state) => {
          return state instanceof MutationState ? empty() : interval(props.debounce);
        })
        .subscribe(() => this.forceUpdate());
    } else {
      this.subscription = observable.subscribe(() => this.forceUpdate());
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  subscription;

  render() {
    return this.props.children(this.props.form);
  }
}
