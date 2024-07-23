import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import AppOnly from "components/apponly";
import PagesOnly from "components/pagesonly";
import Cross from "components/cross";
import Check from "components/check";
import Image from "components/externalImage";

const config: DocsThemeConfig = {
  logo: <span>Nextjs 한국어 번역</span>,
  project: {
    link: "https://github.com/luciancah/nextjs-ko",
  },
  docsRepositoryBase: "https://github.com/luciancah/nextjs-ko",
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – Nextjs 한국어 번역",
      };
    }
  },
  banner: {
    key: "banner",
    text: (
      <a href="https://github.com/luciancah/nextjs-ko" target="_blank">
        🎉 공식문서 번역에 참여해주세요. &nbsp;🐙&nbsp; Github 바로가기 &nbsp;🐙
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
    text: "Using Nextra Docs Template",
  },
};

export default config;
