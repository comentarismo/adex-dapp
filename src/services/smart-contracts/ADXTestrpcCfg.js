/* NOTE: Localhost config - works wit EthereumJS TestRPC v4.1.3 (ganache-core: 1.1.3)
 * sudo npm install -g ethereumjs-testrpc@4.1.3
 * adex-core yarn test (just exchange) (created contracts 2-token, 3-registry, 4-exchange)
 * acc (0) - 100ETH, 100 000 000 ADX
*/
// ropsten
export const testrpcCfg = {
    node: 'https://ropsten.infura.io/TFyhO35Dd1LC2OVKanBJ',
    addr: {
        token: '0x58FAE82444eD771a1D0c1c3285c488d716ef3842',
        exchange: '0x1280949d248d1Ef49899709E0dbCffdcbc36e2e8',
    }
}