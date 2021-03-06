import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import MaterialStepper from 'components/dashboard/forms/stepper/MaterialUiStepper'
import ValidItemHoc from 'components/dashboard/forms/ValidItemHoc'
import Translate from 'components/translate/Translate'

class FormSteps extends Component {

    render() {
        let pages = []
        const { SaveBtn, CancelBtn, t, onSave, stepsId, stepsPages, stepsPreviewPage, validateIdBase, ...rest } = this.props
        const cancelButton = () => <CancelBtn  {...rest} stepsId={stepsId} onSave={onSave} t={t} />
        const validateId = (validateIdBase || '') + '-' + stepsId

        stepsPages.map((page, index) => {
            pages.push({
                title: t(page.title),
                cancelBtn: cancelButton,
                component: ValidItemHoc(page.page || page),
                props: { ...this.props, validateId: validateId + '-' + index }
            })
        })

        pages.push({
            title: t(stepsPreviewPage.title || 'PREVIEW'),
            completeBtn: () => <SaveBtn {...rest} stepsId={stepsId} onSave={onSave} t={t} />,
            cancelBtn: cancelButton,
            component: ValidItemHoc(stepsPreviewPage.page || stepsPreviewPage),
            props: { ...this.props, validateId: validateId + '-' + stepsPages.length }
        })

        return (
            // <div style={{ textAlign: 'left' }}>
                <MaterialStepper pages={pages} />
            // </div>
        )
    }
}

FormSteps.propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    title: PropTypes.string,
    itemPages: PropTypes.arrayOf(PropTypes.func),
    stepsId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

function mapStateToProps(state, props) {
    const persist = state.persist
    // const memory = state.memory
    return {
        account: persist.account,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Translate(FormSteps))