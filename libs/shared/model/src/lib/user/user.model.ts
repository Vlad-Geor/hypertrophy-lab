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
