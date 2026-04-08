import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString =
      'postgresql://neondb_owner:npg_FrYLga6mG1ZD@ep-tiny-sky-a841s6uf-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';
    const pool = new Pool({ connectionString });
    const pgAdapter = new PrismaPg(pool);
    super({ adapter: pgAdapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
