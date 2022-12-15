import { useEffect, useState } from 'react';
import styles from '../styles/Sidebar.module.css'

interface SidebarEntry {
  sectionID: string;
  displayName: string;
}

interface SidebarProps {
  sectionInfos: SidebarEntry[];
}

export default function Sidebar({ sectionInfos }: SidebarProps) {
  const [sections, setSections] = useState<Element[]>([])

  useEffect(() => {
    const sections = sectionInfos.map(sectionInfo => document.querySelector(`#${sectionInfo.sectionID}`)).filter(x => x) as Element[]
    setSections(sections)
  }, [sectionInfos])

  /* Scrolls viewport into the section before the given section ID */
  function goToPreviousSection(sectionID: string) {
    const currentIdx = sections.findIndex(section => section.id === sectionID)
    if (currentIdx < 1) return
    const targetIdx = currentIdx - 1
    sections[targetIdx].scrollIntoView({ behavior: 'smooth' })
  }

  /* Scrolls viewport into the section after the given section ID */
  function goToNextSection(sectionID: string) {
    const currentIdx = sections.findIndex(section => section.id === sectionID)
    if (currentIdx === -1) return
    const targetIdx = currentIdx + 1
    if (targetIdx >= sections.length) return
    sections[targetIdx].scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className={styles.container}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <ul>
        {sections?.map((section, idx) => (
          <li key={idx}>
            <button
              onClick={() => { section.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ width: '100%', height: '30px' }}
            >
              {sectionInfos[idx].displayName}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <button
          style={{ width: '100%', height: '30px' }}
          onClick={() => {
            const hash = window.location.hash
            const sectionID = hash.split('#')[1]
            goToPreviousSection(sectionID)
          }}
        >
          Previous
        </button>
        <button
          style={{ width: '100%', height: '30px' }}
          onClick={() => {
            const hash = window.location.hash
            const sectionID = hash.split('#')[1]
            goToNextSection(sectionID)
          }}
        >
          Next
        </button>
      </div>
    </div >
  )
}