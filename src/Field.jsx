/* eslint-disable class-methods-use-this */
/**
 *
 * Field
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'rx-form';
import Connect from './Connect';
import utils from './utils';

class FieldComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { form, name } = props;

    this.state = {
      form: this.createForm(form, name),
    };
  }

  componentWillReceiveProps(next) {
    if (
      next.form !== this.props.form
      || !utils.compareAttributes(this.props.name, next.name)
    ) {
      this.cleanup();

      this.setState({ form: this.createForm(next.form, next.name) });
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  createForm(form, name) {
    return new Form({
      model: form.getModel(),
      scope: [...form.getScope(), ...utils.normalizePath(name)],
    });
  }

  cleanup() {
    // const { form } = this.state;
    // todo destroy form
  }

  render() {
    const { render, depends } = this.props;
    const { form } = this.state;

    return (<Connect
      render={render}
      target={form}
      attributes={[form.getScope(), ...depends].map(utils.normalizePath)}
    />);
  }
}

FieldComponent.propTypes = {
  render: PropTypes.func.isRequired,
  form: PropTypes.instanceOf(Form).isRequired,
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  depends: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ])),
};

FieldComponent.defaultProps = {
  depends: [],
};

export default FieldComponent;
