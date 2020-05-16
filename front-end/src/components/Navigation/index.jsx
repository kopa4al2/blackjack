import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from 'reducers/auth'
import useAuth from 'hooks/useAuth'
import styles from './styles.scss'

const Navigation = () => {
  const { isLoggedIn } = useAuth()
  const dispatch = useDispatch()

  function handleLogout () {
    dispatch(logout())
  }

  function renderNavigation () {
    if (!isLoggedIn) {
      return (
        <ul>
          <Link to='login'>Login</Link>
          <Link to='register'>Register</Link>
        </ul>
      )
    } else {
      return (
        <nav>
          <ul>
            <Link
              className='nav-link'
              to='login'
              onClick={handleLogout}
            >
              Logout
            </Link>
            <Link className={styles.navLink} to='play'>Play</Link>
            <Link className={styles.navLink} to='stats'>Stats</Link>
          </ul>
        </nav>
      )
    }
  }

  return (
    <nav>
      {renderNavigation()}
    </nav>
  )
}

export default Navigation
