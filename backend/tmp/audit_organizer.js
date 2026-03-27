import prisma from '../prisma/client.js';

async function main() {
  const email = 'organizer@nexora.edu';
  console.log(`Deep Audit for ${email}:`);
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  console.log('User Table Record:', JSON.stringify(user, null, 2));

  const student = await prisma.student.findUnique({
    where: { email }
  });
  console.log('Student Table Record:', JSON.stringify(student, null, 2));

  // Check if there's any other linked record that might override role
  if (user?.role === 'STUDENT') {
    console.log('CRITICAL: User is EXPLICITLY marked as STUDENT in User table.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
