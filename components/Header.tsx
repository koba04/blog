import styles from "./Header.module.css";
import Link from "next/link";
import { TwitterIcon } from "./TwitterIcon";
import { GitHubIcon } from "./GitHubIcon";

export const Header = () => (
  <header className={`${styles.header} p-4 text-2xl`}>
    <p className="container mx-auto max-w-5xl p-0 sm:p-4 flex">
      <span className="flex-1">
        <Link href="/">blog.koba04.com</Link>
      </span>
      <span className="px-2">
        <a href="https://twitter.com/koba04" target="_blank" rel="noreferrer">
          <TwitterIcon />
        </a>
      </span>
      <span className="px-2">
        <a href="https://github.com/koba04" target="_blank" rel="noreferrer">
          <GitHubIcon />
        </a>
      </span>
    </p>
  </header>
);
