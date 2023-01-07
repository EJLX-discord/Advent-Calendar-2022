import path from 'path'
import { promises as fs } from 'fs'
import HJSON from 'hjson'
import { useEffect, useState } from 'react'

import Link from 'next/link'

import Message from '../components/Message'
import Sidebar from '../components/Sidebar'
import TitleCard from '../components/TitleCard'

import styles from '../styles/Home.module.css'

export default function Home({ entries }: { entries: DiscordEntryStore }) {
  const sortedEntries = Object.entries(entries).sort((a, b) => Number.parseInt(a[0]) - Number.parseInt(b[0]))
  const entryNamesForSidebar = [
    {
      sectionID: 'section-title',
      displayName: 'Top',
    },
    ...sortedEntries.map(([entryIdx, entry]) => ({
      sectionID: `section-${entryIdx}`,
      displayName: entry.date,
    })),
    {
      sectionID: 'section-footer',
      displayName: 'Bottom',
    },
  ]

  useEffect(() => {
    let didScroll = false
    const titleSection = document.querySelector('#section-title')
    const footerSection = document.querySelector('#section-footer')
    const sections = [
      titleSection,
      ...sortedEntries.map(([idx, _]) => document.querySelector(`#section-${idx}`)),
      footerSection,
    ].filter(x => x !== null) as Element[]

    const mainDiv = document.querySelector('#main') as Element
    mainDiv.addEventListener('scroll', () => {
      didScroll = true
    })

    /* Gets whether the top and bottom of the element is in the viewport */
    function isInViewport(element: Element) {
      const rect = element.getBoundingClientRect()
      return [rect.top >= 0, rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)]
    }

    function getActiveSection(elements: Element[]) {
      for (const element of elements) {
        const [isTopVisible, isBottomVisible] = isInViewport(element)
        if (!isTopVisible && !isBottomVisible) return element
        if (isTopVisible && isBottomVisible) return element
        if (isTopVisible && !isBottomVisible) return element
      }
      return elements[elements.length - 1]
    }

    setInterval(() => {
      if (didScroll) {
        didScroll = false
        const activeSelection = getActiveSection(sections)
        history.replaceState(undefined, '', `#${activeSelection.id}`)
      }
    }, 250)
  }, [sortedEntries]);

  return (
    <div className={styles['container']}>
      <Sidebar sectionInfos={entryNamesForSidebar} />
      <div id={'main'} className={styles['messages-container']}>
        <div
          className={styles['message-section']}
          id={'section-title'}
          style={{ height: '100vh', minHeight: '450px' }}
        >
          <TitleCard />
        </div>
        {sortedEntries.map(([entryIdx, entry]) => (
          <section
            key={Number.parseInt(entryIdx)}
            className={styles['message-section']}
            id={`section-${entryIdx}`}
          >
            <Message messageInfo={entry} />
          </section>
        ))}
        <div
          className={styles['message-section']}
          id={'section-footer'}
          style={{ height: '50vh', minHeight: '450px' }}
        >
          <TitleCard />
        </div>
      </div>
    </div>
  )
}
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  nickname: string;
  alt?: string;
  isGif?: boolean;
  hasServerIcon?: boolean;
  serverIconIsGif?: boolean;
  serverIconAlt?: string;
}

export interface Attachment {
  id: string;
  name: string;
  spoiler?: boolean;
  alt?: string;
}

export interface DiscordEntry {
  id: number;
  date: string;
  message: string;
  user: DiscordUser;
  attachments: Attachment[];
}

export interface DiscordEntryStore {
  [key: string]: DiscordEntry
}

async function getEntryInfo(filePath: string): Promise<DiscordEntry> {
  const fileData = await fs.readFile(filePath, 'utf8')
  const entryInfo = HJSON.parse(fileData)
  return entryInfo
}

async function getEntriesFromDir(dirName: string): Promise<DiscordEntryStore> {
  const entries: DiscordEntryStore = {}
  const entryDirPath = path.join(process.cwd(), dirName)
  const filenames = await fs.readdir(entryDirPath)
  await Promise.all(filenames.map(async filename => {
    const filePath = path.resolve(entryDirPath, filename)
    const stat = await fs.stat(filePath)
    if (!stat.isFile()) return
    const entryInfo = await getEntryInfo(filePath)
    entries[entryInfo.id.toString()] = entryInfo
  }))
  console.log(entries)
  return entries
}

export async function getStaticProps() {
  const entries = await getEntriesFromDir('entries')
  return { props: { entries } }
}
