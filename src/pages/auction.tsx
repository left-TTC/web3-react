import AuctionDomains from "@/components/auction/auctiondomains"
import "../style/pages/auction.css"
import { AuctionCreateRoot } from "@/components/auction/auctioncreateroot"



export default function Auctionpage(){



    return(
        <div className="Auctionpage">
            <AuctionDomains />  
            <AuctionCreateRoot />
        </div>
    )
}