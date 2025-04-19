import { useState, useEffect } from "react"
import { getHashedName, getSeedAndKey, isCheckDomain, queryDomain, WEB3_NAME_SERVICE_ID, WEB3_ROOT} from "../../utils/aboutquery"
import { useNavigate } from "react-router-dom";

import "../../style/components/query.css"
import { useNameService } from "../program/name-service-provider";
import { useRootDomain } from "../rootenvironment/rootenvironmentprovider";

interface QueryProps {
    initValue?: string; 
}

const Query = ({initValue}: QueryProps) => {
    const [queryValue, setQueryValue] = useState(initValue || "");
    const {activeRootDomain} = useRootDomain();
    const [inputValue, setInputValue] = useState<string[]>(["", ""]);
    const navi = useNavigate();
    const {nameProgram} = useNameService();

    useEffect(() => {
        let newValue = inputValue[0] + inputValue[1];
        setQueryValue(newValue); 
    }, [inputValue]);

    const clickToQuery = async() => {
        if(queryValue === ""){
            return; 
        }

        const domainArray = handleQueryDomain(queryValue)
        console.log("domain:", domainArray[0]);
        console.log("class:", domainArray[1]);

        let rootOpt;
        if(activeRootDomain && nameProgram){
            if (domainArray[1] != activeRootDomain){
                console.log("not same, change environment");
            }
            const {nameAccountKey: a} = getSeedAndKey(
                nameProgram.programId, getHashedName(activeRootDomain), null
            );
            rootOpt = a 
        }else{
            throw new Error("no this root domain")
        }
        
        if (nameProgram){
            const queryResult = await queryDomain(
                domainArray[0], nameProgram.programId, rootOpt
            );
    
            navi("/search", {
                state: {
                    queryResult: queryResult,
                    queryValue: queryValue,
                }
            })
        }

    };

    const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const suffix = `.${activeRootDomain}`;

        const newLength = newValue.length;
        const lastLength = queryValue.length;

        let domainString;
        let suffixString = suffix

        if(newLength > lastLength){
            //input
            domainString = inputValue[0] + newValue.slice(-1);
        }else if(newLength < lastLength){
            //delete
            domainString = inputValue[0].slice(0,inputValue[0].length - 1);
            if(inputValue[0].length === 0){
                suffixString = "";
            }
        }else{
            domainString = inputValue[0];
        }

        setInputValue([domainString, suffixString])
    }

    

    return (
        <div className="querybar">
            <input 
                className="leftinput"
                type="text"
                value={queryValue}
                onChange={onHandleChange}
                placeholder="let's do it!"
                spellCheck="false"
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