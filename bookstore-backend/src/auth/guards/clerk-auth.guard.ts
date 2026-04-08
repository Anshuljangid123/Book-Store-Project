import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

type AuthenticatedRequest = Request & {
  user?: User;
};

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Missing or invalid authorization header');
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      this.logger.error('CLERK_SECRET_KEY is not configured');
      throw new UnauthorizedException('Authentication is not configured');
    }

    try {
      const verifiedToken = await clerkClient.verifyToken(token, {
        secretKey,
        issuer: (issuer) =>
          issuer.startsWith('https://clerk.') ||
          issuer.includes('.clerk.accounts'),
      });

      let user = await this.prisma.user.findUnique({
        where: { clerkUserId: verifiedToken.sub },
      });

      if (!user) {
        this.logger.log(
          `User not found in DB. Creating local profile for ${verifiedToken.sub}...`,
        );
        const clerkUser = await clerkClient.users.getUser(verifiedToken.sub);
        const email =
          clerkUser.emailAddresses[0]?.emailAddress ||
          `${verifiedToken.sub}@placeholder.com`;
        const name =
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          'Unknown';

        user = await this.prisma.user.create({
          data: {
            clerkUserId: verifiedToken.sub,
            email,
            name,
            role: 'USER',
          },
        });
      }

      request.user = user;
      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
