import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const DEFAULT_VALUES = {
  name: '',
  amount: '',
  eventName: '',
  contact: '',
  date: '',
  remark: '',
}

const CONTACT_PATTERN = /^\+?[\d\s-]{7,20}$/
const SPONSOR_NAME_MAX_LENGTH = 80
const EVENT_NAME_MAX_LENGTH = 120
const REMARK_MAX_LENGTH = 200

function normalizeContact(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function validateField(field, values) {
  if (field === 'name') {
    const name = values.name.trim()
    if (!name) {
      return 'Sponsor name is required'
    }

    if (name.length > SPONSOR_NAME_MAX_LENGTH) {
      return `Sponsor name should be ${SPONSOR_NAME_MAX_LENGTH} characters or less`
    }

    return ''
  }

  if (field === 'amount') {
    const amountValue = Number(values.amount)
    if (!Number.isInteger(amountValue) || amountValue <= 0) {
      return 'Amount must be a positive integer'
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

  if (field === 'contact') {
    const contactValue = normalizeContact(values.contact)
    if (!contactValue) {
      return 'Contact is required'
    }

    if (!CONTACT_PATTERN.test(contactValue)) {
      return 'Use a valid phone format (digits, spaces, and optional +)'
    }

    return ''
  }

  if (field === 'date') {
    if (!values.date) {
      return 'Date is required'
    }

    if (Number.isNaN(Date.parse(values.date))) {
      return 'Date is invalid'
    }

    return ''
  }

  if (field === 'remark') {
    if (values.remark.length > REMARK_MAX_LENGTH) {
      return `Remark should be ${REMARK_MAX_LENGTH} characters or less`
    }

    return ''
  }

  return ''
}

function validate(values) {
  const errors = {}

  ;['name', 'amount', 'eventName', 'contact', 'date', 'remark'].forEach((field) => {
    const message = validateField(field, values)
    if (message) {
      errors[field] = message
    }
  })

  return errors
}

export default function SponsorshipForm({ mode = 'add', initialValues, onSubmit, onCancel }) {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues({
      name: initialValues?.name ?? DEFAULT_VALUES.name,
      amount: String(initialValues?.amount ?? DEFAULT_VALUES.amount),
      eventName: initialValues?.eventName ?? DEFAULT_VALUES.eventName,
      contact: initialValues?.contact ?? DEFAULT_VALUES.contact,
      date: initialValues?.date ?? DEFAULT_VALUES.date,
      remark: initialValues?.remark ?? DEFAULT_VALUES.remark,
    })
    setErrors({})
  }, [initialValues])

  function updateField(field, nextValue) {
    setValues((prev) => ({ ...prev, [field]: nextValue }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleFieldBlur(field) {
    const message = validateField(field, values)
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      name: values.name.trim(),
      amount: Number(values.amount),
      eventName: values.eventName.trim(),
      contact: normalizeContact(values.contact),
      date: values.date,
      remark: values.remark.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="sponsor-name"
        label="Sponsor Name"
        value={values.name}
        onChange={(event) => updateField('name', event.target.value)}
        onBlur={() => handleFieldBlur('name')}
        maxLength={SPONSOR_NAME_MAX_LENGTH}
        error={errors.name}
        required
      />

      <Input
        id="sponsor-amount"
        label="Amount"
        type="number"
        min="1"
        step="1"
        value={values.amount}
        onChange={(event) => updateField('amount', event.target.value)}
        onBlur={() => handleFieldBlur('amount')}
        error={errors.amount}
        required
      />

      <Input
        id="sponsor-event"
        label="Event Name"
        value={values.eventName}
        onChange={(event) => updateField('eventName', event.target.value)}
        onBlur={() => handleFieldBlur('eventName')}
        maxLength={EVENT_NAME_MAX_LENGTH}
        error={errors.eventName}
        required
      />

      <Input
        id="sponsor-contact"
        label="Contact"
        value={values.contact}
        onChange={(event) => updateField('contact', event.target.value)}
        onBlur={() => handleFieldBlur('contact')}
        maxLength={20}
        inputMode="tel"
        error={errors.contact}
        placeholder="+94 77 100 2000"
        required
      />

      <Input
        id="sponsor-date"
        label="Date"
        type="date"
        value={values.date}
        onChange={(event) => updateField('date', event.target.value)}
        onBlur={() => handleFieldBlur('date')}
        error={errors.date}
        required
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="sponsor-remark" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Remark
        </label>
        <textarea
          id="sponsor-remark"
          rows={3}
          value={values.remark}
          onChange={(event) => updateField('remark', event.target.value)}
          onBlur={() => handleFieldBlur('remark')}
          maxLength={REMARK_MAX_LENGTH}
          className={`
            w-full rounded-md border px-3 py-2 text-sm
            bg-white dark:bg-primary-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-transparent focus:outline-none focus:ring-2 focus:ring-secondary-500
            ${errors.remark ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-primary-700'}
          `}
          placeholder="Optional notes"
        />
        {errors.remark ? <p className="text-xs text-red-600 dark:text-red-400">{errors.remark}</p> : null}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === 'edit' ? 'Update Sponsorship' : 'Add Sponsorship'}</Button>
      </div>
    </form>
  )
}
