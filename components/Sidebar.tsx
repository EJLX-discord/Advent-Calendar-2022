import { useEffect, useState } from 'react';
import styles from '../styles/Sidebar.module.css'

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}

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

  useEffect(() => {
    const sectionIndicatorIDs = sections.map(section => `#${section.id}-indicator`)
    const sectionIndicators = sectionIndicatorIDs.map(indicatorID => document.querySelector(indicatorID))
    const pollToUpdateIndicator = () => {
      const hash = window.location.hash || '#section-title'
      const currSectionID = hash.split('#')[1]
      const targetID = `${currSectionID}-indicator`
      for (const sectionIndiciator of sectionIndicators) {
        if (sectionIndiciator === null) continue
        if (sectionIndiciator.id === targetID) {
          sectionIndiciator.style.background = 'hotpink'
        } else {
          sectionIndiciator.style.background = 'none'
        }
      }
    }

    const timer = setInterval(pollToUpdateIndicator, 250)
    return () => clearInterval(timer)

  }, [sections])

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
    <div className={styles.container}>
      <div className={styles['calendar-icon-container']}>
        <CalendarIcon />
      </div>
      <ul className={styles['section-button-list']}>
        {sections?.map((section, idx) => (
          <li key={idx}>
            <div className={styles['section-button-grouping']}>
              <div
                className={styles['section-indicator']}
                id={`${sectionInfos[idx].sectionID}-indicator`}
              />
              <button
                onClick={() => { section.scrollIntoView({ behavior: 'smooth' }) }}
                className={styles['section-button']}
              >
                {sectionInfos[idx].displayName}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles['section-nav-buttons']}>
        <button
          className={styles['section-button']}
          onClick={() => {
            const hash = window.location.hash
            const sectionID = hash.split('#')[1]
            goToPreviousSection(sectionID)
          }}
        >
          Previous
        </button>
        <button
          className={styles['section-button']}
          onClick={() => {
            const hash = window.location.hash
            const sectionID = hash.split('#')[1]
            goToNextSection(sectionID)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}