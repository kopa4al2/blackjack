import { useSelector } from 'react-redux'

const useAuth = () => useSelector(({ auth }) => ({
  isLoggedIn: !!auth.login,
  user: auth.login,
}))

export default useAuth