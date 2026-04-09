import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

function addDetailLine(pdf, text, x, y, maxWidth) {
  const lines = pdf.splitTextToSize(text, maxWidth)
  pdf.text(lines, x, y)
  return y + lines.length * 6
}

export async function exportDashboardPdf({ targetElement, eventData }) {
  if (!targetElement || !eventData) {
    throw new Error('Missing dashboard content or event data for PDF export.')
  }

  const canvas = await html2canvas(targetElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  })

  const snapshot = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 12
  const printableWidth = pageWidth - margin * 2

  pdf.setFontSize(14)
  pdf.text('Event Dashboard Snapshot', margin, 12)

  const imageRatio = canvas.height / canvas.width
  const imageHeight = printableWidth * imageRatio
  const maxImageHeight = pageHeight - 24
  const fittedHeight = Math.min(imageHeight, maxImageHeight)

  pdf.addImage(snapshot, 'PNG', margin, 18, printableWidth, fittedHeight)

  pdf.addPage()
  pdf.setFontSize(16)
  pdf.text('Event Dashboard Details', margin, 14)

  pdf.setFontSize(11)
  let y = 24

  y = addDetailLine(pdf, `Event: ${eventData.event_name}`, margin, y, printableWidth)
  y = addDetailLine(pdf, `Date: ${eventData.date}`, margin, y, printableWidth)
  y = addDetailLine(pdf, `Time: ${eventData.start_time} - ${eventData.end_time}`, margin, y, printableWidth)
  y += 2

  y = addDetailLine(pdf, `Total Income: ${formatCurrency(eventData.total_income)}`, margin, y, printableWidth)
  y = addDetailLine(pdf, `Total Expenses: ${formatCurrency(eventData.total_expenses)}`, margin, y, printableWidth)
  y = addDetailLine(pdf, `Total Profit: ${formatCurrency(eventData.total_profit)}`, margin, y, printableWidth)
  y = addDetailLine(pdf, `Merchandise Income: ${formatCurrency(eventData.merchandise_income)}`, margin, y, printableWidth)
  y += 4

  pdf.setFontSize(12)
  pdf.text('Sponsors', margin, y)
  y += 6
  pdf.setFontSize(11)

  eventData.sponsors.forEach((sponsor, index) => {
    const line = `${index + 1}. ${sponsor.name} | Amount: ${formatCurrency(sponsor.amount)} | Profit Share: ${formatCurrency(sponsor.profit_share)}`
    y = addDetailLine(pdf, line, margin, y, printableWidth)
  })

  y += 4
  pdf.setFontSize(12)
  pdf.text('Vendors', margin, y)
  y += 6
  pdf.setFontSize(11)

  eventData.vendors.forEach((vendor, index) => {
    const line = `${index + 1}. ${vendor.name} | Stall: ${vendor.stall_id} | Fee: ${formatCurrency(vendor.fee)} | Profit: ${formatCurrency(vendor.profit)}`
    y = addDetailLine(pdf, line, margin, y, printableWidth)
  })

  y += 4
  pdf.setFontSize(12)
  pdf.text('Expenses', margin, y)
  y += 6
  pdf.setFontSize(11)

  Object.entries(eventData.expenses).forEach(([key, value]) => {
    y = addDetailLine(pdf, `${key}: ${formatCurrency(value)}`, margin, y, printableWidth)
  })

  const fileDate = new Date().toISOString().slice(0, 10)
  const fileName = `${eventData.event_name.replace(/\s+/g, '-').toLowerCase()}-dashboard-${fileDate}.pdf`
  pdf.save(fileName)
}
