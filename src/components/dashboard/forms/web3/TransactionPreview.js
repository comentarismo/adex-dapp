import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import NewTransactionHoc from './TransactionHoc'
import Tooltip from '@material-ui/core/Tooltip'
import ErrorIcon from '@material-ui/icons/Error'
import WarningIcon from '@material-ui/icons/Warning'
import { DEFAULT_GAS_PRICE } from 'services/smart-contracts/constants'
import { web3Utils } from 'services/smart-contracts/ADX'
import GasPrice from 'components/dashboard/account/GasPrice'
import { WalletAction } from 'components/dashboard/forms/FormsCommon'
import { PropRow, ContentBox, ContentBody, ContentStickyTop, FullContentSpinner } from 'components/common/dialog/content'
import Helper from 'helpers/miscHelpers'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

class TransactionPreview extends Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            gas: null,
            errors: []
        }
    }

    componentWillMount() {
        if (this.props.estimateGasFn && Object.keys(this.props.transaction).length) {

            this.props.actions.updateSpinner(this.props.trId, true)
            this.props.estimateGasFn({ acc: this.props.account, transaction: this.props.transaction })
                .then((estimatedGas) => {
                    this.setState({ gas: estimatedGas })
                    this.props.handleChange('gas', estimatedGas)
                    this.props.actions.updateSpinner(this.props.trId, false)
                })
                .catch((err) => {
                    console.log(err)
                    this.props.actions.updateSpinner(this.props.trId, false)
                    this.props.handleChange('errors', [Helper.getErrMsg(err)])
                })
        }
    }

    gasRow = ({ gas, gasPrice }) => {
        let eGas = gas.gas ? gas.gas : gas
        let fee = web3Utils.fromWei((eGas * parseInt(gasPrice, 10)).toString(), 'ether')
        return (
            <PropRow
                left={
                    <Tooltip
                        title={this.props.t('OPERATION_FEE_TOOLTIP')}
                    >
                        <strong>{this.props.t(gas.trMethod || 'OPERATION_FEE')}</strong>
                    </Tooltip>
                }
                right={<strong>{fee} ETH</strong>}
            />
        )
    }

    gasInfo = ({ gasPrice }) => {
        if (!this.state.gas) return null

        if (Array.isArray(this.state.gas)) {
            return (
                <div>
                    {this.state.gas.map((gas, index) =>
                        <this.gasRow key={index} gas={gas} gasPrice={gasPrice} />
                    )}
                </div>
            )
        } else {
            return (<this.gasRow gas={this.state.gas} gasPrice={gasPrice} />)
        }
    }

    render() {
        const { transaction = {}, t, classes, account, previewWarnMsgs, spinner } = this.props
        const gasPrice = account._settings.gasPrice ? account._settings.gasPrice : DEFAULT_GAS_PRICE
        const errors = transaction.errors || []
        return (
            <div>
                {spinner ?
                    <FullContentSpinner />
                    :
                    <ContentBox>
                        {transaction.waitingForWalletAction ?
                            <ContentStickyTop>
                                <WalletAction t={t} authType={account._authType} />
                            </ContentStickyTop> : null}
                        <ContentBody>
                            {errors.length ?
                                errors.map((err, index) =>
                                    <PropRow
                                        key={index}
                                        classNameLeft={classes.error}
                                        classNameRight={classes.error}
                                        left={<ErrorIcon />}
                                        right={err}
                                    />)
                                : null}

                            {previewWarnMsgs ?
                                previewWarnMsgs.map((msg, index) =>
                                    <PropRow
                                        key={index}
                                        classNameLeft={classes.warning}
                                        classNameRight={classes.warning}
                                        left={<WarningIcon />}
                                        right={t(msg.msg, { args: msg.args })}
                                    />
                                )
                                : null}

                            {!errors.length ?
                                <PropRow
                                    right={<GasPrice disabled={!!transaction.waitingForWalletAction} />}
                                /> : null}

                            <this.gasInfo gasPrice={gasPrice} />

                            {
                                Object
                                    .keys(transaction)
                                    .filter((key) => !/gas|account|waitingForWalletAction|isValidConversion|conversionWarningMsg|conversionCheckMsg/.test(key))
                                    .map(key => {
                                        let keyName = key
                                        let value = transaction[key]
                                        let isObjValue = (typeof value === 'object')
                                        if (isObjValue) {
                                            value = JSON.stringify(value, null, 2)
                                        }

                                        return (
                                            <PropRow
                                                key={key}
                                                left={t(keyName, { isProp: true })}
                                                right={isObjValue ?
                                                    <pre style={{ overflowX: 'auto' }}>
                                                        {(value || '').toString()}
                                                    </pre>
                                                    :
                                                    (value || '').toString()
                                                }
                                            />
                                        )
                                    })
                            }
                        </ContentBody>
                    </ContentBox>
                }
            </div>
        )
    }
}

TransactionPreview.propTypes = {
    actions: PropTypes.object.isRequired,
    label: PropTypes.string,
    trId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stepsId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    transaction: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    previewMsgs: PropTypes.array,
    estimateGasFn: PropTypes.func
}

function mapStateToProps(state, props) {
    const persist = state.persist
    const memory = state.memory
    const trId = props.stepsId
    return {
        transaction: memory.newTransactions[trId] || {},
        trId: trId,
        spinner: memory.spinners[trId],
        account: persist.account
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

const TransactionPreviewForm = NewTransactionHoc(TransactionPreview)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(TransactionPreviewForm))
