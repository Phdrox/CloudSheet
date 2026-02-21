import { Controller, Get, Param,Body,Post, Put, Delete,Headers } from '@nestjs/common';
import { UsersService } from './users.services';
import type { IUser } from './/interfaces/user-interface';
import type { PostUser } from './interfaces/user-interface';
import { UUID } from 'crypto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getUsers(){
    return this.usersService.getAllUsers()
  }

  @Post('')
  async createUser(@Body() user:PostUser){
    return this.usersService.createUser(user)
  }

  @Get(':id')
  getUserById(@Param('id') id:string){
    return this.usersService.getUserById(id as unknown as UUID)
  }

  @Put(':id')
  updateUser(@Param('id') id:string, @Body() user:IUser){
    return this.usersService.updateUser(id as unknown as UUID, user)
  }
  
  @Delete(':id')
  getDeleteUser(@Param('id') id:string){
    return this.usersService.deleteUser(id as unknown as UUID)
  }
}