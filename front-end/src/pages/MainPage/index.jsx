import React from 'react'
import { Switch } from 'react-router-dom'
import {
  Loading,
  Navigation,
  UnauthenticatedRoute,
  AuthenticatedRoute,
  Notifier,
} from 'components'

const AuthPage = React.lazy(() => import('pages/AuthPage'))
const RegistrationPage = React.lazy(() => import('pages/RegisterPage'))
const GamePage = React.lazy(() => import('pages/GamePage'))

const MainPage = () => (
  <>
    <Notifier />
    <Navigation/>
    <Switch>
      <React.Suspense fallback={<Loading/>}>
        <UnauthenticatedRoute
          exact path='/login'
          component={AuthPage}
        />
        <UnauthenticatedRoute
          exact path='/register'
          component={RegistrationPage}
        />
        <AuthenticatedRoute
          exact path='/play'
          component={GamePage}
        />
      </React.Suspense>
    </Switch>
  </>
)

export default MainPage