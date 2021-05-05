import fs from "fs";
import path from "path";
import Head from "next/head";
import matter from "gray-matter";
import dayjs from "dayjs";
import Link from "next/link";
import { Header } from "../components/Header";
import styles from "./index.module.css";

const postsDirectory = path.join(process.cwd(), "posts");

dayjs.locale("us");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: { [key: string]: any } = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.markdown$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title,
      date: dayjs(matterResult.data.date),
    };
  });
  // Sort posts by date
  return allPostsData
    .sort((a: any, b: any) => {
      if (a.date < b.date) {
        return 1;
      }
      return -1;
    })
    .map((post: any) => ({ ...post, date: post.date.format("YYYY/MM/DD") }));
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }: { allPostsData: any[] }) {
  return (
    <div>
      <Head>
        <title>blog.koba04.com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container mx-auto max-w-5xl p-4">
        <ul className="py-4">
          {allPostsData.map((data) => (
            <li key={data.id} className="p-2">
              <div className={`${styles.post} text-xl`}>
                <Link
                  href={`/post/${data.id.replace(
                    /^(\d{4})-(\d{2})-(\d{2})-/,
                    "$1/$2/$3/"
                  )}`}
                >
                  {data.title}
                </Link>
              </div>
              <div className="flex-none flex-1">{data.date}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
