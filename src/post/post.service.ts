import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User';
import { Post } from 'src/typeorm/entities/Post';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { UpdatePostDto } from 'src/dto/update_post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { userId, title, description } = createPostDto;
    // Find the user by userId
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the post with the user object (not just the userId)
    const post = this.postRepository.create({ title, description, user });
    await this.postRepository.save(post);

    return {
      message: 'Post created successfully',
      post: {
        id: post.id,
        title: post.title,
        description: post.description,
        userId: post.user.id, // this should be the correct userId
      },
    };
  }
  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      return null; // Post not found
    }

    const updatedPost = Object.assign(post, updatePostDto); // Merge new data
    await this.postRepository.save(updatedPost);
    return updatedPost;
  }
  async deletePost(postId: number, userId: number) {
    // Fetch the post from the database
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if the post belongs to the user
    if (post.user.id !== userId) {
      throw new Error('You are not authorized to delete this post');
    }

    // Delete the post
    await this.postRepository.delete(postId);
    return { message: 'Post deleted successfully' };
  }
}
