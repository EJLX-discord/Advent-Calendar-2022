import styles from '../styles/BlockQuote.module.css'

export default function BlockQuote({ children }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}