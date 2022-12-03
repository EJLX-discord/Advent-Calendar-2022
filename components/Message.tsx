import type { Entry } from '../api/api'

import Image from 'next/image'

interface MessageProps {
  messageInfo: Entry;
}

function makeCounter() {
  let count = -1
  return () => {
    count += 1
    return count
  }
}

function convertToHTML(parsedMessage) {
  const outputElements = []
  const nextKey = makeCounter()
  console.log(parsedMessage)
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
          outputElements.push(<span key={nextKey()}>{children}</span>)
        } else {
          outputElements.push(<span key={nextKey()}>{node.content}</span>)
        }
        break
      case 'twemoji':
        outputElements.push(<span key={nextKey()}>{node.name}</span>)
        break
      case 'emoji':
        const emojiPath = (() => {
          if (node.animated) {
            return `/images/emojis/${node.id}--${node.name}.gif`
          } else {
            return `/images/emojis/${node.id}--${node.name}.png`
          }
        })()
        outputElements.push(<Image
          key={nextKey()}
          src={emojiPath}
          width={32}
          height={32}
          alt={node.name}
        />)
        console.log(emojiPath)
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
          outputElements.push(<div key={nextKey()}>{children}</div>)
        } else {
          outputElements.push(<div key={nextKey()}>{node.content}</div>)
        }
        break
    }
  }
  return outputElements
}


export default function Message({ messageInfo }: MessageProps) {
  const [entryNumber, entryInfo, parsedMessage] = messageInfo




  return (
    <div>
      {convertToHTML(parsedMessage)}
    </div>
  )


}