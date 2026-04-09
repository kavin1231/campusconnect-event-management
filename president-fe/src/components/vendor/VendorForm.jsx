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
const VENDOR_NAME_MAX_LENGTH = 80
const EVENT_NAME_MAX_LENGTH = 120

function normalizeContact(value) {
  return value.replace(/[\s-]/g, '')
}

function validateField(field, values, allowedStallIds) {
  if (field === 'name') {
    const name = values.name.trim()
    if (!name) {
      return 'Name is required'
    }

    if (name.length > VENDOR_NAME_MAX_LENGTH) {
      return `Name should be ${VENDOR_NAME_MAX_LENGTH} characters or less`
    }

    return ''
  }

  if (field === 'stallId') {
    if (!values.stallId || !allowedStallIds.has(values.stallId)) {
      return 'Please select a valid stall'
    }

    return ''
  }

  if (field === 'contactNumber') {
    const rawContact = values.contactNumber.trim()
    const normalizedContact = normalizeContact(rawContact)

    if (!rawContact) {
      return 'Contact number is required'
    }

    if (!CONTACT_REGEX.test(normalizedContact)) {
      return 'Use +94XXXXXXXXX or 0XXXXXXXXX format'
    }

    return ''
  }

  if (field === 'eventName') {
    const eventName = values.eventName.trim()
    if (!eventName) {
      return 'Event name is required'
    }

    if (eventName.length > EVENT_NAME_MAX_LENGTH) {
      return `Event name should be ${EVENT_NAME_MAX_LENGTH} characters or less`
    }

    return ''
  }

  if (field === 'fee') {
    const numericFee = Number(values.fee)
    if (!Number.isFinite(numericFee) || numericFee <= 0) {
      return 'Fee must be a positive number'
    }

    return ''
  }

  return ''
}

function validate(values, allowedStallIds) {
  const errors = {}

  ;['name', 'stallId', 'contactNumber', 'eventName', 'fee'].forEach((field) => {
    const message = validateField(field, values, allowedStallIds)
    if (message) {
      errors[field] = message
    }
  })

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

  function handleFieldBlur(field) {
    const message = validateField(field, values, allowedStallIds)
    setErrors((prev) => ({ ...prev, [field]: message }))
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
        onBlur={() => handleFieldBlur('name')}
        maxLength={VENDOR_NAME_MAX_LENGTH}
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
        onBlur={() => handleFieldBlur('contactNumber')}
        maxLength={16}
        inputMode="tel"
        error={errors.contactNumber}
        placeholder="+94771234567"
        required
      />

      <Input
        id="vendor-event"
        label="Event Name"
        value={values.eventName}
        onChange={(event) => updateField('eventName', event.target.value)}
        onBlur={() => handleFieldBlur('eventName')}
        maxLength={EVENT_NAME_MAX_LENGTH}
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
        onBlur={() => handleFieldBlur('fee')}
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
