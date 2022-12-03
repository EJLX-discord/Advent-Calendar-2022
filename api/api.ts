import { parse } from 'discord-markdown-parser'

const apiPath = `http://localhost:8765/api`

export interface GuildStore {
  id: string | null;
  name: string | null;
  iconURL: string | null;
  iconID: string | null;
}

export interface UserStore {
  id: string;
  username: string;
  nickname: string | null;
  discriminator: string;
  bot: boolean;
  avatarURL: string | null;
  avatarID: string | null;
  serverAvatarURL: string | null;
}

export interface MessageStore {
  content: string;
  channelName: string;
  createdTimestamp: number;
}

export interface AttachmentStore {
  contentType: string | null;
  description: string | null;
  id: string;
  name: string | null;
  spoiler: boolean;
  height: number | null;
  width: number | null;
  url: string;
}

export interface Store {
  message: MessageStore;
  guild: GuildStore;
  user: UserStore;
  attachments: AttachmentStore[];
}

export type Entry = [number, Store, ReturnType<typeof parse>]

export async function fetchMessage(categoryName: string, entryNumber: number): Entry {
  const endpoint = `${apiPath}/${categoryName}/${entryNumber}`
  const res = await fetch(endpoint)
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(`Failed to fetch message: ${data?.error ?? 'Unknown error'}`)
  }
  return [entryNumber, data, parse(data.message.content)]
}

export async function fetchAllMessages(categoryName: string): Entry[] {
  const endpoint = `${apiPath}/${categoryName}`
  const res = await fetch(endpoint)
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(`Failed to fetch message: ${data?.error ?? 'Unknown error'}`)
  }
  const entries = Object.entries(data)
  const sortedEntries = entries
    .map(([k, v]: [number, Store]): Entry => [Number.parseInt(k), v, parse(v.message.content)])
    .sort((a, b) => a[0] - b[0])
  return sortedEntries
}