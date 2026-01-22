import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

// 1. Configura a conexão com o PostgreSQL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// 2. Inicia o Prisma 7 com o adaptador (única forma que não dá erro de URL)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando Seed no padrão Prisma 7...')

  await prisma.game.deleteMany()
  await prisma.category.deleteMany()

  const action = await prisma.category.create({ data: { name: 'Ação' } })
  const rpg = await prisma.category.create({ data: { name: 'RPG' } })

  await prisma.game.createMany({
    data: [
      {
        title: 'Elden Ring',
        description: 'Um RPG de ação épico.',
        price: 249.90,
        thumbnail: 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aajm8sYvSduBy96Tidm6mX7V.png',
        stock: 50,
        platform: 'PC / PS5 / Xbox',
        categoryId: rpg.id
      },
      {
        title: 'GTA V',
        description: 'Mundo aberto clássico.',
        price: 99.00,
        thumbnail: 'https://image.api.playstation.com/vulcan/ap/rnd/202202/2815/Id6KmoX8v0mQ1UvKkM9kX7V.png',
        stock: 100,
        platform: 'PC / PS5',
        categoryId: action.id
      }
    ]
  })

  console.log('✅ Banco de dados populado!')
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })