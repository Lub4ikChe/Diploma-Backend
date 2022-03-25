import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH = 'skipAuth';
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
