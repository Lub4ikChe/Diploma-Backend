export class BaseDto<T> {
  constructor(args: Partial<T>) {
    Object.assign(this, args);
  }
}
