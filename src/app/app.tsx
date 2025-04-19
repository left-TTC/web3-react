import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClusterProvider } from '../components/cluster/cluster-data-access'
import { SolanaProvider } from '../components/solana/solana-provider'
import { AppRoutes } from './app-routes'
import { ProgramContextProvider } from '@/components/program/program-provider'
import { RootDomainProvider } from '@/components/rootenvironment/rootenvironmentprovider'

//what is queryclient?
//manage all the cache of all query and change request
//provides a mechanism for interacting whth the backend for data
//Automatically cache the results of API requests to avoid repeated requests for the same data 
const client = new QueryClient()

//<ClusterProvider> and <SolanaProvider> are the react context providers
export function App() {
  return (
    <QueryClientProvider client={client}>
      <ClusterProvider>
        <SolanaProvider>
          <ProgramContextProvider>
            <RootDomainProvider>
              <AppRoutes />
            </RootDomainProvider>
          </ProgramContextProvider>
        </SolanaProvider>
      </ClusterProvider>
    </QueryClientProvider>
  )
}
