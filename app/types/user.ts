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
  qualification?: string;
} 
// types.ts
export interface FormData {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  industry: string[];        // multiple industries
  employmentType: string[];  // multiple employment types
  dob?: string;              // optional (ISO string)
  openForWork?: boolean;     // optional
}
