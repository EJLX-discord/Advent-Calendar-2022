import path from 'path'
import fs from 'fs'
import download from 'image-downloader'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { fetchAllMessages, fetchMessage } from '../api/api'
import type { Entry } from '../api/api'

import Message from '../components/Message'

export default function Home({ entries }: { entries: Entry[] }) {
  return (
    <div className={styles.container} style={{ scrollSnapType: 'y proximity', maxHeight: '100vh', overflowY: 'scroll', border: '1px solid hotpink' }}>
      {entries.map((entry, idx) => (
        <section key={idx} style={{ scrollSnapAlign: 'start', width: '100%', border: '1px solid yellow', fontSize: 16 }}>
          <Message messageInfo={entry} />
        </section>
      ))}
    </div>
  )
}

/* Goes through the entryInfo and parsedMessage and downloads all required assets
 * to the public/images folder (i.e. user icons and emojis)
 * Some notes:
 *   the discord cdn allows you to choose between png and webp by appending
 *   the extension to the url. Emojis are also all converted to png on their side
 *   regardless of the original format. */
async function downloadAllAssets([entryNumber, entryInfo, parsedMessage]: Entry) {
  const avatarURL = entryInfo.user.avatarURL
  const serverAvatarURL = entryInfo.user.serverAvatarURL
  const attachments = entryInfo.attachments

  const emojis = [];
  (function extractEmojis(tokens) {
    for (const token of tokens) {
      if (token.type === 'emoji') {
        emojis.push(token)
      } else {
        if (Array.isArray(token?.content)) {
          extractEmojis(token.content)
        }
      }
    }
  })(parsedMessage)

  if (avatarURL) {
    const filename = avatarURL.split('/').pop()
    const destPath = path.join(process.cwd(), `public/images/user/${filename}`)
    if (!fs.existsSync(destPath)) {
      console.log('no exist')
      await download.image({ url: avatarURL, dest: destPath })
    }
  }
  for (const emoji of emojis) {
    if (emoji.animated) {
      const destPath = path.join(process.cwd(), `public/images/emojis/${emoji.id}--${emoji.name}.gif`)
      if (!fs.existsSync(destPath)) {
        await download.image({
          url: `https://cdn.discordapp.com/emojis/${emoji.id}.png`,
          dest: destPath,
        })
      }
    } else {
      const destPath = path.join(process.cwd(), `public/images/emojis/${emoji.id}--${emoji.name}.png`)
      if (!fs.existsSync(destPath)) {
        await download.image({
          url: `https://cdn.discordapp.com/emojis/${emoji.id}.png`,
          dest: destPath,
        })
      }
    }
  }
}

export async function getStaticProps(context): Entry[] {
  const entries = await fetchAllMessages('ac2020')
  for (const entry of entries) {
    await downloadAllAssets(entry)
  }

  console.dir(entries, { depth: 100 })
  return {
    props: { entries },
  }
}
