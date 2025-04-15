import AuctionDomains from "@/components/auction/auctiondomains"
import "../style/pages/auction.css"
import AuctionCreateRoot from "@/components/auction/auctioncreateroot";
import FundingRootInfo from "@/components/auction/auctionrootfunding";



export default function Auctionpage(){



    return(
        <div className="Auctionpage">
            <AuctionDomains />  
            <FundingRootInfo />
            <AuctionCreateRoot />
        </div>
    )
}