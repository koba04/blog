import Link from "next/link";
import { Header } from "../components/Header";
import styles from "./index.module.css";
import { getSortedPostsData } from "../lib/markdown";
import { Head } from "../components/Head";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData: allPostsData.map((post: any) => ({
        ...post,
        date: post.date.format("YYYY/MM/DD"),
      })),
    },
  };
}

export default function Home({ allPostsData }: { allPostsData: any[] }) {
  return (
    <div>
      <Head title="blog.koba04.com" url="https://blog.koba04.com" />
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
