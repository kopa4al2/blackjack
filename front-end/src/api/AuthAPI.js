import BaseAPI from './BaseAPI'

class AuthAPI extends BaseAPI {

  register = data => this.post('auth/register', data)

  login = data => this.post('auth/login', data)

  logout = token => this.post('auth/logout', token)

  checkToken = token => this.get(`auth/checkToken?t=${token}`)
}

export default AuthAPI