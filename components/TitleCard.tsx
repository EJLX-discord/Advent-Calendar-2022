import Image from 'next-image-export-optimizer'

import { useEffect } from 'react'
import styles from '../styles/TitleCard.module.css'

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}

interface TitleCardProps {
}

export default function TitleCard({ }: TitleCardProps) {

  useEffect(() => {
    const titleDownArrow = document.querySelector('#title-down-arrow')
    if (!titleDownArrow) return
    titleDownArrow.style.opacity = 0.5
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles['text-container']}>
        <h1 className={styles.title}>
          <Image
            src={'./images/banner.png'}
            width="0"
            height="0"
            className={styles['banner']}
            sizes="100vw"
            alt={'EJLX Advent Calendar 2022 Banner'}
          />
        </h1>
        <h2 className={styles.subtitle}>Presented by the EJLX Server</h2>
        <p className={styles.shoutout}>A 31 day annual writing event on the English-Japanese Language Exchange Discord Server on any topic of choice. Thanks to all the wonderful members who participated this year!</p>
        <div className={styles['links-container']}>
          <a href={'https://ejlx-discord.github.io/Advent-Calendar-Hub/'}>Previous Years</a>
          <a href={'https://discord.gg/japanese'}>Join the server</a>
        </div>
        <div id={'title-down-arrow'} className={styles['down-arrow']}><ChevronDown /></div>
      </div>
    </div>
  )
}