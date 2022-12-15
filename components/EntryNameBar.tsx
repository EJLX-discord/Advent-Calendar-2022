import styles from '../styles/EntryNameBar.module.css'

interface EntryNameBarProps {
  entryName: string;
}

export default function EntryNameBar({ entryName }: EntryNameBarProps) {
  return (
    <div className={styles.container}>
      {entryName}
    </div>
  )
}