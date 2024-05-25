interface User {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER" | "";
  gender: "MALE" | "FEMALE" | "OTHER" | "";
  phone: string;
  bio: string;
}

export type { User };
