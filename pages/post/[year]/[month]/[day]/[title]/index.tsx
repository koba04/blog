import path from "path";
import fs from "fs";
import dayjs from "dayjs";

import styles from "./index.module.css";

import { Header } from "../../../../../../components/Header";
import { getPostData } from "../../../../../../lib/markdown";
import { Head } from "../../../../../../components/Head";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getStaticPaths() {
  const fileNames = fs.readdirSync(postsDirectory);
  return {
    paths: fileNames.map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.markdown$/, "");
      return `/post/${id.replace(/^(\d{4})-(\d{2})-(\d{2})-/, "$1/$2/$3/")}`;
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const id = `${params.year}-${params.month}-${params.day}-${params.title}`;
  const postData = await getPostData(id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }: any) {
  const url = `https://blog.koba04.com/post/${postData.id.replace(
    /^(\d{4})-(\d{2})-(\d{2})-/,
    "$1/$2/$3/"
  )}`;
  return (
    <>
      <Head title={postData.title} url={url} />
      <Header />
      <article className="container mx-auto max-w-5xl p-4">
        <h1 className="text-3xl py-4">{postData.title}</h1>
        <p>
          {dayjs(postData.date).format("YYYY/MM/DD")}&nbsp;
          <a
            href="https://github.com/koba04/"
            target="_blank"
            rel="noreferrer"
            className={styles.author}
          >
            @koba04
          </a>
        </p>
        <div
          className="content py-8"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </>
  );
}
