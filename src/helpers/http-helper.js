import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'http://52.164.225.245:8081/rest-api/v1/'
})
