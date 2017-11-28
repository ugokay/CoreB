import {HTTP} from '@/helpers/http-helper.js'

export const AUTH = {
  token: '',
  setToken: function (token) {
    HTTP.defaults.headers = {
      Authorization: 'Bearer ' + token
    }
    this.token = token
    if (window.localStorage) {
      window.localStorage.setItem('token', token)
    }
  },
  isLogged: function () {
    if (this.token && this.token !== '') {
      return true
    }
    if (window.localStorage) {
      var token = window.localStorage.getItem('token')
      if (token && token !== '') {
        this.setToken(token)
        return true
      }
    }
    return false
  },
  login: function (userName, password) {
    return HTTP.get('bi/auth/login', {
      headers: {
        'Authorization': 'Basic ' + btoa(userName + ':' + password),
        'Accept': 'application/json'
      }
    })
  }
}
