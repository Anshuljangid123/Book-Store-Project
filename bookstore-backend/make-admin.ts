import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const updated = await prisma.user.updateMany({
    data: { role: 'ADMIN' }
  });

  console.log(`Successfully upgraded ${updated.count} users to ADMIN role.`);
  await app.close();
}

bootstrap().catch(console.error);
