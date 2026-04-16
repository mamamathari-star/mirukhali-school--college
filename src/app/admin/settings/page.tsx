'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

type Settings = Record<string, string>

const TABS = ['general', 'social', 'about'] as const
type Tab = (typeof TABS)[number]

const TAB_LABELS: Record<Tab, string> = {
  general: 'General',
  social: 'Social Media',
  about: 'About',
}

const GENERAL_FIELDS = [
  { key: 'school_name', label: 'School Name', type: 'text' },
  { key: 'school_name_bn', label: 'School Name (Bangla)', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'eiin', label: 'EIIN Number', type: 'text' },
  { key: 'established', label: 'Established Year', type: 'text' },
]

const SOCIAL_FIELDS = [
  { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
  { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
  { key: 'twitter_url', label: 'Twitter/X URL', type: 'url' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
]

const ABOUT_FIELDS = [
  { key: 'mission', label: 'Mission', type: 'textarea' },
  { key: 'vision', label: 'Vision', type: 'textarea' },
  { key: 'about_text', label: 'About Text', type: 'textarea' },
  { key: 'principal_message', label: "Principal's Message", type: 'textarea' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('general')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      if (res.ok) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save settings')
      }
    } catch {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const currentFields =
    activeTab === 'general' ? GENERAL_FIELDS : activeTab === 'social' ? SOCIAL_FIELDS : ABOUT_FIELDS

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="flex border-b">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="p-6 space-y-5">
          {currentFields.map((field) =>
            field.type === 'textarea' ? (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <textarea
                  value={settings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ) : (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
