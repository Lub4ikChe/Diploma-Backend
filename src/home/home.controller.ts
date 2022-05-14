import { Controller, HttpStatus, HttpCode, Get } from '@nestjs/common';

import { HomeService } from 'src/home/home.service';

import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

import { HomeDto } from 'src/home/dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @SkipAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHomeItems(): Promise<HomeDto> {
    return this.homeService.getHomeItems();
  }
}
