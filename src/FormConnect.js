import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'rx-form'

export default class FormConnect extends PureComponent {
    static propTypes = {
        form: PropTypes.instanceOf(Form).isRequired,
        children: PropTypes.func.isRequired
    };

    subscription;

    constructor(props, context) {
        super(props, context);

        this.track = this.track.bind(this);

        this.subscription = this.props.form.subscribe(this.track);
    }

    track(state) {
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return this.props.children(this.props.form);
    }
}