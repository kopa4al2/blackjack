import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import useAuth from 'hooks/useAuth'

export default ({ component: RouteComponent, ...props }) => {
  const { isLoggedIn } = useAuth()
  return (
    <Route
      {...props}
      render={props =>
        isLoggedIn
          ? <RouteComponent/>
          : <Redirect
            to={`login?redirect=${props.location.pathname}`}/>}
    />
  )
}