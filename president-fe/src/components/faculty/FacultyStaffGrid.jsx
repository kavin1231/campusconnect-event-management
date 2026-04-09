import FacultyPersonCard from './FacultyPersonCard'

export default function FacultyStaffGrid({ staff, ringClass }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {staff.map((member) => (
        <FacultyPersonCard key={`${member.name}-${member.profession}`} person={member} ringClass={ringClass} />
      ))}
    </div>
  )
}
