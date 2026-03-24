import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import StallSearchSelect from './StallSearchSelect'

const DEFAULT_VALUES = {
  name: '',
  stallId: null,
  contactNumber: '',
  eventName: '',
  fee: '',
}

const CONTACT_REGEX = /^(?:\+94\d{9}|0\d{9})$/

function normalizeContact(value) {
  return value.replace(/[\s-]/g, '')
}

function validate(values, allowedStallIds) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!values.stallId || !allowedStallIds.has(values.stallId)) {
    errors.stallId = 'Please select a valid stall'
  }

  const normalizedContact = normalizeContact(values.contactNumber.trim())
  if (!values.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required'
  } else if (!CONTACT_REGEX.test(normalizedContact)) {
    errors.contactNumber = 'Use +94XXXXXXXXX or 0XXXXXXXXX format'
  }

  if (!values.eventName.trim()) {
    errors.eventName = 'Event name is required'
  }

  const numericFee = Number(values.fee)
  if (!Number.isFinite(numericFee) || numericFee <= 0) {
    errors.fee = 'Fee must be a positive number'
  }

  return errors
}

export default function VendorForm({ mode = 'add', initialValues, stalls, onCancel, onSubmit }) {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [errors, setErrors] = useState({})

  const allowedStallIds = useMemo(() => new Set(stalls.map((stall) => stall.id)), [stalls])

  useEffect(() => {
    setValues({
      name: initialValues?.name ?? DEFAULT_VALUES.name,
      stallId: initialValues?.stallId ?? DEFAULT_VALUES.stallId,
      contactNumber: initialValues?.contactNumber ?? DEFAULT_VALUES.contactNumber,
      eventName: initialValues?.eventName ?? DEFAULT_VALUES.eventName,
      fee: String(initialValues?.fee ?? DEFAULT_VALUES.fee),
    })
    setErrors({})
  }, [initialValues])

  function updateField(field, nextValue) {
    setValues((prev) => ({ ...prev, [field]: nextValue }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(values, allowedStallIds)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      name: values.name.trim(),
      stallId: values.stallId,
      contactNumber: normalizeContact(values.contactNumber.trim()),
      eventName: values.eventName.trim(),
      fee: Number(values.fee),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="vendor-name"
        label="Name"
        value={values.name}
        onChange={(event) => updateField('name', event.target.value)}
        error={errors.name}
        required
      />

      <StallSearchSelect
        id="vendor-stall"
        label="Stall"
        value={values.stallId}
        options={stalls}
        error={errors.stallId}
        onChange={(value) => updateField('stallId', value)}
        placeholder="Search stall by name or id"
      />

      <Input
        id="vendor-contact"
        label="Contact Number"
        value={values.contactNumber}
        onChange={(event) => updateField('contactNumber', event.target.value)}
        error={errors.contactNumber}
        placeholder="+94771234567"
        required
      />

      <Input
        id="vendor-event"
        label="Event Name"
        value={values.eventName}
        onChange={(event) => updateField('eventName', event.target.value)}
        error={errors.eventName}
        required
      />

      <Input
        id="vendor-fee"
        label="Fee"
        type="number"
        min="1"
        step="1"
        value={values.fee}
        onChange={(event) => updateField('fee', event.target.value)}
        error={errors.fee}
        required
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === 'edit' ? 'Update Vendor' : 'Add Vendor'}</Button>
      </div>
    </form>
  )
}
