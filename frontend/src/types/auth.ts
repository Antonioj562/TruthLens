export type User = {
  email: string;
  is_admin?: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};
