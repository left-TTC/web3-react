import Query from "@/components/querybar/query"
import Showdomain from "@/components/Introduce/domainIntroduce"
import { useLocation } from "react-router-dom"

import "../style/pages/search.css"

export default function Searchpage() {
    const location = useLocation();
    const { queryResult, queryValue } = location.state || {};

    return(
        <div className="toptab">
            <Query initValue={queryValue} />
            <Showdomain domainName={queryValue} domainInfo={queryResult} />
        </div>
    )
}