import Image from 'next-image-export-optimizer'

import type { DiscordUser } from '../pages/index'

import styles from '../styles/UserProfile.module.css'

interface UserProfileProps {
  profileInfo: DiscordUser;
}

export default function UserProfile({ profileInfo }: UserProfileProps) {
  const fullName = `${profileInfo.username}#${profileInfo.discriminator}`
  const isGif = profileInfo.isGif ?? false
  const imageSrc = `./images/user/${profileInfo.id}.${isGif ? 'gif' : 'webp'}`
  const serverIconImageSrc = (() => {
    const iconIsGif = profileInfo.serverIconIsGif ?? false
    const ext = iconIsGif ? 'gif' : 'webp'
    return `./images/user/${profileInfo.id}--server.${ext}`
  })()
  return (
    <div className={styles['container']}>
      {profileInfo.hasServerIcon && (
        <div className={styles['image-container']}>
          <Image
            key={`${profileInfo.id}-server`}
            src={serverIconImageSrc}
            width="64"
            height="64"
            alt={profileInfo.serverIconAlt ?? `Server profile image for user ${profileInfo.nickname}`}
            className={styles['image']}
          />
        </div>
      )}
      <div className={styles['image-container']}>
        <Image
          key={profileInfo.id}
          src={imageSrc}
          width="64"
          height="64"
          alt={profileInfo.alt ?? `Profile image for user ${profileInfo.nickname}`}
          className={styles['image']}
        />
      </div>
      <div className={styles['name-container']}>
        <div className={styles['nickname']}>{profileInfo.nickname}</div>
        <div className={styles['username']}>{fullName}</div>
      </div>
    </div>
  )
}