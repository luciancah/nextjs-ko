import { useRouter } from 'next/router'

const PagesOnly = ({ children }) => {
  const router = useRouter()

  const isPageRoute = router.pathname.startsWith('/docs/pages')

  if (!isPageRoute) {
    return null
  }

  return <>{children}</>
}

export default PagesOnly
