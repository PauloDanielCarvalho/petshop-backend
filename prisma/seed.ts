import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // 🧹 Limpar dados existentes
  await prisma.appointment.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // 🔐 Hash de senhas
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 👥 Criar usuários mock
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Oliveira',
        email: 'carlos@exemplo.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana@exemplo.com',
        password: hashedPassword,
      },
    }),
  ]);

  console.log('👥 Usuários criados:', users.length);

  // 🐕 Criar pets mock
  const pets = await Promise.all([
    // Pets do João
    prisma.pet.create({
      data: {
        name: 'Rex',
        species: 'Cão',
        breed: 'Labrador',
        age: 3,
        userId: users[0].id,
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Bella',
        species: 'Cão',
        breed: 'Golden Retriever',
        age: 5,
        userId: users[0].id,
      },
    }),
    
    // Pets da Maria
    prisma.pet.create({
      data: {
        name: 'Mimi',
        species: 'Gato',
        breed: 'Siamês',
        age: 2,
        userId: users[1].id,
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Garfield',
        species: 'Gato',
        breed: 'Persa',
        age: 4,
        userId: users[1].id,
      },
    }),

    // Pets do Carlos
    prisma.pet.create({
      data: {
        name: 'Max',
        species: 'Cão',
        breed: 'Pastor Alemão',
        age: 6,
        userId: users[2].id,
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Luna',
        species: 'Gato',
        breed: 'Maine Coon',
        age: 1,
        userId: users[2].id,
      },
    }),

    // Pets da Ana
    prisma.pet.create({
      data: {
        name: 'Thor',
        species: 'Cão',
        breed: 'Rottweiler',
        age: 4,
        userId: users[3].id,
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Lola',
        species: 'Cão',
        breed: 'Poodle',
        age: 2,
        userId: users[3].id,
      },
    }),
  ]);

  console.log('🐕 Pets criados:', pets.length);

  // 📅 Criar agendamentos mock
  const appointments = await Promise.all([
    // Agendamentos futuros
    prisma.appointment.create({
      data: {
        date: new Date('2025-01-15T10:00:00Z'),
        reason: 'Consulta de rotina e vacinas',
        status: 'PENDING',
        petId: pets[0].id, // Rex
        userId: users[0].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2025-01-20T14:30:00Z'),
        reason: 'Exame dermatológico',
        status: 'CONFIRMED',
        petId: pets[2].id, // Mimi
        userId: users[1].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2025-01-25T09:15:00Z'),
        reason: 'Castração',
        status: 'PENDING',
        petId: pets[4].id, // Max
        userId: users[2].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2025-02-01T16:00:00Z'),
        reason: 'Consulta pós-operatória',
        status: 'PENDING',
        petId: pets[6].id, // Thor
        userId: users[3].id,
      },
    }),

    // Agendamentos históricos (passados)
    prisma.appointment.create({
      data: {
        date: new Date('2024-12-01T11:00:00Z'),
        reason: 'Vacinação anual',
        status: 'COMPLETED',
        petId: pets[1].id, // Bella
        userId: users[0].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2024-11-15T15:30:00Z'),
        reason: 'Limpeza dental',
        status: 'COMPLETED',
        petId: pets[3].id, // Garfield
        userId: users[1].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2024-10-20T08:45:00Z'),
        reason: 'Exame de sangue',
        status: 'CANCELLED',
        petId: pets[5].id, // Luna
        userId: users[2].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2024-12-10T13:00:00Z'),
        reason: 'Tosa e banho',
        status: 'COMPLETED',
        petId: pets[7].id, // Lola
        userId: users[3].id,
      },
    }),
  ]);

  console.log('📅 Agendamentos criados:', appointments.length);

  // 📊 Resumo dos dados criados
  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   👥 ${users.length} usuários`);
  console.log(`   🐕 ${pets.length} pets`);
  console.log(`   📅 ${appointments.length} agendamentos`);
  
  console.log('\n🔑 Credenciais de teste:');
  users.forEach(user => {
    console.log(`   📧 ${user.email} | 🔒 123456`);
  });

  console.log('\n💡 Dica: Use essas credenciais para fazer login na API!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 