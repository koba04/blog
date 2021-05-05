import path from "path";
import fs from "fs";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import prism from "remark-prism";
import linkify from "remark-linkify-regex";

const postsDirectory = path.join(process.cwd(), "posts");

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
    .use(prism)
    .use(linkify(/https?:\/\/[^\s]*/))
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    contentHtml,
    ...matterResult.data,
  };
}
