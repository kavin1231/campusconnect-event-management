import { useMemo, useState } from 'react'
import { ArrowUpDown, Plus, Store } from 'lucide-react'
import seedVendors from '../../asset/json/vendor.json'
import stallData from '../../asset/json/stall.json'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import VendorForm from '../components/vendor/VendorForm'
import VendorTable from '../components/vendor/VendorTable'
import useSortedRecords from '../hooks/useSortedRecords'
import { normalizeVendorSeed, getSelectableStalls } from '../utils/vendorAdapters'

const INITIAL_VENDORS = normalizeVendorSeed(seedVendors)

export default function Vendor() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)

  const filteredVendors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return vendors
    }

    return vendors.filter((vendor) => {
      const nameMatch = vendor.name.toLowerCase().includes(normalizedSearch)
      const eventNameMatch = vendor.eventName.toLowerCase().includes(normalizedSearch)
      return nameMatch || eventNameMatch
    })
  }, [searchTerm, vendors])

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords,
  } = useSortedRecords(filteredVendors, 'name', 'asc')

  const selectableStalls = useMemo(
    () => getSelectableStalls(stallData, vendors, editingVendor),
    [vendors, editingVendor]
  )

  function openCreateModal() {
    setEditingVendor(null)
    setIsModalOpen(true)
  }

  function openEditModal(vendor) {
    setEditingVendor(vendor)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingVendor(null)
  }

  function handleSaveVendor(nextValues) {
    if (editingVendor) {
      setVendors((current) =>
        current.map((vendor) =>
          vendor.id === editingVendor.id
            ? {
                ...vendor,
                ...nextValues,
              }
            : vendor
        )
      )
    } else {
      setVendors((current) => {
        const nextId = current.length ? Math.max(...current.map((vendor) => vendor.id)) + 1 : 1
        return [...current, { id: nextId, ...nextValues }]
      })
    }

    closeModal()
  }

  function handleDeleteVendor(vendor) {
    const shouldDelete = window.confirm(`Delete vendor "${vendor.name}"?`)
    if (!shouldDelete) {
      return
    }

    setVendors((current) => current.filter((item) => item.id !== vendor.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
            <Store size={22} className="text-secondary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Vendor Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage vendor registrations and stall assignments.</p>
          </div>
        </div>

        <Button onClick={openCreateModal} className="gap-2 self-start sm:self-auto">
          <Plus size={16} />
          <span>Add Vendor</span>
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="vendor-search"
            label="Search Vendors"
            placeholder="Search by name or event name"
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
                <option value="name">Name</option>
                <option value="eventName">Event Name</option>
                <option value="fee">Fee</option>
              </select>
            </label>
            <Button variant="secondary" className="gap-2" onClick={toggleDirection}>
              <ArrowUpDown size={15} />
              {sortDirection === 'desc' ? 'Descending' : 'Ascending'}
            </Button>
          </div>
        </div>
      </div>

      <VendorTable
        vendors={sortedRecords}
        stalls={stallData}
        onEdit={openEditModal}
        onDelete={handleDeleteVendor}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
      >
        <VendorForm
          mode={editingVendor ? 'edit' : 'add'}
          initialValues={editingVendor}
          stalls={selectableStalls}
          onCancel={closeModal}
          onSubmit={handleSaveVendor}
        />
      </Modal>
    </div>
  )
}
