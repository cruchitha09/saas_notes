'use client'

import { useState, useEffect } from 'react'
import NoteForm from './NoteForm'
import NoteList from './NoteList'
import UpgradeBanner from './UpgradeBanner'

interface User {
  id: string
  email: string
  role: string
  tenant: {
    id: string
    name: string
    plan: string
    slug: string
  }
}

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    email: string
  }
}

interface NotesAppProps {
  user: User
  token: string
  onLogout: () => void
  onUserUpdate: (user: User) => void
}

export default function NotesApp({ user, token, onLogout, onUserUpdate }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }

      const data = await response.json()
      setNotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [token])

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403 && data.error.includes('limit')) {
          setShowUpgrade(true)
          return
        }
        throw new Error(data.error || 'Failed to create note')
      }

      setNotes([data, ...notes])
      setShowUpgrade(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note')
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      setNotes(notes.filter(note => note.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
    }
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch(`/api/tenants/${user.tenant.slug}/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upgrade')
      }

      const data = await response.json()
      console.log('Upgrade response:', data)

      // Update user's tenant plan in localStorage and state
      const updatedUser = {
        ...user,
        tenant: {
          ...user.tenant,
          plan: 'PRO'
        }
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      onUserUpdate(updatedUser)
      setShowUpgrade(false)
      setError('') // Clear any previous errors
      alert('Successfully upgraded to Pro! You can now create unlimited notes.')
    } catch (err) {
      console.error('Upgrade error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upgrade')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user.email} ({user.role}) - {user.tenant.name} ({user.tenant.plan})
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {showUpgrade && user.tenant.plan === 'FREE' && (
            <UpgradeBanner onUpgrade={handleUpgrade} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <NoteForm onCreateNote={handleCreateNote} />
            </div>
            <div className="lg:col-span-2">
              <NoteList notes={notes} onDeleteNote={handleDeleteNote} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
