/**
 * The JWT Payload object
 * @typedef {Object} JwtPayload
 * @property {string} userId - id of the actor
 * @property {string} email - email of the actor
 */
export interface JwtPayload {
  userId: string;
  email: string;
}
