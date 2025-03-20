import "@styles/pages/index.css"
import Query from "@/components/querybar/query"

export default function Homepage(){


    return(
        <div className="display">
            <div className="web3title">
                <h1>web3 domain in anywhere</h1>
                <h2>Anything is possible ,just do it!</h2>
            </div>
            <div className="querybox">
                <Query/>
            </div>
        </div>
    )
}