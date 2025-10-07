import * as yup from 'yup';

// Step 1: Account creation validation
export const signupValidationSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
   country: yup
    .string()
    .required('Country is required')
    .min(2, 'Country must be at least 2 characters'),
  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Password must include upper, lower, and number'
    ),
});

// Step 2: Profile setup validation
export const profileValidationSchema = yup.object({
  industry: yup
    .string()
    .required('Industry is required'),
  employmentType: yup
    .string()
    .required('Employment type is required'),
  selfEmployed: yup.boolean().optional(),
});

// Final check: all fields
export const completeUserValidationSchema = signupValidationSchema.concat(
  profileValidationSchema
).shape({
  dob: yup
    .string()
    .optional()
    .test('is-valid-date', 'Date of birth must be a valid ISO 8601 date string', (value) => {
      if (!value) return true; // Optional field
      const date = new Date(value);
      return !isNaN(date.getTime()) && !!value.match(/^\d{4}-\d{2}-\d{2}$/);
    }),
});

// Login validation
export const loginValidationSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
}); 

// utils/passwordValidation.ts

export type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export const validatePasswordForm = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): PasswordErrors => {
  const errors: PasswordErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required.";
  } else {
    // Regex: min 8 chars, 1 uppercase, 1 lowercase, 1 digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters, include uppercase, lowercase, and a number.";
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
