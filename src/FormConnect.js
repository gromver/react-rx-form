import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'rx-form'

export default class FormConnect extends PureComponent {
    static propTypes = {
        form: PropTypes.instanceOf(Form).isRequired,
        children: PropTypes.func.isRequired,
        when: PropTypes.arrayOf(PropTypes.string),
    };

    subscription;

    constructor(props, context) {
        super(props, context);

        this.subscription = props.form.getObservable();

        if (props.when) {
            this.subscription.when(props.when);
        }

        this.subscription.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return this.props.children(this.props.form);
    }
}