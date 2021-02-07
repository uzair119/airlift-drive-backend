import { Controller, Body, Post, UseGuards, HttpStatus, Get, Param, Put } from '@nestjs/common';
// import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UsersService } from './user.service';

@Controller('user')
// @ApiUseTags('authentication')
export class UserController {
  constructor(
    private readonly userService: UsersService,
  ) {}

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    return this.userService.get(id);
  }

  @Put('/:id')
  async updateUserAlcs(@Param('id') id: number, @Body('alcs') alcs: number) {
    return this.userService.updateUserAlcs(id, Number(alcs));
  }
}
