import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'rx-form'

export default class FieldConnect extends PureComponent {
    static propTypes = {
        form: PropTypes.instanceOf(Form).isRequired,
        children: PropTypes.func.isRequired,
        fields: PropTypes.any.isRequired,
    };

    subscription;
    fields;

    constructor(props, context) {
        super(props, context);

        this.track = this.track.bind(this);

        this.subscription = this.props.form.subscribe(this.track);

        if (this.props.fields) {
            this.fields = typeof this.props.fields === 'string' ? [ this.props.fields ] : this.props.fields;
        }
    }

    track(state) {
        if (this.fields) {
            if (this.fields.indexOf(state.attribute) !== -1) {
                this.forceUpdate();
            }
        } else {
            this.forceUpdate();
        }
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return this.props.children(this.props.form);
    }
}