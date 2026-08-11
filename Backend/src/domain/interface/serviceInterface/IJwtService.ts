export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface IJwtService {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload | null;
}
