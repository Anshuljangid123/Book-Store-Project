import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('cart')
@UseGuards(ClerkAuthGuard, RolesGuard) // All cart routes require active user sessions
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id); // req.user populated by ClerkAuthGuard DB lookup
  }

  @Post('items')
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Delete('items/:bookId')
  removeFromCart(
    @Request() req,
    @Param('bookId', ParseUUIDPipe) bookId: string,
  ) {
    return this.cartService.removeFromCart(req.user.id, bookId);
  }
}
