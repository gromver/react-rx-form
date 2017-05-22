import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'rx-form'

export default class FormConnect extends PureComponent {
    static propTypes = {
        form: PropTypes.instanceOf(Form).isRequired,
        children: PropTypes.func.isRequired,
        whenChanged: PropTypes.arrayOf(PropTypes.string),
        whenValid: PropTypes.arrayOf(PropTypes.string),
        whenSuccess: PropTypes.arrayOf(PropTypes.string),
        whenWarning: PropTypes.arrayOf(PropTypes.string),
        whenPending: PropTypes.arrayOf(PropTypes.string),
        whenError: PropTypes.arrayOf(PropTypes.string),
    };

    subscription;

    constructor(props, context) {
        super(props, context);

        this.forceUpdate = this.forceUpdate.bind(this);

        this.subscription = props.form.getObservable();

        if (props.whenChanged) {
            this.subscription.whenChanged(props.whenChanged);
        }

        if (props.whenValid) {
            this.subscription.whenChanged(props.whenValid);
            this.subscription.whenValid(props.whenValid);
        }

        if (props.whenSuccess) {
            this.subscription.whenChanged(props.whenSuccess);
            this.subscription.whenSuccess(props.whenSuccess);
        }

        if (props.whenWarning) {
            this.subscription.whenChanged(props.whenWarning);
            this.subscription.whenWarning(props.whenWarning);
        }

        if (props.whenPending) {
            this.subscription.whenChanged(props.whenPending);
            this.subscription.whenPending(props.whenPending);
        }

        if (props.whenError) {
            this.subscription.whenChanged(props.whenError);
            this.subscription.whenError(props.whenError);
        }

        this.subscription.subscribe(this.forceUpdate);
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return this.props.children(this.props.form);
    }
}