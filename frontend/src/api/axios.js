import axios from 'axios'


const instance = axios.create({
  baseURL: 'http://localhost:8000',allow_origins=["http://localhost:5173", "http://localhost:5174"],
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance