import { useCallback, useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { formatDateTime } from '@/lib/utils'

interface PastEvent {
  _id: string
  title: string
  startDateTime: string
  location?: string
}

const PAST_EVENTS_QUERY = `*[_type == "event" && startDateTime < now()] | order(startDateTime desc){
  _id, title, startDateTime, location
}`

export function BulkDeletePastEvents() {
  const client = useClient({ apiVersion: '2024-01-01' })

  const [events, setEvents] = useState<PastEvent[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [summary, setSummary] = useState<{ deleted: number; failed: number } | null>(null)

  const load = useCallback(() => {
    setLoadError(null)
    client
      .fetch<PastEvent[]>(PAST_EVENTS_QUERY)
      .then((result) => {
        setEvents(result)
        // Deleted rows are removed from the list on reload, so anything left
        // selected that's no longer present would be a stale reference.
        setSelected(
          (prev) => new Set(Array.from(prev).filter((id) => result.some((e) => e._id === id)))
        )
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : String(err)))
  }, [client])

  useEffect(() => {
    load()
  }, [load])

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = events !== null && events.length > 0 && selected.size === events.length
  const toggleAll = () => {
    if (!events) return
    setSelected(allSelected ? new Set() : new Set(events.map((e) => e._id)))
  }

  const handleDelete = async () => {
    const ids = Array.from(selected)
    if (ids.length === 0) return

    const ok = window.confirm(
      `Delete ${ids.length} event${ids.length !== 1 ? 's' : ''}? This cannot be undone.`
    )
    if (!ok) return

    setDeleting(true)
    setSummary(null)

    const results = await Promise.allSettled(ids.map((id) => client.delete(id)))
    const failedIds = ids.filter((_, i) => results[i].status === 'rejected')

    setSummary({ deleted: ids.length - failedIds.length, failed: failedIds.length })
    setSelected(new Set(failedIds)) // leave failures selected so a retry is one click
    setDeleting(false)
    load() // drop the successfully-deleted rows from the list
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
        Bulk Delete Past Events
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
        Events with a start date before today. The website already hides these from visitors on
        its own — this is only for clearing them out of the Studio. Deleting here is permanent
        and cannot be undone.
      </p>

      {loadError && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: '13px',
          }}
        >
          Couldn&apos;t load past events: {loadError}
        </div>
      )}

      {summary && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: `1px solid ${summary.failed > 0 ? '#fecaca' : '#bbf7d0'}`,
            backgroundColor: summary.failed > 0 ? '#fef2f2' : '#f0fdf4',
            color: summary.failed > 0 ? '#dc2626' : '#16a34a',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Deleted {summary.deleted} event{summary.deleted !== 1 ? 's' : ''}
          {summary.failed > 0
            ? `. ${summary.failed} failed — still selected below, try again.`
            : '.'}
        </div>
      )}

      {events === null && !loadError && (
        <p style={{ fontSize: '13px', color: '#64748b' }}>Loading…</p>
      )}

      {events !== null && events.length === 0 && (
        <p style={{ fontSize: '13px', color: '#64748b' }}>
          No past events — you&apos;re all caught up.
        </p>
      )}

      {events !== null && events.length > 0 && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '4px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              Select all
            </label>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {selected.size} of {events.length} selected
            </span>
          </div>

          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {events.map((event) => (
              <label
                key={event._id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.has(event._id)}
                  onChange={() => toggleOne(event._id)}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {formatDateTime(event.startDateTime)}
                    {event.location ? ` · ${event.location}` : ''}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={selected.size === 0 || deleting}
            style={{
              marginTop: '20px',
              padding: '9px 18px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: selected.size === 0 || deleting ? '#fca5a5' : '#dc2626',
              cursor: selected.size === 0 || deleting ? 'not-allowed' : 'pointer',
            }}
          >
            {deleting ? 'Deleting…' : `Delete Selected (${selected.size})`}
          </button>
        </>
      )}
    </div>
  )
}
