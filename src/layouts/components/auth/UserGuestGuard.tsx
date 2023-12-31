// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useSession } from 'next-auth/react'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (session.status === 'authenticated' && !router.query.returnUrl) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, session.status])

  if (session.status === 'unauthenticated') {
    return <>{children}</>
  } else {
    return fallback
  }
}

export default GuestGuard
