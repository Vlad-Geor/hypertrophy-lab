import { AuthProvider } from "../auth/auth.model";

export interface User {
  id: number;
  email?: string;
  passwordHash?: string;
  displayName?: string;
  avatarUrl?: string;

  telegramId?: string;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
  telegramPhotoUrl?: string;
  telegramAuthDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface Userr {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  primaryEmail?: string | null;
  isActive: boolean;
  identities: UserIdentity[];
}

export interface UserIdentity {
  id: string;
  provider: AuthProvider;
  providerUserId: string;
  email?: string | null;
  username?: string | null;
  profile?: unknown;
  linkedAt: string;
  lastLoginAt?: string | null;
  emailVerified?: boolean;
}