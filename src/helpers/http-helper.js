import axios from 'axios'

export const HTTP = axios.create({
  baseURL: process.env.API_URL
})

export const WS_ENDPOINT = process.env.WS_ENDPOINT
