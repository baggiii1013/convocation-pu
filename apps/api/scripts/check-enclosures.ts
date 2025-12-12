import { PrismaClient } from '../prisma/generated/client/index.js';
const prisma = new PrismaClient();

async function main() {
  // Total students in database
  const total = await prisma.attendee.count();
  
  // Total with enclosure A
  const enclosureA = await prisma.attendee.count({
    where: { assignedEnclosure: 'A' }
  });
  
  // Check all enclosure variations
  const variations = await prisma.attendee.groupBy({
    by: ['assignedEnclosure'],
    _count: true,
    orderBy: { _count: { assignedEnclosure: 'desc' } }
  });
  
  console.log('Total attendees in database:', total);
  console.log('Attendees with enclosure A:', enclosureA);
  console.log('\nAll enclosure assignments:');
  variations.forEach(v => {
    console.log(`  "${v.assignedEnclosure}": ${v._count}`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
