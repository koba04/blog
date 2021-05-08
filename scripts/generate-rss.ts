import RSS from "rss";
import fs from "fs";
import { getSortedPostsData, getPostData } from "../lib/markdown";

const posts = getSortedPostsData();

const feed = new RSS({
  title: "blog.koba04.com",
  feed_url: "https://blog.koba04.com/atom.xml",
  site_url: "https://blog.koba04.com/",
  language: "ja",
});

(async () => {
  for (const post of posts) {
    const url = `https://blog.koba04.com/post/${post.id.replace(
      /^(\d{4})-(\d{2})-(\d{2})-/,
      "$1/$2/$3/"
    )}`;
    const content = await getPostData(post.id);
    feed.item({
      title: post.title,
      description: content.contentHtml,
      url,
      author: "koba04",
      date: post.date.format("MMM DD, YYYY"),
    });
  }

  fs.writeFileSync("public/atom.xml", feed.xml());
})();
