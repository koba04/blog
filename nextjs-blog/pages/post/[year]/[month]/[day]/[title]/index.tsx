import matter from "gray-matter"
import path from "path"
import fs from "fs"
import remark from "remark"
import html from "remark-html"
import Head from "next/head"

import { Header } from "../../../../../../components/Header"

const postsDirectory = path.join(process.cwd(), '../source/_posts/')

export async function getPostData(params: { title: string, year: string, month: string, day: string }) {
    const fullPath = path.join(postsDirectory, `${params.year}-${params.month}-${params.day}-${params.title}.markdown`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .use(require('remark-linkify-regex')(/https?:\/\/[^\s]*/))
      .process(matterResult.content)
    const contentHtml = processedContent.toString()
  
    // Combine the data with the id and contentHtml
    return {
      contentHtml,
      ...matterResult.data
    }
}

export async function getStaticPaths() {
    const fileNames = fs.readdirSync(postsDirectory)
    return {
        paths: fileNames.map(fileName => {
          // Remove ".md" from file name to get id
          const id = fileName.replace(/\.markdown$/, '')
          return `/post/${id.replace(/^(\d{4})\-(\d{2})\-(\d{2})\-/, "$1/$2/$3/")}`
        }),
        fallback: false
    }   
}

export async function getStaticProps({ params }: any) {
    const postData = await getPostData(params)
    return {
        props: {
            postData
        }
    }
}
  
export default function Post({ postData }: any) {
    return (
        <>
          <Head>
                <title>{postData.title}</title>
                <link rel="icon" href="/favicon.ico" />
          </Head>
        <Header />
        <article className="container mx-auto max-w-5xl p-4">
            <h1 className="text-3xl py-4">{postData.title}</h1>
            <p>{postData.date}</p>
            <div className="content" dangerouslySetInnerHTML={{ __html: postData.contentHtml}}></div>
        </article>
        </>
    )
}