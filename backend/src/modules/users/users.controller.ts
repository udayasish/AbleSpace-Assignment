import { Body, Controller, Delete, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { updateProfileSchema } from './schemas';
import type { UpdateProfileDto } from './schemas';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  update(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(updateProfileSchema)) body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, body);
  }

  @Delete('me')
  remove(@CurrentUser() user: AuthUser) {
    return this.usersService.remove(user.userId);
  }
}
