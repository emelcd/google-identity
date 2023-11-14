import React, { useEffect } from 'react'
import './App.css'
import socket from './utils/socket'
import { GoogleIdentity } from './components/GoogleIdentity'

const CLIENT_ID =
    ''

socket.on('connect', () => {
  console.log('connected')
})

function App () {
  const [token, setToken]: [string, Function] = React.useState('')
  const saveToken = (token: string) => {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      localStorage.setItem('token', token)
      setToken(token)
      socket.emit('joinToken', token)
    } else {
      localStorage.removeItem('token')
      localStorage.setItem('token', token)
      setToken(token)
    }
  }

  return (
        <>
            {token
              ? (
                <>{token}</>
                )
              : (
                <>
                    <GoogleIdentity
                        onSignIn={saveToken}
                        onSignOut={() => {
                          localStorage.removeItem('token')
                          setToken('')
                        }}
                        clientId={CLIENT_ID}
                    />
                </>
                )}
        </>
  )
}

export default App
