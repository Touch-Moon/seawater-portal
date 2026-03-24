'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  GEOMET_BASE,
  WMS_LAYERS,
  STEINBACH_CENTER,
  type RadarWmsParams,
} from '@/lib/radar'

// ── Layer config ──
const LAYERS = [
  { key: 'RADAR_RAIN' as const, label: 'Rain' },
  { key: 'RADAR_SNOW' as const, label: 'Snow' },
]

// ── Dark / light tile providers ──
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'

interface RadarMapProps {
  theme?: string
}

export default function RadarMap({ theme }: RadarMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const baseLayerRef = useRef<L.TileLayer | null>(null)
  const wmsLayerRef = useRef<L.TileLayer.WMS | null>(null)
  const markerRef = useRef<L.CircleMarker | null>(null)

  const [activeLayer, setActiveLayer] = useState<RadarWmsParams['layer']>('RADAR_RAIN')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // ── Initialize map ──
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [STEINBACH_CENTER.lat, STEINBACH_CENTER.lng],
      zoom: STEINBACH_CENTER.zoom,
      zoomControl: false,
      attributionControl: false,
    })

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map)
    L.control.attribution({ position: 'bottomright' }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // ── Base tile layer (theme-aware) ──
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current)
    }

    const tileUrl = theme === 'light' ? TILE_LIGHT : TILE_DARK
    const base = L.tileLayer(tileUrl, {
      attribution: TILE_ATTR,
      maxZoom: 18,
    }).addTo(map)

    baseLayerRef.current = base
  }, [theme])

  // ── Steinbach marker ──
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (markerRef.current) {
      map.removeLayer(markerRef.current)
    }

    const marker = L.circleMarker(
      [STEINBACH_CENTER.lat, STEINBACH_CENTER.lng],
      {
        radius: 6,
        fillColor: '#ff4e33',
        fillOpacity: 1,
        color: '#fff',
        weight: 2,
      }
    ).addTo(map)

    marker.bindTooltip('Steinbach', {
      permanent: false,
      direction: 'top',
      offset: [0, -8],
    })

    markerRef.current = marker
  }, [theme])

  // ── WMS radar layer ──
  const updateWmsLayer = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    setIsLoading(true)

    if (wmsLayerRef.current) {
      map.removeLayer(wmsLayerRef.current)
    }

    const layerName = activeLayer ? WMS_LAYERS[activeLayer] : WMS_LAYERS.RADAR_RAIN

    const wms = L.tileLayer.wms(GEOMET_BASE, {
      layers: layerName,
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      opacity: 0.7,
    } as L.WMSOptions)

    wms.on('load', () => {
      setIsLoading(false)
      setLastUpdated(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }))
    })

    wms.addTo(map)
    wmsLayerRef.current = wms
  }, [activeLayer])

  useEffect(() => {
    updateWmsLayer()
  }, [updateWmsLayer])

  // ── Auto-refresh every 6 minutes ──
  useEffect(() => {
    const interval = setInterval(() => {
      updateWmsLayer()
    }, 6 * 60 * 1000)

    return () => clearInterval(interval)
  }, [updateWmsLayer])

  // ── Recenter ──
  function handleRecenter() {
    mapRef.current?.setView(
      [STEINBACH_CENTER.lat, STEINBACH_CENTER.lng],
      STEINBACH_CENTER.zoom,
      { animate: true }
    )
  }

  return (
    <div className="radar-map">
      {/* ── Controls overlay ── */}
      <div className="radar-map__controls">
        {/* Layer switcher */}
        <div className="radar-map__layers">
          {LAYERS.map((l) => (
            <button
              key={l.key}
              type="button"
              className={`radar-map__layer-btn${activeLayer === l.key ? ' radar-map__layer-btn--active' : ''}`}
              onClick={() => setActiveLayer(l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="radar-map__status">
          {isLoading ? (
            <span className="radar-map__loading">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Loading…
            </span>
          ) : lastUpdated ? (
            <span className="radar-map__updated">Updated {lastUpdated}</span>
          ) : null}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="radar-map__bottom-bar">
        <button
          type="button"
          className="radar-map__recenter-btn"
          onClick={handleRecenter}
          aria-label="Recenter map"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
          </svg>
          Steinbach
        </button>

        <button
          type="button"
          className="radar-map__refresh-btn"
          onClick={updateWmsLayer}
          aria-label="Refresh radar"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Legend ── */}
      <div className="radar-map__legend">
        <span className="radar-map__legend-title">
          {activeLayer === 'RADAR_SNOW' ? 'Snow Rate' : 'Rain Rate'} (mm/h)
        </span>
        <div className="radar-map__legend-bar" />
        <div className="radar-map__legend-labels">
          <span>0</span>
          <span>Light</span>
          <span>Moderate</span>
          <span>Heavy</span>
        </div>
      </div>

      {/* ── Map container ── */}
      <div ref={containerRef} className="radar-map__container" />
    </div>
  )
}
