/**
 *
 * Form
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Model, Form } from 'rx-form';

class FormComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      form: new Form({
        model: props.model,
      }),
    };
  }

  componentWillReceiveProps(next) {
    if (next.model !== this.props.model) {
      this.cleanup();

      this.setState({ form: new Form({ model: next.model }) });
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  // eslint-disable-next-line class-methods-use-this
  cleanup() {
    // todo destroy form
  }

  render() {
    const { render } = this.props;

    return render(this.state.form);
  }
}

FormComponent.propTypes = {
  render: PropTypes.func.isRequired,
  model: PropTypes.instanceOf(Model).isRequired,
};

export default FormComponent;
