import axios from 'axios'

export const HTTP = axios.create({
  // baseURL: '/rest-api/v1/'
  // baseURL: 'http://52.164.225.245:8081/rest-api/v1/'
  baseURL: 'http://localhost:8081/rest-api/v1/'
})
