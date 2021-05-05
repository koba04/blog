import styles from "./Header.module.css"
import Link from "next/link"

export const Header = () => (
    <header className={`${styles.header} p-4 text-2xl`}>
        <p className="container p-4"><Link href="/">blog.koba04.com</Link></p>
    </header>
)