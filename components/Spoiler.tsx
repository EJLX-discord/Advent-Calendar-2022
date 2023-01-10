import { useState } from 'react'
import styles from '../styles/Spoiler.module.css'

export default function EntryNameBar({ children }) {
  const [isHidden, setIsHidden] = useState<boolean>(true)

  const innerContent = (() => {
    if (isHidden) {
      return (
        <span className={styles.spoiler}>
          {children}
        </span>
      )
    } else {
      return (
        <span className={styles.showing}>
          {children}
        </span>
      )
    }
  })()

  return (
    <span onClick={() => setIsHidden(!isHidden)} className={styles.container}>
      {innerContent}
    </span>
  )
}