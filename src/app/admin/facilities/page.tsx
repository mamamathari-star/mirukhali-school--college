'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

interface Facility {
  id: string
  name: string
  description: string
  icon: string | null
  imageUrl: string | null
  order: number
  isActive: boolean
}

interface FormData {
  name: string
  description: string
  icon: string
  imageUrl: string
  order: string
  isActive: boolean
}

const emptyForm: FormData = {
  name: '', description: '', icon: '', imageUrl: '', order: '0', isActive: true,
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)

  const fetchFacilities = useCallback(async () => {
    try {
      const res = await fetch('/api/facilities')
      const data = await res.json()
      setFacilities(data.facilities)
    } catch {
      setError('Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFacilities()
  }, [fetchFacilities])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function startEdit(facility: Facility) {
    setEditingFacility(facility)
    setForm({
      name: facility.name,
      description: facility.description,
      icon: facility.icon || '',
      imageUrl: facility.imageUrl || '',
      order: String(facility.order),
      isActive: facility.isActive,
    })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingFacility(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.description) { setError('Name and description are required'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, order: parseInt(form.order) || 0 }
      const url = editingFacility ? `/api/facilities/${editingFacility.id}` : '/api/facilities'
      const method = editingFacility ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save facility')
      } else {
        if (editingFacility) {
          setFacilities((prev) => prev.map((f) => (f.id === data.facility.id ? data.facility : f)))
        } else {
          setFacilities((prev) => [...prev, data.facility])
        }
        cancelForm()
      }
    } catch {
      setError('Failed to save facility')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this facility?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/facilities/${id}`, { method: 'DELETE' })
      if (res.ok) setFacilities((prev) => prev.filter((f) => f.id !== id))
      else setError('Failed to delete facility')
    } catch {
      setError('Failed to delete facility')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
        <button
          onClick={() => { cancelForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
            <button type="button" onClick={cancelForm} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji or name)</label>
              <input type="text" name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. 🔬 or library" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : editingFacility ? 'Update' : 'Add Facility'}
            </button>
            <button type="button" onClick={cancelForm} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Icon</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facilities.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No facilities found</td></tr>
                ) : (
                  facilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{facility.order}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{facility.name}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{facility.description}</td>
                      <td className="px-4 py-3 text-gray-600">{facility.icon || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${facility.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {facility.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(facility)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(facility.id)} disabled={deletingId === facility.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
