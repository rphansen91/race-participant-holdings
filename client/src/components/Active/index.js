import React, { Component } from "react";

const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()

export const withActive = Cmp => class extends Component {
    state={
        active: null
    }
    setActive = (active) => {
        this.setState({ active })
    }
    render = () => <Cmp active={this.state.active} setActive={this.setActive} {...this.props} />;
}

export const withDynamic = name => Cmp => class extends Component {
    state={
        [name]: null
    }

    setActive = value => {
        this.setState({ [name]: value });
    }

    render = () => {
        const props = {
            ["set" + capitalize(name)]: this.setActive
        }
        return <Cmp {...props} {...this.state} {...this.props} />
    }
}