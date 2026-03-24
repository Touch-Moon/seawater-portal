import { Suspense } from 'react'
import AdCard from '@/components/home/AdCard'
import WeatherWidget from '@/components/home/WeatherWidget'
import ContestPanel from '@/components/home/ContestPanel'
import EventsPanel from '@/components/home/EventsPanel'
import JobsPanel from '@/components/home/JobsPanel'
import DirectoryPreview from '@/components/home/DirectoryPreview'
import NewsletterPanel from '@/components/home/NewsletterPanel'

interface SidebarPanelsProps {
  mobile?: boolean
  desktop?: boolean
}

// WeatherWidget skeleton — weather-widget 와 동일한 높이 유지
function WeatherSkeleton() {
  return (
    <div className="weather-widget sk" style={{ height: 76, borderRadius: 'var(--radius-xl)' }} />
  )
}

// DirectoryPreview skeleton — panel 높이 유지
function DirectorySkeleton() {
  return (
    <div className="sk-sidebar-card">
      <div className="sk-panel__header">
        <div className="sk sk--xl sk-panel__icon" />
        <div className="sk sk--pill sk-panel__title" />
      </div>
      <div className="sk-list" style={{ marginTop: 12 }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="sk-list__item">
            <div className="sk sk--pill sk-list__line" style={{ width: `${60 + i * 10}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SidebarPanels({ mobile, desktop }: SidebarPanelsProps) {
  return (
    <>
      <Suspense fallback={<WeatherSkeleton />}>
        <WeatherWidget mobile={mobile} desktop={desktop} />
      </Suspense>
      <ContestPanel mobile={mobile} desktop={desktop} />
      <AdCard mobile={mobile} desktop={desktop} />
      <EventsPanel mobile={mobile} desktop={desktop} />
      <JobsPanel mobile={mobile} desktop={desktop} />
      <Suspense fallback={<DirectorySkeleton />}>
        <DirectoryPreview mobile={mobile} desktop={desktop} />
      </Suspense>
      <NewsletterPanel mobile={mobile} desktop={desktop} />
    </>
  )
}
