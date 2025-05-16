import { PublicKey } from "@solana/web3.js"

import "@/style/components/usr/domainmanage.css"
import { useRootDomain } from "../rootenvironment/rootenvironmentprovider"
import { useEffect, useState } from "react";
import { RecordResult, Record as Records } from "@/utils/record/record";
import { getDomainRecords } from "@/utils/record/getUsrRecord";
import { useConnection } from "@solana/wallet-adapter-react";


interface domainManegeProps {
    usrDomain: string[],
    activeRootDomainkey: PublicKey | null,
    clickOpenRecordsModal: (domain: string) => void,
}

const DomainManage: React.FC<domainManegeProps> = ({ usrDomain, activeRootDomainkey, clickOpenRecordsModal }) => {

    const {activeRootDomain} = useRootDomain();
    const {connection} = useConnection();

    const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialExpandedState = usrDomain.reduce((acc, domain) => {
          acc[domain] = false;
          return acc;
        }, {} as Record<string, boolean>);
        
        setExpandedDomains(initialExpandedState);
      }, [usrDomain]);

    const [domainRecordResults, setDomainRecordResult] = useState<Partial<Record<string, (RecordResult | undefined)[]>>>({})

    const updateRecords = (domain: string, queryRecordsResult: (RecordResult | undefined)[]) => {
        setDomainRecordResult(prev => ({
            ...prev,
            [domain]: queryRecordsResult
          }));
    };

    const getUsrRecords = async(queryingDomain: string) => {
        console.log("get records")
        if (!activeRootDomainkey)return
        const queryingResult =  await getDomainRecords(connection, queryingDomain, Object.values(Records), activeRootDomainkey);
        console.log("the records result:", queryingResult)
        if (!queryingResult)return
        updateRecords(queryingDomain, queryingResult)
    }

    const manageDesignatedDoamin = (domain: string) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain] 
        }))
        if (!domainRecordResults[domain] || !domainRecordResults[domain]?.some(item => item !== undefined)){
            getUsrRecords(domain)
        }
    }

    const createAnrecords = async(domain: string) => {
        console.log("create name:", domain)
        clickOpenRecordsModal(domain)
    }

    const showMapResult = (results: (RecordResult | undefined)[] = []) => {
        const filteredResults = results.filter(
          (item): item is RecordResult => item !== undefined
        );
      
        return filteredResults.map((result, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>{String(result.record)}</h1>
            <h2>{String(result.deserializedContent)}</h2>
          </div>
        ));
      };

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
                            <button className="addbutton" onClick={() => createAnrecords(domain)}>add</button>
                        </div>
                        <hr className="divider" />
                        <div className="recordshow" style={{margin: '10px 0'}}>
                            {domainRecordResults[domain]?.some(item => item !== undefined)? (
                                showMapResult(domainRecordResults[domain])
                            ) : (
                                <h1 style={{fontSize: '16px', fontWeight: '600', color: 'white'}}>No Records</h1>
                            )} 
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