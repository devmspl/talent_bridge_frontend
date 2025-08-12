# TalentBridge Setup Guide

## What's Included

✅ **Redux Toolkit** - State management  
✅ **RTK Query** - API calls (direct to external API)  
✅ **Form Validation** - Using Yup  
✅ **Multi-step Form** - 3 registration steps  
✅ **API Integration** - Hitting external endpoint directly  

## How It Works

1. **Step 1 (Signup)**: Collect basic user info (name, email, phone, country, city, password)
2. **Step 2 (Profile)**: Collect profile info (industry, employment type, self-employed status)
3. **Step 3 (Showcase)**: Hit API to create user account

## Files Structure (Simplified)

```
app/
├── store/
│   ├── store.ts          # Redux store config
│   ├── slices/
│   │   └── userSlice.ts  # User state management
│   └── api/
│       └── userApi.ts    # RTK Query API calls (direct to external API)
├── types/
│   └── user.ts           # User data types
└── utils/
    └── validation.ts     # Form validation schemas
```

## API Endpoint

The app hits directly: `http://38.242.230.126:5832/User/create`

## Why This is Better

- **No unnecessary Next.js API routes** - RTK Query hits your external API directly
- **Cleaner structure** - Fewer files and folders
- **Better performance** - No extra hop through Next.js
- **Easier maintenance** - Less code to manage

## Usage

- Form data is stored in Redux state
- Validation happens on each step
- API call happens on final step (direct to external API)
- Success redirects to dashboard

## Dependencies

- @reduxjs/toolkit
- react-redux  
- yup 