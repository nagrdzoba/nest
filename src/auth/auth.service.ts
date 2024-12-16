import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { RegisterAndUpdateDto } from '../dto/register-update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerUser({ username, password }: RegisterAndUpdateDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    };
  }

  async validateUser({ username, password }: RegisterAndUpdateDto) {
    // Find the user in the database
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    // Verify the password (assuming passwords are hashed)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('wrong password');
    }
    // Remove sensitive fields and generate a JWT token
    const { password: _, ...userWithoutPassword } = user;
    const payload = { id: user.id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  // Update user logic
  async updateUser(id: number, updateData: Partial<RegisterAndUpdateDto>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Update user with the provided fields
    await this.userRepository.update(id, updateData);

    // Retrieve updated user without password
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    const { password: _, ...userWithoutPassword } = updatedUser;

    return {
      message: 'User updated successfully',
      user: userWithoutPassword,
    };
  }

  // Delete user logic
  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
