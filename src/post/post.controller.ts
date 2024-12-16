import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Param,
  NotFoundException,
  Delete,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { UpdatePostDto } from 'src/dto/update_post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const updatedPost = await this.postService.updatePost(id, updatePostDto);
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return {
      message: 'Post updated successfully',
      post: updatedPost,
    };
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') postId: number, @Request() req) {
    const userId = req.user.id; // Assume the user's ID is available in the request object
    return await this.postService.deletePost(postId, userId);
  }
}
