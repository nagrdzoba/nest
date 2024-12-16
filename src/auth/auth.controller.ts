import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guard/local.guard';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { Request } from 'express';
import { RegisterAndUpdateDto,CustomRequest } from '../dto/register-update-user.dto';

@ApiTags('Auth') // Groups endpoints under "Auth"
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description:
      'username should not be empty, password should not be empty, username must be string, password must be string',
  })
  @ApiResponse({
    status: 409,
    description: 'username already exists',
  })
  @ApiBody({
    description: 'Payload for user registration',
    schema: {
      example: {
        username: 'johndoe',
        password: 'securepassword123',
      },
    },
  })
  async createUser(@Body() body: RegisterAndUpdateDto) {
    return this.authService.registerUser(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in User' })
  @ApiResponse({ status: 201, description: 'User Logged in successfully' })
  @ApiResponse({
    status: 400,
    description:
      'username should not be empty, password should not be empty, username must be string, password must be string, user not found, wrong password',
  })
  @ApiBody({
    description: 'Payload for Logging in',
    schema: {
      example: {
        username: 'johndoe',
        password: 'securepassword123',
      },
    },
  })
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user; // The user object will be populated by the guard
  }

  @Get('status')
  @ApiOperation({ summary: 'get User Status' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user; // Returns the authenticated user
  }

  // Update user endpoint (protected by JWT Auth Guard)
  @Patch('update')
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 201, description: 'User Updated successfully' })
  @ApiResponse({
    status: 400,
    description:
      'username should not be empty, password should not be empty, username must be string, password must be string',
  })
  @ApiBody({
    description: 'Payload for updating user',
    schema: {
      example: {
        username: 'johndoe',
        password: 'securepassword123',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req: CustomRequest, // Access the request object to get the user ID
    @Body() updateData: RegisterAndUpdateDto,
  ) {
    const userId = req.user.id; // Extract user id from the token
    return this.authService.updateUser(userId, updateData); // Pass userId to the service method
  }

  // Delete user endpoint (protected by JWT Auth Guard)
  @Delete('delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User'})
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: CustomRequest) {
    const userId = req.user.id; // Extract user id from the token
    return this.authService.deleteUser(userId); // Pass userId to the service method
  }
}
