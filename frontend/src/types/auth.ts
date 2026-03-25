export type User = {
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
