import { PublicKey } from "@solana/web3.js"

import "@/style/components/usr/domainmanage.css"
import { useRootDomain } from "../rootenvironment/rootenvironmentprovider"
import { useEffect, useState } from "react";
import { Record as Records } from "@/utils/record/record";


interface domainManegeProps {
    usrDomain: string[],
    activeRootDomainkey: PublicKey | null,
}



const DomainManage: React.FC<domainManegeProps> = ({ usrDomain, activeRootDomainkey}) => {

    const {activeRootDomain} = useRootDomain();

    const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialExpandedState = usrDomain.reduce((acc, domain) => {
          acc[domain] = false;
          return acc;
        }, {} as Record<string, boolean>);
        
        setExpandedDomains(initialExpandedState);
      }, [usrDomain]);
    
    const manageDesignatedDoamin = (domain: string) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain] 
        }))
    }

    const [domainRecords, setDomainRecords] = useState<Partial<Record<Records, PublicKey | null>>>({});
    const [reachableRecords, setReachableRecords] = useState<Partial<Record<Records, PublicKey>> | null>(null);

    const updateRecord = (type: Records, pubkey: PublicKey | null) => {
        setDomainRecords(prev => ({
          ...prev,
          [type]: pubkey
        }));
    };

    const getUsrRecords = async() => {}

    

    return (
        <div className="domainManage">
            {usrDomain.map((domain) => (
                <div key={domain} className="domain">
                    <div className="domainBlock">
                        <h1 style={{marginLeft:'13px', fontSize:'30px', fontWeight:'600'}}>{domain}.{activeRootDomain}</h1>
                        <button style={{fontWeight:'500', marginRight:'20px'}} onClick={() => manageDesignatedDoamin(domain)}>Manage</button>
                    </div>
                    {expandedDomains[domain] &&
                    <div className="recordBlock">
                        <div style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <h1 style={{fontSize: '21px', marginTop: '10px', fontWeight: '600'}}>Domain Records</h1>
                            <button className="addbutton">add</button>
                        </div>
                        <hr className="divider" />
                        <div className="recordshow" style={{margin: '10px 0'}}>
                            <h1 style={{fontSize: '16px', fontWeight: '600', color: 'white'}}>No Records</h1>
                        </div>
                        <hr className="divider" />
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button className="addbutton close" onClick={() => manageDesignatedDoamin(domain)}>Close</button>
                        </div>
                    </div>
                    }
                </div>
                
            ))}
        </div>
    )
}

export default DomainManage;