import React, { useContext } from "react";
import { ReactNode, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { findUserInfo, getUserDomain } from "@/utils/user";
import { WEB3_NAME_SERVICE_ID } from "@/utils/aboutquery";

import "@/style/components/domainsshow.css"

//the damain values
export interface DomainInfo {
    name: string,
    ipfs: string,
}

export interface DomainBlockProps {
    ownerKey: PublicKey | null,
    connection: Connection,
}


const DomainBlock: React.FC<DomainBlockProps> = ({ ownerKey, connection }) => {
    const [userKey, setUsrKey] = useState(ownerKey);
    const [domains, setDomains] = useState<string[]>([]);
    const [roots, setRoots] = useState<string[]>(["web", "test"]);
    const [root, setRoot] = useState<string | null>(roots[1]);

    useEffect(() => {
        const fetchData = async () => { 
            if (ownerKey && connection) {
                setUsrKey(ownerKey);
                try {
                    const userInfo = await findUserInfo(ownerKey, WEB3_NAME_SERVICE_ID, null, connection);
                    if(userInfo && userKey){
                        setDomains(getUserDomain(userInfo?.data, userKey));
                    }else{
                        throw new Error("fetch domain err")
                    } 
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
        };

        fetchData();
    }, [ownerKey, connection]);

    const rootChooser = (
        <div className="chooserbox">
            <select
                id="root-select"
                value={root || ""}
                onChange={(e) => setRoot(e.target.value)}
            >
                <option value="" disabled>{root}</option>
                {roots.map((r, index) => (
                    <option key={index} value={r}>
                        {r}
                    </option>
                ))}
            </select>
        </div>
    )

    let domainShow;
    if (roots.length > 0) {
        console.log("domains:",domains);
        domainShow = 
            <div className="domains-container">
                {domains.map((domain, index) => (
                    <div key={index} className="domain-item">
                        {root && <span className="domain-full">{domain}.{root}</span>}
                        <div className="ipfsbox">
                            <h1>ipfs:</h1>
                        </div>
                    </div>
                ))}
            </div>
    }else {
        domainShow = 
            <div className="no-domains">No domains found</div>
    }
        


    return(
        <div className="DomainsBlock">
            {rootChooser}
            {domainShow}
        </div>
    );
}

export default DomainBlock;








