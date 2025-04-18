import { useState } from 'react'
import { AppHero } from '../ui/ui-layout'
import { ClusterUiModal, ClusterUiTable } from './cluster-ui'

export default function ClusterFeature() {
  //Decide whether to display the UI
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <AppHero title="Clusters" subtitle="Manage and select your Solana clusters">
        <ClusterUiModal show={showModal} hideModal={() => setShowModal(false)} />
        <button className="btn btn-xs lg:btn-md btn-primary" onClick={() => setShowModal(true)}>
          Add Cluster
        </button>
      </AppHero>
      <ClusterUiTable />
    </div>
  )
}
