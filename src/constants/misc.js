import { exchange as ExchangeConstants, items as ItemsConstants } from 'adex-constants'
const { BID_STATE, TIMEOUTS, SIGNATURE_MODE } = ExchangeConstants
const { AdTypes, AdSizes } = ItemsConstants

export const NO_IMAGE_URL = 'https://crestaproject.com/demo/nucleare-pro/wp-content/themes/nucleare-pro/images/no-image-box.png'
export const AVATAR_MAX_WIDTH = 600
export const AVATAR_MAX_HEIGHT = 400

export const SORT_PROPERTIES_BIDS = [
    { value: '_state', label: '' },
    { value: '_goal', label: '' },
    { value: '_tokenAmount', label: '' },
    { value: '_timeout', label: '' }
]

export const FILTER_PROPERTIES_BIDS = {
    _state: { label: '_state', labelIsProp: true, values: Object.keys(BID_STATE).map((key) => { return { value: BID_STATE[key].id, label: BID_STATE[key].label } }) },
    _timeout: { label: '_timeout', labelIsProp: true, values: TIMEOUTS }
}

export const FILTER_PROPERTIES_BIDS_NO_STATE = {
    _timeout: FILTER_PROPERTIES_BIDS._timeout
}

export const SORT_PROPERTIES_ITEMS = [
    { value: 'fullName' },
    { value: 'createdOn' },
    { value: 'size' },
    { value: 'adType' },
]

export const SORT_PROPERTIES_COLLECTION = [
    { value: 'fullName' },
    { value: 'createdOn' }
]

export const FILTER_PROPERTIES_ITEMS = {
    '_meta.adType': { label: 'adType', labelIsProp: true, values: AdTypes },
    '_meta.size': { label: 'size', labelIsProp: true, values: AdSizes }
}

export const AUTH_TYPES = {
    METAMASK: { name: 'metamask', signType: SIGNATURE_MODE.GETH.id },
    TREZOR: { name: 'trezor', signType: SIGNATURE_MODE.TREZOR.id },
    LEDGER: { name: 'ledger', signType: SIGNATURE_MODE.GETH.id },
    DEMO: { name: 'demo', signType: SIGNATURE_MODE.GETH.id }
}