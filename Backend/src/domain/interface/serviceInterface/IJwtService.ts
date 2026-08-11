export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface IJwtService {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload | null;
}
