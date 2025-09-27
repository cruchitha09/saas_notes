'use client'

import { useState } from 'react'

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

interface NoteListProps {
  notes: Note[]
  onDeleteNote: (id: string) => void
}

export default function NoteList({ notes, onDeleteNote }: NoteListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Notes</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No notes yet. Create your first note!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Your Notes ({notes.length})</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {notes.map((note) => (
          <div key={note.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {note.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                  {note.content}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span>By {note.user.email}</span>
                  <span className="mx-2">•</span>
                  <span>Created {formatDate(note.createdAt)}</span>
                  {note.updatedAt !== note.createdAt && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Updated {formatDate(note.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => setSelectedNote(note)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedNote.title}
                </h3>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>
              <div className="text-xs text-gray-500 border-t pt-4">
                <p>By {selectedNote.user.email}</p>
                <p>Created {formatDate(selectedNote.createdAt)}</p>
                {selectedNote.updatedAt !== selectedNote.createdAt && (
                  <p>Updated {formatDate(selectedNote.updatedAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
