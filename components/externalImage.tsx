import Image from 'next/image'
import { useTheme } from 'nextra-theme-docs'

const ExternalImage = ({ srcLight, srcDark, alt, width, height }) => {
  const { theme, systemTheme } = useTheme()
  const baseUrl = 'https://nextjs.org'
  const src =
    theme === 'system'
      ? systemTheme === 'dark'
        ? srcDark
        : srcLight
      : theme === 'dark'
        ? srcDark
        : srcLight

  return (
    <Image
      src={`${baseUrl}${src}`}
      alt={alt}
      width={width}
      height={height}
      unoptimized={true}
    />
  )
}

export default ExternalImage
