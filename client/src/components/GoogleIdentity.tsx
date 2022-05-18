import React, { useEffect } from 'react'

interface GoogleIdentityProps {
  onSignIn: (googleId: string) => void;
  onSignOut: () => void;
  clientId: string;
  jsSrc?: string;
}

interface TokenResponse {
  credential: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    handleCredentialResponse: Function;
  }
}

export function GoogleIdentity ({
  onSignIn,
  onSignOut,
  clientId,
  jsSrc = 'https://accounts.google.com/gsi/client'
}: GoogleIdentityProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = jsSrc
    script.async = true
    script.defer = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, []);
  (window as Window).handleCredentialResponse = (googleId: TokenResponse) => {
    onSignIn(googleId.credential)
  }
  return (
    <div
      style={{
        display: 'grid',
        height: '100vh'
      }}
    >
      <div
        id="g_id_onload"
        data-client_id={clientId}
        data-callback="handleCredentialResponse"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="filled_black"
        data-text="signin_with"
        data-size="medium"
        data-logo_alignment="left"
      ></div>
    </div>
  )
}
