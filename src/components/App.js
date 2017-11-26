import React             from 'react'
import { Switch, Route } from 'react-router-dom'

import Header     from './Header'
import LinkList   from './LinkList'
import CreateLink from './CreateLink'
import Login      from './Login'
import Search     from './Search'
const routes = [
  { path: '/',       component: LinkList   },
  { path: '/create', component: CreateLink },
  { path: '/login',  component: Login      },
  { path: '/search', component: Search     }
]

const App = () => (
  <div className="center w85">
    <Header />
    <div className='ph3 pv1 background-gray'>
      <Switch>
        {routes.map(({ path, component }) =>
          <Route {...{exact: true, path, component}}/>
        )}
      </Switch>
    </div>
  </div>
)

export default App
