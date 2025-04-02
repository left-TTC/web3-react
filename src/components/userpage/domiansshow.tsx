import React, { useContext } from "react";
import { ReactNode, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { fetchAccountIpfs, findUserInfo, getUserDomain } from "@/utils/user";
import { WEB3_NAME_SERVICE_ID } from "@/utils/aboutquery";

import copy from "../../assets/copy.png";
import revise from "../../assets/revise.png";

import "@/style/components/domainsshow.css"
import { useNameService } from "../program/name-service-provider";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { revisingDomainInfo } from "@/pages/user";

//the damain values
export interface DomainInfo {
    name: string,
    ipfs: string,
}

export interface DomainBlockProps {
    ownerKey: PublicKey | null,
    connection: Connection,
    onRevise: (domain: revisingDomainInfo) => void;
}


const DomainBlock: React.FC<DomainBlockProps> = ({ ownerKey, connection, onRevise }) => {
    const [userKey, setUsrKey] = useState(ownerKey);
    const [domains, setDomains] = useState<string[]>([]);
    const [roots, setRoots] = useState<string[]>(["web", "test"]);
    const [root, setRoot] = useState<string | null>(roots[1]);
    const [ifShowModal, setIfShowModal] = useState(false);

    const showRootChooser = () => {
        setIfShowModal(true)
    }

    const closeChooser = () => {
        setIfShowModal(false);
    }

    const selectRoot = (selectedRoot: string) => {
        setRoot(selectedRoot); 
        setIfShowModal(false);
      };

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
    }, [userKey, root]);


    const [ipfsData, setIpfsData] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        domains.forEach(async (domain) => {
            //show the loading animation
            setLoading(prev => ({ ...prev, [domain]: true }));
            try {
                if (userKey){
                    const ipfs = await fetchAccountIpfs(connection, domain, userKey);
                    setIpfsData(prev => ({ ...prev, [domain]: ipfs ?? null }));;
                }
            }catch(error) {
                console.error("Failed to fetch IPFS:", error);
                setIpfsData(prev => ({ ...prev, [domain]: "Error fetching IPFS" }));
            }finally{
                setLoading(prev => ({ ...prev, [domain]: false }));
            }
        })
    }, [domains])

    const rootChooser = (
        <div className="chooserbox">
            <button className="root-select" onClick={showRootChooser}>
                {root || "select a root"}
            </button>
        </div>
    )

    

    let domainShow;
    if (roots.length > 0) {
        domainShow = 
            <div className="domains-container">
                {domains.map((domain, index) => (
                    <div key={index} className="domain-item">
                        {root && <span className="domain-full">{domain}.{root}</span>}
                        <div className="ipfsbox">
                            <h1>ipfs:</h1>
                            <h2>
                                {loading[domain] ? (
                                    <div className="spinner"></div> 
                                ) : (
                                    ipfsData[domain] || "No data"
                                )}
                            </h2>
                            {ipfsData[domain] && root &&
                                <div className="twobutton">
                                    <CopyButton textToCopy={ipfsData[domain]}/>
                                    <button className="revise" onClick={() => onRevise({
                                        name: domain,
                                        root: root,
                                        ipfs: ipfsData[domain],
                                    })}>
                                        <img src={revise} width={25} />
                                    </button>  
                                </div>
                            }  
                        </div>
                    </div>
                ))}
                <div className="bottomspace"></div>
            </div>
    }else {
        domainShow = 
            <div className="no-domains">No ipfs found</div>
    }
        


    return(
        <div className="DomainsBlock">
            {rootChooser}
            {ifShowModal && 
            <div className="rootChooser">
                <div className="chooserContent">
                    <h2>Select a Root</h2>
                    <ul>
                        {roots.map((r, index) => (
                            <li key={index} onClick={() => selectRoot(r)}>
                                {r}
                            </li>
                        ))}
                    </ul>
                    <button onClick={closeChooser}>Close</button>
                </div>
            </div>}
            {domainShow}
        </div>
        
    );
}

export default DomainBlock;


const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 400); 
        } catch (err) {
            console.error("copy err:", err);
        }
    };

    return (
        <button className={`copy ${copied ? "copied" : ""}`} onClick={handleCopy}>
            <img src={copy} width={25} alt="Copy" />
        </button>
    );
};







