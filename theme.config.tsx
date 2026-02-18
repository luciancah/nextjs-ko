import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import AppOnly from 'components/apponly'
import PagesOnly from 'components/pagesonly'
import Cross from 'components/cross'
import Check from 'components/check'
import Image from 'components/externalImage'

const config: DocsThemeConfig = {
  logo: <span>Nextjs 한글 문서 (커뮤니티)</span>,
  head: (
    <>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="google-site-verification"
        content="iK4L0Q5k7Z7rJf9UzZz8bHJUz2w1J5WgWwY1v0QsV3I"
      />
      <meta
        name="naver-site-verification"
        content="5c8d3e1d2f9b4d2c4c2c8e5c8d3e1d2f9b4d2c4c2c8e5c8d3e1d2f9b4d2c4c2c8e5c8d3e1d2f9b4d2c4c2c8e5"
      />
    </>
  ),
  project: {
    link: 'https://github.com/luciancah/nextjs-ko',
  },
  docsRepositoryBase: 'https://github.com/luciancah/nextjs-ko',
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Nextjs 한글 문서',
      }
    }
  },
  banner: {
    key: 'banner',
    text: (
      <a href="https://github.com/luciancah/nextjs-ko" target="_blank">
        🎉 공식문서 번역에 참여해 주세요. &nbsp;🐙&nbsp; Github 바로가기
        &nbsp;🐙
      </a>
    ),
  },
  components: {
    Check,
    Cross,
    AppOnly,
    PagesOnly,
    Image,
  },
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  darkMode: true,
  footer: {
    text: 'Nextjs 한글/한국어 문서 번역 (비공식) | Using Nextra Docs Template',
  },
}

export default config
