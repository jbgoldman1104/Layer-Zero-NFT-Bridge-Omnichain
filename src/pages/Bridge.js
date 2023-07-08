import { useNetwork, useAccount, useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import { useAlert, positions } from 'react-alert';
import { chainObj } from '../constants/Constants';
import { ethers } from "ethers";
import bridgeabi from "../abis/bridgeabi.json";

function Bridge() {

    const alert = useAlert()

    const { chain, chains } = useNetwork();
    const { isConnected, address } = useAccount();
    const [toChain, setToChain] = useState("Select");
    const [toChainId, setToChainId] = useState(0);
    const [toChainSelect, toggleToChainSelect] = useState(false);
    const [tokenId, setTokenId] = useState(0);
    const { data: signer } = useSigner()
 

    const sendTransaction = async () => {
        if(toChainId > 0 && tokenId > 0) {
            const mintContract = new ethers.Contract(chainObj[chain.id].bridgeContract, bridgeabi, signer);
            const approvedAddress = await mintContract.getApproved(tokenId);
            console.log(approvedAddress.toString());
            let txn;
            if(approvedAddress.toString().toUpperCase() !== chainObj[chain.id].bridgeContract.toString().toUpperCase()) {
                try {
                    txn = await mintContract.approve(chainObj[chain.id].bridgeContract, tokenId);
                    alert.success(
                        <div>
                            <div>Transaction Sent</div>
                            <button className='text-xs' onClick={()=> window.open(chainObj[chain.id].explorer + txn.hash, "_blank")}>View on explorer</button>
                        </div>, {
                        timeout: 10000,
                        position: positions.BOTTOM_RIGHT
                    });
                } catch(ex) {
                    console.log(ex);
                    alert.error(<div>Operation failed</div>, {
                        timeout: 6000,
                        position: positions.BOTTOM_RIGHT
                    });
                }
            } else {
                try{
                    const estimatedFee = await mintContract.estimateSendFee(chainObj[toChainId].domain, address, tokenId, false, []);
                    console.log(estimatedFee.nativeFee.toString());
                    txn = await mintContract.sendFrom(address, chainObj[toChainId].domain, address, tokenId, address, "0x0000000000000000000000000000000000000000", [],{ value: ethers.utils.parseUnits(estimatedFee.nativeFee.toString(), "wei") });
                    console.log(txn);
                    alert.success(
                        <div>
                            <div>Transaction Sent</div>
                            <button className='text-xs' onClick={()=> window.open(chainObj[chain.id].explorer + txn.hash, "_blank")}>View on explorer</button>
                        </div>, {
                        timeout: 0,
                        position: positions.BOTTOM_RIGHT
                    });
                } catch(ex) {
                    console.log(ex);
                    alert.error(<div>Operation failed</div>, {
                        timeout: 3000,
                        position: positions.TOP_RIGHT
                    });
                }
            }
        } else {
            alert.error(<div>Invalid input</div>, {
                timeout: 6000,
                position: positions.BOTTOM_RIGHT
            });
        }
    }

    return (
            <div className="flex flex-col flex-1 items-center justify-center h-[710px] bg-[#F5F5F5]">
            {
                isConnected && 
                <div className="flex flex-col justify-between rounded-lg font-semibold w-4/12 h-4/6 bg-white">
                    <div className="text-xl mx-4 mt-4">Transfer</div>
                    <div className="rounded-lg h-[130px] mx-6 p-2">
                        <div>
                            <div className='font-normal'>From</div>
                            <div className="flex flex-row items-center border rounded-lg my-2 px-2 bg-[#F5F5F5]">
                                <div className="flex-1 flex flex-col px-2 mx-2 border-r py-4">
                                    <div className='font-normal text-gray-400 text-xs'>
                                        NFT Id
                                    </div>
                                    <div>
                                        <input onChange={(e) => setTokenId(e.target.value)} className="bg-[#F5F5F5] placeholder:text-slate-400 block bg-white w-full py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="" type="number" name="toAmount"/> 
                                    </div>      
                                </div>
                                <div className="text-gray-700 flex items-center justify-center py-2 mx-2 rounded-lg">
                                    <div className=''>
                                        <div className='text-xs text-gray-400 font-normal'>Network</div>
                                        <div className='flex flex-row text-md items-center justify-center'> 
                                            <img src={chainObj[chain.id].image} className='w-8 h-4' />
                                            {chain?.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-2 flex items-center justify-center'><svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.984 12h-3l4 4 4-4h-3c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 11.984 4c-4.42 0-8 3.58-8 8Zm14 0c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.8-.7l-1.46 1.46a7.93 7.93 0 0 0 4.26 1.24c4.42 0 8-3.58 8-8h3l-4-4-4 4h3Z" fill="currentColor"></path></svg></div>
                    <div className="rounded-lg h-[130px] mx-6 px-2">
                        <div>
                            <div className='font-normal'>To</div>
                            { toChainSelect && 
                                <div className="absolute bg-white border mt-20 mx-2 w-96 text-gray-500">
                                    { 
                                        chains.filter((chainss) => chainss.id !== chain.id).map((chain) => <div onClick={() => {setToChain(chain.name); setToChainId(chain?.id); toggleToChainSelect(!toChainSelect)}} className="flex justify-center py-2 px-2 hover:bg-gray-100 hover:cursor-pointer">{chain.name}</div>)
                                    }
                                </div>
                            }
                            
                            <div className="mt-2 border rounded-lg bg-[#F5F5F5] flex flex-row items-center justify-center h-[80px] hover:cursor-pointer">
                                <div onClick={() => toggleToChainSelect(!toChainSelect)} className="text-gray-600 flex w-full items-center justify-center px-2 py-2 mx-2 rounded-lg">
                                    <div className='flex text-gray-500'>
                                        <div>{toChain} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => sendTransaction()} className="w-full text-xl rounded-b-lg text-white py-4 bg-black">Initiate</button>
                </div>
            }
            <div className='font-semibold mt-8 text-gray-500'>
                Powered By Layer Zero
            </div>
            </div>
    )
}
export default Bridge;