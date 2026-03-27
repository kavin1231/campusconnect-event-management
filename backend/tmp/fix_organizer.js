import prisma from '../prisma/client.js';

async function main() {
  const email = 'organizer@nexora.edu';
  console.log(`Fixing role for ${email}...`);
  
  // 1. Update User table
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'EVENT_ORGANIZER' }
  });
  console.log('Updated User table role to:', updatedUser.role);

  // 2. Double check Student table
  const student = await prisma.student.findUnique({
    where: { email }
  });
  
  if (student) {
    console.log('Found persistent Student record. Deleting...');
    await prisma.student.delete({ where: { email } });
  } else {
    console.log('No Student record found (Good).');
  }

  console.log('Role correction complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
