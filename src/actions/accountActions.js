import * as types from 'constants/actionTypes'
import { addSig, getSig } from 'services/auth/auth'
import { getSession, checkSession } from 'services/adex-market/actions'
import { updateSpinner } from './uiActions'
import scActions from 'services/smart-contracts/actions'
import { getAuthSig } from 'services/smart-contracts/actions/ethers'
const { signAuthToken } = scActions

// MEMORY STORAGE
export function updateSignin(prop, value) {
	return function (dispatch) {
		return dispatch({
			type: types.UPDATE_SIGNIN,
			prop: prop,
			value: value
		})
	}
}

export function resetSignin() {
	return function (dispatch) {
		return dispatch({
			type: types.RESET_SIGNIN
		})
	}
}


// PERSISTENT STORAGE
export function createAccount(acc) {
	return function (dispatch) {
		return dispatch({
			type: types.CREATE_ACCOUNT,
			account: acc
		})
	}
}

// LOGOUT
export function resetAccount() {
	return function (dispatch) {
		return dispatch({
			type: types.RESET_ACCOUNT
		})
	}
}

export function updateAccount({ meta, newValues }) {
	return function (dispatch) {
		return dispatch({
			type: types.UPDATE_ACCOUNT,
			meta: meta,
			newValues: newValues,
		})
	}
}

export function updateGasData({ gasData }) {
	return function (dispatch) {
		return dispatch({
			type: types.UPDATE_GAS_DATA,
			gasData: gasData
		})
	}
}

export function createSession({ wallet, identity, email }) {
	return async function (dispatch) {
		updateSpinner('creating-session', true)(dispatch)

		// await new Promise(resolve => setTimeout(resolve, 5000))

		const newWallet = { ...wallet }
		const sessionSignature = getSig({
			addr: newWallet.address,
			mode: newWallet.authType
		}) || null

		const hasSession = !!sessionSignature
			&& (await checkSession({
				authSig: sessionSignature,
				skipErrToast: true
			}))

		if (hasSession) {
			newWallet.authSig = sessionSignature
		} else {
			const {
				signature,
				mode,
				authToken,
				hash,
				typedData
			} = await getAuthSig({ wallet: newWallet })

			const { status, expiryTime } = await getSession({
				identity: identity.address,
				mode: mode,
				signature: signature,
				authToken: authToken,
				hash,
				typedData,
				signerAddress: newWallet.address
			})

			if (status === 'OK') {
				addSig({
					addr: wallet.address,
					sig: signature,
					mode: wallet.authType,
					expiryTime: expiryTime
				})
				newWallet.authSig = signature
			}
		}

		updateAccount({
			newValues: {
				email: email,
				wallet: newWallet,
				identity: identity
			}
		})(dispatch)

		updateSpinner('creating-session', false)(dispatch)
	}
}
