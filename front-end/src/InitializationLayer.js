import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { isLoggedIn } from 'reducers/auth'
import browserHistory from 'utils/browserHistory'
import { Loading } from './components'
import './normalize.css'

const MainPage = React.lazy(() => import('pages/MainPage'))

class InitializationLayer extends React.Component {
  constructor (props) {
    super(props)
    this.props.isLoggedIn()
  }
  render () {
    return (
      <React.StrictMode>
        <Router history={browserHistory}>
          <Switch>
            <React.Suspense fallback={<Loading/>}>
              <Route path='/' component={MainPage}/>
            </React.Suspense>
          </Switch>
        </Router>
      </React.StrictMode>
    )
  }
}

const mapDispatchToProps = { isLoggedIn }

export default connect(null, mapDispatchToProps)(InitializationLayer)
