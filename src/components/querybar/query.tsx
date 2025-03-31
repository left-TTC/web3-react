import { useState, useEffect } from "react"
import { isCheckDomain, queryDomain, WEB3_NAME_SERVICE_ID, WEB3_ROOT} from "../../utils/aboutquery"
import { useNavigate } from "react-router-dom";

import "../../style/components/query.css"

interface QueryProps {
    initValue?: string; 
}

const Query = ({initValue}: QueryProps) => {
    const [queryValue, setQueryValue] = useState(initValue || "");
    const [domainClass, setDomainClass] = useState("");
    const navi = useNavigate();

    useEffect(() => {
        setQueryValue(queryValue); 
    }, [queryValue]);

    const clickToQuery = async() => {
        if(queryValue === ""){
            return; 
        }

        const domainArray = handleQueryDomain(queryValue)
        console.log("domain:", domainArray[0]);
        console.log("class:", domainArray[1]);

        let rootOpt;
        if (isCheckDomain()) {
            rootOpt = WEB3_ROOT;
        }else{
            rootOpt = null;
        }
        const queryResult = await queryDomain(
            domainArray[0], WEB3_NAME_SERVICE_ID, rootOpt
        );

        navi("/search", {
            state: {
                queryResult: queryResult,
                queryValue: queryValue,
            }
        })

    };

    return (
        <div className="querybar">
            <input 
                className="leftinput"
                type="text"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                placeholder="let's do it!"
            />
            <button className="rightbutton" onClick={clickToQuery}>
                <h1>query</h1>
            </button>
        </div>
    );
}

export default Query;

function handleQueryDomain(input: string){
    const rawDomain = input;

    if (rawDomain.includes(".")){
        const [part1, part2] = rawDomain.split(".");
        return [part1,part2]
    }else{
        const defaultClass = "web3";
        return [rawDomain, defaultClass]
    }
}