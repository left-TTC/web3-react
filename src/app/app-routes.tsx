import { UiLayout } from '@/components/ui/ui-layout'
import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import Test2page from '../pages/test2'

//Load on demand
// const AccountListFeature = lazy(() => import('../components/account/account-list-feature'))
// const AccountDetailFeature = lazy(() => import('../components/account/account-detail-feature'))
// const ClusterFeature = lazy(() => import('../components/cluster/cluster-feature'))
const Homepage = lazy(() => import('../pages/index')) 
const Searchpage = lazy(() => import('../pages/search'))
const Userpage = lazy(() => import('../pages/user'))
const Auctionpage = lazy(() => import('../pages/auction'))
const TestPage = lazy(() => import('../pages/test2'))

//links lib
const links: { label: string; path: string }[] = [
  // { label: 'Account', path: '/account' },
  // { label: 'Clusters', path: '/clusters' },
  {label: 'Main', path: '/index'},
  {label: 'Home', path: '/user'},
  {label: 'Auction', path: '/auction'},
  {label: 'Test', path: '/test'}
]

//route reflect
const routes: RouteObject[] = [
  // { path: '/account/', element: <AccountListFeature /> },
  // { path: '/account/:address', element: <AccountDetailFeature /> },
  // { path: '/clusters', element: <ClusterFeature /> },
  { path: '/index', element: <Homepage /> },
  { path: '/search', element: <Searchpage />},
  { path: '/user', element: <Userpage />},
  { path: '/auction', element: <Auctionpage />},
  { path: '/test', element: <Test2page />}
]

export function AppRoutes() {
  return (
    <UiLayout links={links}>
      {useRoutes([
        {/**index: true means it's default page */},
        { index: true, element: <Navigate to={'/index'} replace={true} /> },
        ...routes,
        {/** "*" means when user navigate to a unfound path */},
        { path: '*', element: <Navigate to={'/index'} replace={true} /> },
      ])}
    </UiLayout>
  )
}
