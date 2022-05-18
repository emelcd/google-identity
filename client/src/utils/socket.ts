import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  auth: {
    token: '123'
  }
})

export default socket
