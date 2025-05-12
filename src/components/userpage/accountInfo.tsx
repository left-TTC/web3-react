import { PublicKey } from "@solana/web3.js";


interface AccountInfoProps {
    wallet: PublicKey | null;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ wallet }) => {
    let showName = "..."
    if(wallet){
        const fullAddress = wallet.toBase58();

        const firstFour = fullAddress.substring(0, 4);
        const lastFour = fullAddress.substring(fullAddress.length - 4);

        showName = `${firstFour}...${lastFour}`
    }

    const switchAccount = () => {
        console.log("wait to code")
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '300px'}}>
            <h1 style={{
                fontSize: '48px', 
                color:'white', 
                fontWeight:'800',
            }}>{showName}</h1>
            <button style={{
                backgroundColor: 'white',
                height: '80px',
                width: '200px',
                borderRadius: '20px',
            }}>
                <h1 
                    style={{fontSize: '33px', fontWeight: '500', color: 'black'}}
                    onClick={() => switchAccount()}
                >Switch</h1>
            </button>
        </div>
    )
}

export default AccountInfo;
