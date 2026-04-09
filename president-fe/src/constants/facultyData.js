import computingBanner from '../../asset/images/faculty/banners/computing-banner.svg'
import engineeringBanner from '../../asset/images/faculty/banners/engineering-banner.svg'
import businessBanner from '../../asset/images/faculty/banners/business-banner.svg'
import humanitiesBanner from '../../asset/images/faculty/banners/humanities-banner.svg'
import architectureBanner from '../../asset/images/faculty/banners/architecture-banner.svg'
import hospitalityBanner from '../../asset/images/faculty/banners/hospitality-banner.svg'
import headAvatar from '../../asset/images/faculty/people/head-avatar.svg'
import staffAvatar from '../../asset/images/faculty/people/staff-avatar.svg'

export const facultyList = [
  {
    slug: 'computing',
    name: 'Computing',
    shortDescription: 'Software engineering, AI, cloud systems, and digital innovation.',
    details: [
      'Industry-aligned software engineering tracks',
      'Applied AI and machine learning labs',
      'Cloud-native development and DevOps practices',
    ],
    bannerImage: computingBanner,
    theme: {
      ring: 'ring-sky-500/40',
      badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200',
      panel: 'bg-sky-50/70 dark:bg-sky-950/20',
      activeTab: 'bg-sky-600 text-white',
    },
    head: {
      image: headAvatar,
      name: 'Dr. Nadeesha Silva',
      designation: 'Head of Faculty - Computing',
    },
    staff: [
      { image: staffAvatar, name: 'Prof. A. Fernando', profession: 'Senior Lecturer - Software Engineering' },
      { image: staffAvatar, name: 'Dr. I. Rathnayake', profession: 'Lecturer - Data Science' },
      { image: staffAvatar, name: 'Ms. P. De Alwis', profession: 'Instructor - Full Stack Development' },
    ],
    events: [
      { id: 1, title: 'AI Research Forum', date: '2026-04-12', venue: 'Computing Auditorium', image: computingBanner },
      { id: 2, title: 'HackSprint Weekend', date: '2026-05-03', venue: 'Innovation Lab', image: computingBanner },
      { id: 3, title: 'Cloud Career Day', date: '2026-05-24', venue: 'Main Hall B', image: computingBanner },
    ],
  },
  {
    slug: 'engineering',
    name: 'Engineering',
    shortDescription: 'Design, robotics, manufacturing, and sustainable systems.',
    details: [
      'Hands-on mechanical and electrical workshops',
      'Smart systems and automation projects',
      'Sustainable infrastructure design initiatives',
    ],
    bannerImage: engineeringBanner,
    theme: {
      ring: 'ring-orange-500/40',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200',
      panel: 'bg-orange-50/70 dark:bg-orange-950/20',
      activeTab: 'bg-orange-600 text-white',
    },
    head: {
      image: headAvatar,
      name: 'Prof. Dilan Peris',
      designation: 'Head of Faculty - Engineering',
    },
    staff: [
      { image: staffAvatar, name: 'Dr. R. Gunawardena', profession: 'Senior Lecturer - Mechatronics' },
      { image: staffAvatar, name: 'Eng. S. Lakmali', profession: 'Lecturer - Civil Engineering' },
      { image: staffAvatar, name: 'Mr. H. Weerasekara', profession: 'Instructor - Electronics Lab' },
    ],
    events: [
      { id: 1, title: 'Robotics Challenge', date: '2026-04-18', venue: 'Engineering Arena', image: engineeringBanner },
      { id: 2, title: 'Bridge Design Expo', date: '2026-05-10', venue: 'Design Studio', image: engineeringBanner },
      { id: 3, title: 'Industry Connect Day', date: '2026-06-02', venue: 'Conference Wing', image: engineeringBanner },
    ],
  },
  {
    slug: 'business',
    name: 'Business',
    shortDescription: 'Leadership, entrepreneurship, finance, and global strategy.',
    details: [
      'Startup incubation and venture mentorship',
      'Corporate strategy and case-based learning',
      'Finance, analytics, and decision intelligence',
    ],
    bannerImage: businessBanner,
    theme: {
      ring: 'ring-emerald-500/40',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
      panel: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      activeTab: 'bg-emerald-600 text-white',
    },
    head: {
      image: headAvatar,
      name: 'Dr. Kavisha Rodrigo',
      designation: 'Head of Faculty - Business',
    },
    staff: [
      { image: staffAvatar, name: 'Prof. M. Jayasekara', profession: 'Senior Lecturer - Finance' },
      { image: staffAvatar, name: 'Ms. R. Peiris', profession: 'Lecturer - Marketing' },
      { image: staffAvatar, name: 'Dr. T. Manamperi', profession: 'Lecturer - Entrepreneurship' },
    ],
    events: [
      { id: 1, title: 'Startup Pitch Fest', date: '2026-04-22', venue: 'Business Hall', image: businessBanner },
      { id: 2, title: 'Leaders Roundtable', date: '2026-05-15', venue: 'Boardroom Complex', image: businessBanner },
      { id: 3, title: 'Investment Clinic', date: '2026-06-05', venue: 'Seminar Room 2', image: businessBanner },
    ],
  },
  {
    slug: 'humanities-science',
    name: 'Humanities & Science',
    shortDescription: 'Human-centered thinking combined with scientific inquiry.',
    details: [
      'Interdisciplinary social and behavioral studies',
      'Applied environmental and life science research',
      'Ethics, communication, and policy analysis',
    ],
    bannerImage: humanitiesBanner,
    theme: {
      ring: 'ring-indigo-500/40',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200',
      panel: 'bg-indigo-50/70 dark:bg-indigo-950/20',
      activeTab: 'bg-indigo-600 text-white',
    },
    head: {
      image: headAvatar,
      name: 'Prof. Shenali Abeywickrama',
      designation: 'Head of Faculty - Humanities & Science',
    },
    staff: [
      { image: staffAvatar, name: 'Dr. P. Abeysinghe', profession: 'Senior Lecturer - Psychology' },
      { image: staffAvatar, name: 'Dr. N. Hettiarachchi', profession: 'Lecturer - Environmental Science' },
      { image: staffAvatar, name: 'Ms. D. Samaraweera', profession: 'Lecturer - Communication Studies' },
    ],
    events: [
      { id: 1, title: 'Science Discovery Day', date: '2026-04-10', venue: 'Science Pavilion', image: humanitiesBanner },
      { id: 2, title: 'Society and Ethics Forum', date: '2026-05-08', venue: 'Lecture Theater 1', image: humanitiesBanner },
      { id: 3, title: 'Research Poster Night', date: '2026-05-29', venue: 'North Gallery', image: humanitiesBanner },
    ],
  },
  {
    slug: 'architecture',
    name: 'Architecture',
    shortDescription: 'Spatial design, urban systems, and sustainable built environments.',
    details: [
      'Studio-based architectural practice modules',
      'Urban planning and community-led design',
      'Heritage and climate-resilient construction methods',
    ],
    bannerImage: architectureBanner,
    theme: {
      ring: 'ring-amber-500/40',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
      panel: 'bg-amber-50/70 dark:bg-amber-950/20',
      activeTab: 'bg-amber-600 text-white',
    },
    head: {
      image: headAvatar,
      name: 'Ar. Dineth Ranasinghe',
      designation: 'Head of Faculty - Architecture',
    },
    staff: [
      { image: staffAvatar, name: 'Ar. M. Gunasekara', profession: 'Senior Lecturer - Urban Design' },
      { image: staffAvatar, name: 'Ms. S. Alahakoon', profession: 'Lecturer - Sustainable Architecture' },
      { image: staffAvatar, name: 'Ar. K. Ihalage', profession: 'Studio Instructor - Design Practice' },
    ],
    events: [
      { id: 1, title: 'Design Crit Week', date: '2026-04-28', venue: 'Architecture Studios', image: architectureBanner },
      { id: 2, title: 'Urban Futures Dialogue', date: '2026-05-19', venue: 'City Lab', image: architectureBanner },
      { id: 3, title: 'Sustainable Build Expo', date: '2026-06-07', venue: 'Exhibition Court', image: architectureBanner },
    ],
  },
  {
    slug: 'hospitality-culinary',
    name: 'Hospitality & Culinary',
    shortDescription: 'Hospitality leadership, culinary creativity, and service excellence.',
    details: [
      'Professional kitchen and culinary arts training',
      'Hospitality operations and guest experience',
      'Event catering and service innovation programs',
    ],
    bannerImage: hospitalityBanner,
    theme: {
      ring: 'ring-rose-500/40',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
      panel: 'bg-rose-50/70 dark:bg-rose-950/20',
      activeTab: 'bg-rose-600 text-white',
    },
    head: {
      image: headAvatar,
      name: 'Chef Malintha Fernando',
      designation: 'Head of Faculty - Hospitality & Culinary',
    },
    staff: [
      { image: staffAvatar, name: 'Chef I. Perera', profession: 'Senior Lecturer - Culinary Arts' },
      { image: staffAvatar, name: 'Ms. A. Wijesinghe', profession: 'Lecturer - Hospitality Management' },
      { image: staffAvatar, name: 'Mr. R. Jayawardene', profession: 'Instructor - Food Service Operations' },
    ],
    events: [
      { id: 1, title: 'Campus Food Showcase', date: '2026-04-16', venue: 'Culinary Theater', image: hospitalityBanner },
      { id: 2, title: 'Hospitality Leaders Talk', date: '2026-05-11', venue: 'Grand Ballroom', image: hospitalityBanner },
      { id: 3, title: 'Service Excellence Week', date: '2026-06-01', venue: 'Training Suite', image: hospitalityBanner },
    ],
  },
]