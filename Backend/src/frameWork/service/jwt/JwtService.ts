import jwt from 'jsonwebtoken';
import { IJwtService, JwtPayload } from '../../../domain/interface/serviceInterface/IJwtService';

export class JwtService implements IJwtService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback_secret_key_foodflow';
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}
