import path from "path";
import fs from "fs";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import prism from "remark-prism";
import linkify from "remark-linkify-regex";
import dayjs from "dayjs";

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

export async function getPostData(params: {
  title: string;
  year: string;
  month: string;
  day: string;
}) {
  const fullPath = path.join(
    postsDirectory,
    `${params.year}-${params.month}-${params.day}-${params.title}.markdown`
  );
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(linkify(/https?:\/\/[^\s]*/))
    .use(prism)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    contentHtml,
    ...matterResult.data,
  };
}
