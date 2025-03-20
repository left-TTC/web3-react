import "../../style/components/domainIntroduce.css";
import { calculateDomainPrice } from "../../utils/aboutquery";
import { Buffer } from "buffer";
import { AccountInfo } from "@solana/web3.js";


interface introduceProps {
    domainName: string;
    domainInfo: AccountInfo<Buffer> | null;
}

const Showdomain: React.FC<introduceProps> = ({ domainName, domainInfo }) => {
    let leftContent;
    let rightContent;

    const price = calculateDomainPrice(domainName);
    const showDomainName = completeName(domainName);

    //means domain is available
    if (domainInfo === null){
        leftContent = 
            <div className="RightBox">
                <div className="okBox">
                    <div className="avaBox">
                        <h1>Available domain</h1>
                    </div>
                    <button className="starBox">
                        
                    </button>
                </div>
                <h2>{showDomainName}</h2>
                <h3>{price} USDC</h3>
                <div className="buyBox">
                    <button className="dir">
                        <h1>buy now</h1>
                    </button>
                    <button className="wait">
                        <h1>add to cart</h1>
                    </button>
                </div>
            </div>
        rightContent = 
            <div className="LeftBox">

            </div>
    }else{
        leftContent = 
            <div className="RightBox">

            </div>
        rightContent = 
            <div className="LeftBox">

            </div>
    }


    return(
        <div className="domainShowShell">
            {leftContent}
            {rightContent}
        </div>
    )
}

export default Showdomain;

function completeName(domain: string){
    if(domain.includes(".")){
        return domain
    }else{
        return (domain + ".web3")
    }
}