

import React, { Component } from 'react'
import { Button } from 'react-toolbox/lib/button'
// import ProgressBar from 'react-toolbox/lib/progress_bar'
// import theme from './theme.css'
import Dialog from 'react-toolbox/lib/dialog'
import Input from 'react-toolbox/lib/input'
import Base from './../../../models/Base'

export default function NewItemHoc(Decorated) {
    return class ItemForm extends Component {
        constructor(props) {
            super(props)

            this.save = this.save.bind(this);

            this.state = {
                active: false,
                item: {}
            };
        }

        componentWillReceiveProps(nextProps) {
            this.setState({ item: nextProps.newItem })
        }

        componentWillMount() {
            this.setState({ item: this.props.newItem })
        }

        componentWillUnmount() {
            this.props.actions.updateNewItem(this.state.item, this.state.item._meta)
        }

        handleToggle = () => {
            let active = this.state.active
            this.setState({ active: !active })

            if (active) {
                this.props.actions.updateNewItem(this.state.item, this.state.item._meta)
            }
        }

        handleChange = (name, value) => {
            let newItem = Base.updateMeta(this.state.item, { [name]: value })
            this.setState({ item: newItem })
        }

        save() {
            this.props.actions.addItem(this.state.item)
            this.handleToggle()
            this.props.actions.resetNewItem(this.state.item)
        }

        render() {

            let item = this.state.item
            item._meta = item._meta || {}

            return (
                <div>
                    <Button icon='add' label={this.props.btnLabel} onClick={this.handleToggle} primary={this.props.primary} raised={this.props.raised} accent={this.props.accent} flat={this.props.flat} />
                    <Dialog
                        active={this.state.active}
                        onEscKeyDown={this.handleToggle}
                        onOverlayClick={this.handleToggle}
                        title={this.props.title}
                    >
                        <section>
                            <Input type='text' label='Name' name='name' value={item._meta.fullName} onChange={this.handleChange.bind(this, 'fullName')} maxLength={128} />
                            <Input type='text' label='Image url' name='img' value={item._meta.img} onChange={this.handleChange.bind(this, 'img')} maxLength={1024} />
                            <Input type='text' multiline rows={5} label='Description' name='desctiption' value={item._meta.description} onChange={this.handleChange.bind(this, 'description')} maxLength={1024} />
                            <Decorated {...this.props} save={this.save} handleChange={this.handleChange} />
                            <br />
                            <Button icon='save' label='Save' raised primary onClick={this.save} />
                        </section>
                    </Dialog>
                </div>
            )
        }
    }
}