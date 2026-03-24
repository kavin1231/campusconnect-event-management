import { useMemo, useState } from 'react'
import { Handshake, Plus } from 'lucide-react'
import sponsorshipSeed from '../../asset/json/sporsorship.json'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import SponsorshipForm from '../components/sponsorship/SponsorshipForm'
import SponsorshipTable from '../components/sponsorship/SponsorshipTable'
import { normalizeSponsorshipSeed } from '../utils/sponsorshipAdapters'

const INITIAL_SPONSORSHIPS = normalizeSponsorshipSeed(sponsorshipSeed)

export default function Sponsorship() {
  const [sponsorships, setSponsorships] = useState(INITIAL_SPONSORSHIPS)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSponsorship, setEditingSponsorship] = useState(null)

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return sponsorships
    }

    return sponsorships.filter((row) => {
      const byName = row.name.toLowerCase().includes(normalizedSearch)
      const byEvent = row.eventName.toLowerCase().includes(normalizedSearch)
      return byName || byEvent
    })
  }, [searchTerm, sponsorships])

  function openCreateModal() {
    setEditingSponsorship(null)
    setIsModalOpen(true)
  }

  function openEditModal(row) {
    setEditingSponsorship(row)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingSponsorship(null)
  }

  function handleSaveSponsorship(nextValues) {
    if (editingSponsorship) {
      setSponsorships((current) =>
        current.map((row) =>
          row.id === editingSponsorship.id
            ? {
                ...row,
                ...nextValues,
              }
            : row
        )
      )
    } else {
      setSponsorships((current) => {
        const nextId = current.length ? Math.max(...current.map((row) => row.id)) + 1 : 1
        return [...current, { id: nextId, ...nextValues }]
      })
    }

    closeModal()
  }

  function handleDeleteSponsorship(row) {
    const shouldDelete = window.confirm(`Delete sponsorship by "${row.name}"?`)
    if (!shouldDelete) {
      return
    }

    setSponsorships((current) => current.filter((item) => item.id !== row.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
            <Handshake size={22} className="text-secondary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Sponsorship Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track sponsor contributions and partnership records.</p>
          </div>
        </div>

        <Button onClick={openCreateModal} className="gap-2 self-start sm:self-auto">
          <Plus size={16} />
          <span>+ Add Sponsorship</span>
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <Input
          id="sponsorship-search"
          label="Search Sponsorships"
          placeholder="Search by sponsor or event name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <SponsorshipTable
        rows={filteredRows}
        onEdit={openEditModal}
        onDelete={handleDeleteSponsorship}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSponsorship ? 'Edit Sponsorship' : 'Add Sponsorship'}
      >
        <SponsorshipForm
          mode={editingSponsorship ? 'edit' : 'add'}
          initialValues={editingSponsorship}
          onSubmit={handleSaveSponsorship}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}
