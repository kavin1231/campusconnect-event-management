import prisma from '../prisma/client.js';

async function main() {
  const email = 'organizer@nexora.edu';
  console.log(`Checking for ${email} in Student table...`);
  
  try {
    const student = await prisma.student.findUnique({
      where: { email }
    });

    if (student) {
      console.log(`Found duplicate record in Student table with ID: ${student.id}. Deleting...`);
      await prisma.student.delete({
        where: { email }
      });
      console.log('Successfully deleted duplicate student record.');
    } else {
      console.log('No duplicate student record found in Student table.');
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      console.log(`Verified ${email} exists in User table with role: ${user.role}`);
    } else {
      console.log(`WARNING: ${email} NOT found in User table!`);
    }
  } catch (err) {
    console.error('Database operation failed:', err);
  }
}

main()
  .catch((e) => {
    console.error('Execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
