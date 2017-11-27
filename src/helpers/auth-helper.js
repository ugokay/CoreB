import {HTTP} from '@/helpers/http-helper.js'

export const AUTH = {
  token: '',
  setToken: function (token) {
    HTTP.defaults.headers = {
      Authorization: 'Bearer ' + token
    }
    this.token = token
  },
  isLogged: false,
  login: function (userName, password) {
    return HTTP.get('bi/auth/login', {
      headers: {
        'Authorization': 'Basic ' + btoa(userName + ':' + password),
        'Accept': 'application/json'
      }
    })
  }
}
