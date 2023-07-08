import { useNetwork, useSigner } from "wagmi";
import { chainObj } from '../constants/Constants';
import { useAlert, positions } from 'react-alert';
import { ethers } from "ethers";
import bridgeabi from "../abis/bridgeabi.json";

function Mint() {

    const alert = useAlert()
    
    const { chain } = useNetwork();
    const { data: signer } = useSigner()

    async function mintNFT() {
        try {
            const mintContract = new ethers.Contract(chainObj[chain.id].bridgeContract, bridgeabi, signer);
            const txn = await mintContract.initiateMint();
            alert.success(
                <div>
                    <div>Transaction Sent</div>
                    <button className='text-xs' onClick={()=> window.open(chainObj[chain.id].explorer + txn.hash, "_blank")}>View on explorer</button>
                </div>, {
                timeout: 10000,
                position: positions.BOTTOM_RIGHT
            });
        } catch (ex) {
            alert.error(<div>Operation failed</div>, {
                timeout: 6000,
                position: positions.BOTTOM_RIGHT
            });
        }
    }


    return (
        <div className="w-full h-[710px]">
            <img className="fixed -z-10 h-[710px]" src="https://karafuru.io/_next/static/images/bg-main-cover-efff783742a3512c2a40db074b6971e0.jpg" />
            {
                chain.id === 5 ?
                <div className="h-full flex items-end justify-center">
                    <button onClick={() => mintNFT()} className="bg-black text-white p-4 px-6 rounded font-bold mb-10 text-xl">
                        Mint
                    </button>
                </div> :
                <div className="h-full flex items-end justify-center">
                    <div className="bg-black text-white p-4 rounded font-bold mb-10 text-xl">
                        !! Minting Only Available In Ethereum Goerli !!
                    </div>
                </div>
            }
        </div>
    )
}
export default Mint;