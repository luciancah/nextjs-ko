import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import AppOnly from "components/apponly";
import PagesOnly from "components/pagesonly";
import Cross from "components/cross";
import Check from "components/check";

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
        🎉 공식문서 번역에 참여해주세요.
      </a>
    ),
  },
  components: {
    Check,
    Cross,
    AppOnly,
    PagesOnly,
  },
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  footer: {
    text: "Using Nextra Docs Template",
  },
};

export default config;
