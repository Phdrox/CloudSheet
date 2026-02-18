import { Injectable } from '@nestjs/common';
import { db } from './database/db';
import { users } from './database/schemas';

@Injectable()
export class UserService {
  
  async createUser(name: string, email: string,username:string) {
    await db.insert(users).values({name,email,username});
  }
}
