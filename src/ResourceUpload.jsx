import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'

export default function ResourceUpload({ onUploaded }) {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [courseName, setCourseName] = useState('')
  const [year, setYear] = useState('')
  const [resourceType, setResourceType] = useState('test')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) {
      setError('Please choose a file.')
      return
    }

    setUploading(true)
    setError(null)

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath)

    const { error: insertError } = await supabase.from('resources').insert({
      uploaded_by: user.id,
      title,
      course_name: courseName,
      year: year ? parseInt(year) : null,
      resource_type: resourceType,
      file_url: urlData.publicUrl,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setFile(null)
      setTitle('')
      setCourseName('')
      setYear('')
      setResourceType('test')
      if (onUploaded) onUploaded()
    }

    setUploading(false)
  }

  return (
    <div className="dialogue-box" style={{ marginBottom: '24px' }}>
      <div className="dialogue-header" style={{ background: 'var(--surface-hover)', color: 'var(--teal)', borderBottom: '3px solid var(--border)' }}>
        📤 UPLOAD A RESOURCE
      </div>
      <div className="corner" style={{ top: -3, left: -3 }} />
      <div className="corner" style={{ top: -3, right: -3 }} />
      <div className="corner" style={{ bottom: -3, left: -3 }} />
      <div className="corner" style={{ bottom: -3, right: -3 }} />

      <form onSubmit={handleUpload} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />

        <input
          type="text"
          placeholder="Title (e.g. Midterm Exam)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Year (optional)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
          <option value="test">Test</option>
          <option value="worksheet">Worksheet</option>
          <option value="notes">Notes</option>
          <option value="other">Other</option>
        </select>

        {error && <p style={{ color: 'var(--red)', fontFamily: 'VT323, monospace' }}>{error}</p>}

        <button type="submit" disabled={uploading} style={{ alignSelf: 'flex-start' }}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}