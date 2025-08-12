export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  password: string;
  dob?: string; // YYYY-MM-DD
  industry?: string;
  employmentType?: string;
  selfEmployed?: boolean;
  profileImage?: string;
} 