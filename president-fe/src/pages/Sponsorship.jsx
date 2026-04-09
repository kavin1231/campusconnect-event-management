import { useMemo, useState } from 'react'
import { ArrowUpDown, Handshake, Plus } from 'lucide-react'
import sponsorshipSeed from '../../asset/json/sporsorship.json'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import SponsorshipForm from '../components/sponsorship/SponsorshipForm'
import SponsorshipTable from '../components/sponsorship/SponsorshipTable'
import useSortedRecords from '../hooks/useSortedRecords'
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

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords,
  } = useSortedRecords(filteredRows, 'date', 'desc')

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
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="sponsorship-search"
            label="Search Sponsorships"
            placeholder="Search by sponsor or event name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="grid gap-2 sm:grid-cols-2 sm:items-end">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-900 dark:text-white"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="name">Sponsor Name</option>
              </select>
            </label>
            <Button variant="secondary" className="gap-2" onClick={toggleDirection}>
              <ArrowUpDown size={15} />
              {sortDirection === 'desc' ? 'Descending' : 'Ascending'}
            </Button>
          </div>
        </div>
      </div>

      <SponsorshipTable
        rows={sortedRecords}
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
