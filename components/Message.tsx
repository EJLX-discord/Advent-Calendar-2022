import Image from 'next-image-export-optimizer'
import { parse } from 'discord-markdown-parser'
import type { DiscordEntry, DiscordUser } from '../pages/index'

import UserProfile from './UserProfile'
import EntryNameBar from './EntryNameBar'
import Spoiler from './Spoiler'
import BlockQuote from './BlockQuote'

import styles from '../styles/Message.module.css'

function makeCounter() {
  let count = -1
  return () => {
    count += 1
    return count
  }
}

function convertToHTML(parsedMessage: ReturnType<typeof parse>) {
  const outputElements = []
  const nextKey = makeCounter()
  for (const node of parsedMessage) {
    const { type } = node

    switch (type) {
      case 'text':
        outputElements.push(<span key={nextKey()}>{node.content}</span>)
        break
      case 'strong':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<strong key={nextKey()}>{children}</strong>)
        } else {
          outputElements.push(<strong key={nextKey()}>{node.content}</strong>)
        }
        break
      case 'em':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<em key={nextKey()}>{children}</em>)
        } else {
          outputElements.push(<em key={nextKey()}>{node.content}</em>)
        }
        break
      case 'strikethrough':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<s key={nextKey()}>{children}</s>)
        } else {
          outputElements.push(<s key={nextKey()}>{node.content}</s>)
        }
        break
      case 'underline':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<u key={nextKey()}>{children}</u>)
        } else {
          outputElements.push(<u key={nextKey()}>{node.content}</u>)
        }
        break
      case 'spoiler':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<Spoiler key={nextKey()}>{children}</Spoiler>)
        } else {
          outputElements.push(<Spoiler key={nextKey()}>{node.content}</Spoiler>)
        }
        break
      case 'twemoji':
        outputElements.push(<span key={nextKey()}>{node.name}</span>)
        break
      case 'emoji':
        const emojiPath = (() => {
          if (node.animated) {
            return `./images/emojis/${node.id}.gif`
          } else {
            return `./images/emojis/${node.id}.webp`
          }
        })()
        outputElements.push(<Image
          key={nextKey()}
          src={emojiPath}
          width="0"
          height="0"
          sizes="100vw"
          className={styles['emoji']}
          alt={node.name}
        />)
        break
      case 'br':
        outputElements.push(<br key={nextKey()} />)
        break
      case 'user':
        outputElements.push(<span key={nextKey()}>{`@${node.id}`}</span>)
        break
      case 'role':
        outputElements.push(<span key={nextKey()}>{`@${node.id}`}</span>)
        break
      case 'url':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<a key={nextKey()} href={node.target}>{children}</a>)
        }
        break
      case 'codeBlock':
        outputElements.push(<pre key={nextKey()}><code>{node.content}</code></pre>)
        break
      case 'inlineCode':
        outputElements.push(<code key={nextKey()}>{node.content}</code>)
        break
      case 'blockQuote':
        if (Array.isArray(node.content)) {
          const children = convertToHTML(node.content)
          outputElements.push(<BlockQuote key={nextKey()}>{children}</BlockQuote>)
        } else {
          outputElements.push(<BlockQuote key={nextKey()}>{node.content}</BlockQuote>)
        }
        break
    }
  }
  return outputElements
}


interface MessageProps {
  messageInfo: DiscordEntry;
}

export default function Message({ messageInfo }: MessageProps) {

  const parsedMessage = parse(messageInfo.message)
  return (
    <div>
      <EntryNameBar entryName={messageInfo.date} />
      <UserProfile profileInfo={messageInfo.user} />
      <div className={styles.entry}>
        {convertToHTML(parsedMessage)}
      </div>
      {messageInfo.attachments.length > 0 && (
        <div className={styles['attachment-container']}>
          <div className={styles['attachment-flex']}>
            {messageInfo.attachments.map(attachment => {
              if (attachment.name.endsWith('.jpg')
                || attachment.name.endsWith('.png')
                || attachment.name.endsWith('.gif')) {
                return (
                  <Image
                    key={attachment.id}
                    src={`./images/attachments/${attachment.id}--${attachment.name}`}
                    width="0"
                    height="0"
                    className={styles['attachment-image']}
                    sizes="100vw"
                    alt={attachment.alt ?? `'No alt text included'`}
                  />
                )
              } else if (attachment.name.endsWith('.mp3')) {
                return (
                  <audio
                    key={attachment.id}
                    controls
                    src={`./assets/${attachment.id}--${attachment.name}`}
                    className={styles['attachment-audio']}
                  >
                    Your browser does not support audio.
                  </audio>
                )
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}