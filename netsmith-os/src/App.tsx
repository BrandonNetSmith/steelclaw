import { useState } from 'react'
import TaskManager from './pages/TaskManager'
import OrgChart from './pages/OrgChart'
import Standup from './pages/Standup'
import Workspaces from './pages/Workspaces'
import Docs from './pages/Docs'
import Health from './pages/Health'
import BrainStub from './pages/BrainStub'
import LabStub from './pages/LabStub'
import SettingsStub from './pages/SettingsStub'

type Module = 'ops' | 'brain' | 'lab' | 'settings'
type OpsTab = 'task-manager' | 'org-chart' | 'standup' | 'workspaces' | 'docs' | 'health'

function App() {
  const [activeModule, setActiveModule] = useState<Module>('ops')
  const [activeOpsTab, setActiveOpsTab] = useState<OpsTab>('task-manager')

  const renderOpsContent = () => {
    switch (activeOpsTab) {
      case 'task-manager':
        return <TaskManager />
      case 'org-chart':
        return <OrgChart />
      case 'standup':
        return <Standup />
      case 'workspaces':
        return <Workspaces />
      case 'docs':
        return <Docs />
      case 'health':
        return <Health />
      default:
        return <TaskManager />
    }
  }

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'ops':
        return (
          <>
            <nav className="top-nav">
              <button
                className={`top-nav-btn ${activeOpsTab === 'task-manager' ? 'active' : ''}`}
                onClick={() => setActiveOpsTab('task-manager')}
              >
                Task Manager
              </button>
              <button
                className={`top-nav-btn ${activeOpsTab === 'org-chart' ? 'active' : ''}`}
                onClick={() => setActiveOpsTab('org-chart')}
              >
                Org Chart
              </button>
              <button
                className={`top-nav-btn ${activeOpsTab === 'standup' ? 'active' : ''}`}
                onClick={() => setActiveOpsTab('standup')}
              >
                Standup
              </button>
              <button
                className={`top-nav-btn ${activeOpsTab === 'workspaces' ? 'active' : ''}`}
                onClick={() => setActiveOpsTab('workspaces')}
              >
                Workspaces
              </button>
              <button
                className={`top-nav-btn ${activeOpsTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveOpsTab('docs')}
              >
                Docs
              </button>
              <button
                className={`top-nav-btn ${activeOpsTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveOpsTab('health')}
              >
                Health
              </button>
            </nav>
            <div className="page-content">
              {renderOpsContent()}
            </div>
          </>
        )
      case 'brain':
        return <BrainStub />
      case 'lab':
        return <LabStub />
      case 'settings':
        return <SettingsStub />
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      <aside className="module-sidebar">
        <button
          className={`module-btn ${activeModule === 'ops' ? 'active' : ''}`}
          onClick={() => setActiveModule('ops')}
          title="Ops"
        >
          ⚒️
        </button>
        <button
          className={`module-btn ${activeModule === 'brain' ? 'active' : ''}`}
          onClick={() => setActiveModule('brain')}
          title="Brain"
        >
          ⚡
        </button>
        <button
          className={`module-btn ${activeModule === 'lab' ? 'active' : ''}`}
          onClick={() => setActiveModule('lab')}
          title="Lab"
        >
          🔥
        </button>
        <button
          className={`module-btn settings ${activeModule === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveModule('settings')}
          title="Settings"
        >
          🔩
        </button>
      </aside>
      <main className="main-content">
        {renderModuleContent()}
      </main>
    </div>
  )
}

export default App
