import HeadWrapper from "next/head";

export const Head = ({ title, url }: { title: string; url: string }) => (
  <HeadWrapper>
    <title>{title}</title>
    <link rel="icon" href="/images/favicon.ico" />
    <link
      href="/atom.xml"
      rel="alternate"
      title="blog.koba04.com"
      type="application/atom+xml"
    />
    <meta property="og:title" content={title} />
    <meta property="og:description" content="" />
    <meta property="og:url" content={url} />
    <meta property="og:image" content="/images/ogp.png" />
    <meta property="og:author" content="koba04" />
    <meta property="og:site_name" content="blog.koba04.com" />
    <meta property="og:locale" content="ja_JP" />
    <meta property="og:type" content="article" />
  </HeadWrapper>
);
