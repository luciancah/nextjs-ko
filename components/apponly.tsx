import { useRouter } from 'next/router'

const AppOnly = ({ children }) => {
  const router = useRouter()

  const isAppRoute = router.pathname.startsWith('/docs/app')

  if (!isAppRoute) {
    return null
  }

  return <>{children}</>
}

export default AppOnly
