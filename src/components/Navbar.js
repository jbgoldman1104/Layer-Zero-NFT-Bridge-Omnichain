import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="bg-[#F5F5F5] flex items-center justify-between w-full h-20 px-12 border-b border-black-600">
            <Link className="font-semibold text-xl text-black" to='/'>
                X Chain NFT Bridge
            </Link>
            <div className="space-x-40 text-black">
                <Link className="font-semibold text-md" to='/'>Mint</Link>
                <Link className="font-semibold text-md" to='/bridge'>Transfer</Link>
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar;