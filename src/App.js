import React, {useCallback, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {SignerSubprovider, RPCSubprovider, Web3ProviderEngine, MetamaskSubprovider} from '@0x/subproviders';
import {Network, OpenSeaPort} from "opensea-js";
import {OrderSide} from "opensea-js/lib/types";

function App(props) {
    const [seaport, setSeaport] = useState()

    console.log(seaport)

    // Put your example asset here
    const assetToFetch = {
        tokenAddress: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
        tokenId: '75400578612941401867553379846229579034804046475075188611111958234060701040641',
    }

    const connect = async () => {
        const provider = await detectEthereumProvider();

        if (provider) {
            console.log(provider)

            // Create a Web3 Provider Engine
            const providerEngine = new Web3ProviderEngine();
            // Compose our Providers, order matters
            // Use the SignerSubprovider to wrap the browser extension wallet
            // All account based and signing requests will go through the SignerSubprovider
            providerEngine.addProvider(new MetamaskSubprovider(window.ethereum));
            // Use an RPC provider to route all other requests
            // providerEngine.addProvider(new RPCSubprovider('https://testnet.infura.io/v3/6fa6dd042a2144769583531cbf907cd5'));
            providerEngine.addProvider(new RPCSubprovider('https://rinkeby.infura.io/v3/6fa6dd042a2144769583531cbf907cd5'));
            providerEngine.start();

            console.log(providerEngine)

            const seaport = new OpenSeaPort(providerEngine, {
                networkName: Network.Main,
            })

            console.log(seaport)


            const asset = await seaport.api.getAsset(assetToFetch)

            console.log(asset)
            setSeaport(seaport)

            // Token ID and smart contract address for a non-fungible token:
            // const {tokenId, tokenAddress} = asset


            // The offerer's wallet address:
            // const accountAddress = '0x740BcfaEecb6d404269EEAed3E91B06c8413343e'
            //
            // const wethContractAddress = '0xc778417e063141139fce010982780140aa0cd5ab'; // WETH contract address on rinkeby
            //
            // const tokens = (await seaport.api.getPaymentTokens()).tokens;
            // console.log(tokens)


            // const offer = await seaport.createBuyOrder({
            //     asset: {
            //         tokenId,
            //         tokenAddress,
            //         // schemaName // WyvernSchemaName. If omitted, defaults to 'ERC721'. Other options include 'ERC20' and 'ERC1155'
            //     },
            //     accountAddress,
            //     // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            //     startAmount: 0.00000000000001,
            // })

            // This worked!!!
            // const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
            //
            // const listing = await seaport.createSellOrder({
            //     asset: {
            //         tokenId,
            //         tokenAddress,
            //     },
            //     accountAddress: '0xA6B3371390Ac27abE0bc8f23950695eCcE679592',
            //     startAmount: 3,
            //     // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
            //     endAmount: 0.1,
            //     expirationTime
            // })
            //
            //
            // console.log(listing)

        } else {
            console.log('Please install MetaMask!');
        }

    }

    const getOrderTry = async () => {

        console.log(seaport)

        const asset = await seaport.api.getAsset(assetToFetch)

        console.log(asset)

        // Token ID and smart contract address for a non-fungible token:
        const {tokenId, tokenAddress} = asset

        let order
        setTimeout(async () => {
            order = await seaport.api.getOrder(
                {
                    side: OrderSide.Sell,
                    asset_contract_address: tokenAddress,
                    token_id: tokenId
                })

            console.log(order)
        }, 1000)


        setTimeout(async () => {
            const accountAddress = "0xA6B3371390Ac27abE0bc8f23950695eCcE679592" // Put the buyer's address here, TODO: fetch from metamask extension
            try{
                const transactionHash = await seaport.fulfillOrder({order, accountAddress})
                console.log(transactionHash)
            }
            catch (e) {
                console.log(e)
            }
        }, 2000)


    }


    return (
        <div className="container bg-dark vh-100">
            <div className="text-center box-1">
                <div>
                    <button className="btn btn-outline-success"
                            onClick={connect}
                    >
                        Connect
                    </button>
                </div>
                <div>
                    <button className="btn btn-outline-success"
                            onClick={getOrderTry}
                    >
                        Get Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
