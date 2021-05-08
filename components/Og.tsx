export const Og = ({ title, url }: { title: string; url: string }) => (
  <>
    <meta property="og:title" content={title} />
    <meta property="og:description" content="" />
    <meta property="og:url" content={url} />
    <meta
      property="og:image"
      content="https://avatars.githubusercontent.com/u/250407"
    />
    <meta property="og:author" content="koba04" />
    <meta property="og:site_name" content="blog.koba04.com" />
    <meta property="og:locale" content="ja_JP" />
    <meta property="og:type" content="article" />
  </>
);
