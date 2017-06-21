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

    this.connect(props);
  }

  componentWillReceiveProps(nextProps) {
    // todo: track changes for all props
    if (this.props.form !== nextProps.form) {
      this.connect(nextProps);
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  subscription;

  connect({ form, whenForm, whenModel, debounce: delay }) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const observable = form.getObservable();

    if (whenForm === true) {
      observable.whenForm();
    } else if (Array.isArray(whenForm) && whenForm.length) {
      observable.whenForm(whenForm);
    }

    if (whenModel === true) {
      observable.whenModel();
      observable.whenValidation();
    } else if (Array.isArray(whenModel) && whenModel.length) {
      observable.whenModel(whenModel);
      observable.whenValidation(whenModel);
    }

    if (delay > 0) {
      this.subscription = observable
        .debounce((state) => {
          return state instanceof MutationState ? empty() : interval(delay);
        })
        .subscribe(() => this.forceUpdate());
    } else {
      this.subscription = observable.subscribe(() => this.forceUpdate());
    }
  }

  render() {
    return this.props.children(this.props.form);
  }
}
