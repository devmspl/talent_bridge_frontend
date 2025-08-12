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
    .required('Phone number is required'),
  dob: yup
    .string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/,'DOB must be YYYY-MM-DD'),
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      'Password must include upper, lower, number, and special character'
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
);

// Login validation
export const loginValidationSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
}); 