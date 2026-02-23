import { useCallback, useRef, useState } from 'react'
import { ArrayOfObjectsInputProps, insert, PatchEvent, useClient } from 'sanity'

interface UploadItem {
  name: string
  status: 'uploading' | 'done' | 'error'
}

export function BulkImageUpload(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return

      setUploads(files.map((f) => ({ name: f.name, status: 'uploading' })))

      const results = await Promise.all(
        files.map(async (file, index) => {
          try {
            const asset = await client.assets.upload('image', file, {
              filename: file.name,
              contentType: file.type,
            })
            setUploads((prev) =>
              prev.map((u, i) => (i === index ? { ...u, status: 'done' } : u))
            )
            return {
              _type: 'image' as const,
              _key: crypto.randomUUID(),
              asset: { _type: 'reference' as const, _ref: asset._id },
            }
          } catch {
            setUploads((prev) =>
              prev.map((u, i) => (i === index ? { ...u, status: 'error' } : u))
            )
            return null
          }
        })
      )

      const newItems = results.filter(Boolean) as NonNullable<(typeof results)[number]>[]
      if (newItems.length > 0) {
        props.onChange(PatchEvent.from(insert(newItems, 'after', [-1])))
      }

      setTimeout(() => setUploads([]), 3000)
    },
    [client, props]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        uploadFiles(Array.from(e.target.files))
        e.target.value = ''
      }
    },
    [uploadFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const imageFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      )
      if (imageFiles.length) uploadFiles(imageFiles)
    },
    [uploadFiles]
  )

  const completedCount = uploads.filter((u) => u.status === 'done').length
  const errorCount = uploads.filter((u) => u.status === 'error').length
  const isUploading = uploads.some((u) => u.status === 'uploading')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: '8px',
          padding: '28px 20px',
          textAlign: 'center',
          backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDragging ? '#2563eb' : '#94a3b8'}
          strokeWidth="1.5"
          style={{ margin: '0 auto 10px', display: 'block' }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
          {isUploading ? `Uploading ${uploads.length} photo${uploads.length !== 1 ? 's' : ''}…` : 'Drop photos here or click to select'}
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          Select multiple files at once — all will be uploaded together
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Upload progress summary */}
      {uploads.length > 0 && (
        <div
          style={{
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            backgroundColor: '#fff',
            fontSize: '13px',
          }}
        >
          {isUploading ? (
            <span style={{ color: '#2563eb' }}>
              Uploading… {completedCount} / {uploads.length} done
            </span>
          ) : (
            <span style={{ color: errorCount > 0 ? '#dc2626' : '#16a34a', fontWeight: 500 }}>
              {completedCount} photo{completedCount !== 1 ? 's' : ''} uploaded
              {errorCount > 0 ? `, ${errorCount} failed` : ' successfully'}
            </span>
          )}
          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {uploads.map((u, i) => (
              <div
                key={i}
                style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}
              >
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '80%',
                  }}
                >
                  {u.name}
                </span>
                <span
                  style={{
                    color:
                      u.status === 'done'
                        ? '#16a34a'
                        : u.status === 'error'
                          ? '#dc2626'
                          : '#2563eb',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {u.status === 'done' ? 'Done' : u.status === 'error' ? 'Error' : 'Uploading'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Sanity array UI — keeps existing photo management intact */}
      {props.renderDefault(props)}
    </div>
  )
}
