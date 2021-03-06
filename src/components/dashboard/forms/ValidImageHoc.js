import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import Translate from 'components/translate/Translate'

export default function ValidImageHoc(Decorated) {

    class ValidImage extends Component {
        /* TODO: Make it not depend on NewItemHoc (props.handleChange)
        * Now NewItemHoc mus be add before this
        * Add here initial validation
        * */
        validateImg = ({propsName, widthTarget, heightTarget, msg, exact, required, onChange} = {}, img) => {
            if (!required && !img.tempUrl && this.props.handleChange) {
                this.props.validate(propsName, { isValid: true, err: { msg: msg, args: [] }, dirty: true })
                // TODO: fix this
                this.props.handleChange(propsName, img)
                return
            }
            let image = new Image()
            image.src = img.tempUrl
            let that = this

            image.onload = function () {
                let width = this.width
                let height = this.height

                let isValid = true
                let masgArgs = []

                if (exact && (widthTarget !== width || heightTarget !== height)) {
                    isValid = false

                }
                if (!exact && (widthTarget < width || heightTarget < height)) {
                    isValid = false
                }

                masgArgs = [widthTarget, heightTarget, 'px']

                that.props.validate(propsName, { isValid: isValid, err: { msg: msg, args: masgArgs }, dirty: true })
                img.width = width
                img.height = height
                // TODO: temp fix make this HOC independent
                if(typeof that.props.handleChange === 'function') {
                    that.props.handleChange(propsName, img)
                }else if(typeof that.handleChange === 'function') {
                    that.handleChange(propsName, img)
                }else if (typeof onChange === 'function') {
                    onChange(propsName, img)
                }
            }
        }

        render() {
            const props = this.props
            return (
                <Decorated {...props} validateImg={this.validateImg} />
            )
        }
    }

    ValidImage.propTypes = {
        actions: PropTypes.object.isRequired,
        validateId: PropTypes.string.isRequired
    }

    function mapStateToProps(state, props) {
        let memory = state.memory
        return {
            validations: memory.validations[props.validateId]
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(Translate(ValidImage))
}

