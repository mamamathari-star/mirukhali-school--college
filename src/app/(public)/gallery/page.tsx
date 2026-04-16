'use client'

import { useState } from 'react'
import { GALLERY_CATEGORIES } from '@/lib/constants'
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  caption: string | null
  url: string
  category: string
  createdAt: string
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const categories = ['All', ...GALLERY_CATEGORIES]

  async function fetchImages(category: string) {
    setLoading(true)
    setActiveCategory(category)
    try {
      const params = new URLSearchParams({ published: 'true', limit: '50' })
      if (category !== 'All') params.set('category', category)
      const res = await fetch(`/api/gallery?${params.toString()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setImages(data.images || [])
    } catch {
      setImages([])
    } finally {
      setLoading(false)
      setFetched(true)
    }
  }

  // Fetch on first render
  if (!fetched && !loading) {
    fetchImages('All')
  }

  const filtered = images

  function openLightbox(idx: number) {
    setLightbox(idx)
  }
  function closeLightbox() {
    setLightbox(null)
  }
  function prevImage() {
    setLightbox((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null))
  }
  function nextImage() {
    setLightbox((prev) => (prev !== null ? (prev + 1) % filtered.length : null))
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Campus Moments
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Photo Gallery</h1>
            <p className="text-white/70 text-lg">
              Explore moments from academic events, sports days, cultural programs, and campus life
              at Mirukhali School &amp; College.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="container">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => fetchImages(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary-800 text-white border-primary-800 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin" />
            </div>
          )}

          {/* Empty */}
          {!loading && fetched && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <ImageIcon className="h-14 w-14 mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No Photos Found</h3>
              <p className="text-sm text-gray-400">
                {activeCategory === 'All'
                  ? 'Gallery images will appear here once uploaded by the administration.'
                  : `No photos in the "${activeCategory}" category.`}
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {filtered.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className="relative group w-full block overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow break-inside-avoid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                    <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200 text-left w-full">
                      <p className="text-white text-xs font-semibold line-clamp-1">{img.title}</p>
                      {img.caption && (
                        <p className="text-white/70 text-xs line-clamp-1">{img.caption}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-3.5 w-3.5 text-gray-700" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] w-full mx-8 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filtered[lightbox].url}
              alt={filtered[lightbox].title}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-semibold">{filtered[lightbox].title}</p>
              {filtered[lightbox].caption && (
                <p className="text-white/70 text-sm mt-1">{filtered[lightbox].caption}</p>
              )}
              <p className="text-white/40 text-xs mt-2">
                {lightbox + 1} / {filtered.length}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
