import { useEffect, useState } from "react";
import { useRootDomain } from "./rootenvironmentprovider";
import "@/style/pages/rootchooser.css"


export function RootDomainChooser(){
    const {rootDomains, activeRootDomain, setActiveRootDomain, refreshRootDomains, loading} = useRootDomain();
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [ifrefresh, setIfRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    

    
    if (loading){
        const clickShowChooseModal = () => {
            console.log("show choose modal");
            setShowChooseModal(true)
        }

        const clickCloseChooseModal = () => {
            setShowChooseModal(false)
        }

        const clinckToSerach = () => {

        }

        const filteredDomains = rootDomains.filter(domain =>
            domain.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, -1);
    

        return(
            <div className="dropdown-wrapper">
                <button className="load con" onClick={showChooseModal?  (clickCloseChooseModal) : (clickShowChooseModal)}>
                    <h2>Active:</h2>
                    <h1>{activeRootDomain}</h1>
                </button>
                {showChooseModal &&
                    <div className="chooseModal">
                        <div className="findroot">
                            <input 
                            className="findrootinput"
                            type="text" 
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="findrootbutton" onClick={clinckToSerach}>

                            </button>
                        </div>
                        <div className="domain-list">
                            {filteredDomains.length > 0 ? (
                                filteredDomains.map(domain => (
                                    <div 
                                        key={domain}
                                        className={`domain-item ${activeRootDomain === domain ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveRootDomain(domain);
                                            setShowChooseModal(false);
                                        }}
                                    >
                                        {domain}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '10px', color: '#666' }}>
                                    No domains found
                                </div>
                            )}
                        </div>
                        <button className = "closeButton" onClick={() => {setShowChooseModal(false)}}>
                            <h1>Close</h1>
                        </button>
                    </div>
                }
            </div>
        )
    }else{
        const clickToRefresh = () => {
            setIfRefresh(true);
            refreshRootDomains();
            setTimeout(() => {
                setIfRefresh(false);
            },3000)
        }

        return(
            <div className="dropdown-wrapper">
                <button className="load dis" onClick={clickToRefresh}>
                    {ifrefresh? (
                        <h2>refreshing</h2>
                    ):(
                        <h1>Connection lost</h1>
                    )}
                </button>
            </div>
        )
    }
}