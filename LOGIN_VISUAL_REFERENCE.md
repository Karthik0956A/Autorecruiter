# 🎨 Login System - Visual & Technical Reference

## 📸 Page Previews

### 🔵 Login Page (`/login`)
```
┌─────────────────────────────────────────────┐
│                    🚀                        │
│              Welcome Back                    │
│         Sign in to TalentSense AI           │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Email Address                         │ │
│  │  [you@example.com____________]         │ │
│  │                                        │ │
│  │  Password                              │ │
│  │  [••••••••••••______________]          │ │
│  │                   Forgot password? --> │ │
│  │                                        │ │
│  │  [    Sign in →    ]                  │ │
│  │                                        │ │
│  │  ──── New to TalentSense? ────        │ │
│  │                                        │ │
│  │  [  Create an account +   ]           │ │
│  └────────────────────────────────────────┘ │
│                                              │
│   By signing in, you agree to our Terms     │
└─────────────────────────────────────────────┘

Colors: Blue gradient background (blue-50 → white → purple-50)
Button: Blue (#2563EB)
```

### 🟣 Register Page (`/register`)
```
┌─────────────────────────────────────────────┐
│                    🚀                        │
│              Create Account                  │
│          Join TalentSense AI today          │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Full Name                             │ │
│  │  [John Doe________________]            │ │
│  │                                        │ │
│  │  Email Address                         │ │
│  │  [you@example.com_________]            │ │
│  │                                        │ │
│  │  Password                              │ │
│  │  [••••••••••••______________]          │ │
│  │                                        │ │
│  │  Confirm Password                      │ │
│  │  [••••••••••••______________]          │ │
│  │                                        │ │
│  │  [  Create Account +   ]              │ │
│  │                                        │ │
│  │  ──── Already have an account? ────   │ │
│  │                                        │ │
│  │  [    Sign in instead →    ]          │ │
│  └────────────────────────────────────────┘ │
│                                              │
│   By creating an account, you agree...      │
└─────────────────────────────────────────────┘

Colors: Purple gradient background (purple-50 → white → blue-50)
Button: Purple (#9333EA)
```

### 🟢 Forgot Password (`/forgot-password`)
```
┌─────────────────────────────────────────────┐
│              ← Back to Login                 │
│                                              │
│                    🔐                        │
│            Forgot Password?                  │
│   No worries, we'll send you reset...      │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Email Address                         │ │
│  │  [you@example.com_________]            │ │
│  │                                        │ │
│  │  [  Send Reset Link ✉  ]             │ │
│  └────────────────────────────────────────┘ │
│                                              │
│   Remember your password? Sign in           │
└─────────────────────────────────────────────┘

Colors: Green gradient background (green-50 → white → blue-50)
Button: Green (#059669)
```

---

## 🔄 User Flow Diagram

```
         START
           |
           v
    [Visit Site] ──────────────┐
           |                    |
           v                    |
    Has Token? ────No──→ [Login Page]
           |                    |
          Yes                   v
           |              [Enter Credentials]
           v                    |
    [Dashboard] <──────────────┘
           |
           v
    [Click Logout]
           |
           v
    [Clear Token]
           |
           v
    [Redirect to Login]
```

---

## 🔐 Authentication Flow

```
Frontend                    Backend                  Database
   |                           |                        |
   |──[POST /api/auth/login]──→|                        |
   |   {email, password}        |                        |
   |                            |──[Find user]──────────→|
   |                            |←──[User data]──────────|
   |                            |                        |
   |                            |──[Compare password]    |
   |                            |                        |
   |                            |──[Generate JWT]        |
   |                            |                        |
   |←─[200 OK]─────────────────|                        |
   |   {token, user}            |                        |
   |                            |                        |
   |──[Store in localStorage]   |                        |
   |                            |                        |
   |──[Redirect to Dashboard]   |                        |
   |                            |                        |
   |──[GET /api/jd]────────────→|                        |
   |   Header: Bearer token     |                        |
   |                            |──[Verify JWT]          |
   |                            |                        |
   |                            |──[Get JDs]────────────→|
   |                            |←──[JD data]───────────|
   |                            |                        |
   |←─[200 OK]─────────────────|                        |
   |   {jobs: [...]}            |                        |
```

---

## 📊 Component Hierarchy

```
App.jsx
├── Login.jsx                    [Public Route]
├── Register.jsx                 [Public Route]
├── ForgotPassword.jsx          [Public Route]
└── ProtectedRoute.jsx
    └── Layout.jsx
        ├── Header (with Logout)
        ├── Sidebar Navigation
        └── Outlet
            ├── Dashboard.jsx
            ├── JobDescription.jsx
            ├── UploadResume.jsx
            └── MatchCandidates.jsx
```

---

## 🎨 Color Palette

### Login Page:
- **Background**: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- **Button**: `bg-blue-600 hover:bg-blue-700`
- **Icon Badge**: `bg-blue-600`
- **Links**: `text-blue-600`

### Register Page:
- **Background**: `bg-gradient-to-br from-purple-50 via-white to-blue-50`
- **Button**: `bg-purple-600 hover:bg-purple-700`
- **Icon Badge**: `bg-purple-600`
- **Links**: `text-purple-600`

### Forgot Password:
- **Background**: `bg-linear-to-br from-green-50 via-white to-blue-50`
- **Button**: `bg-green-600 hover:bg-green-700`
- **Icon Badge**: `bg-green-600`
- **Links**: `text-blue-600`

### Error States:
- **Error Background**: `bg-red-50`
- **Error Border**: `border-red-500`
- **Error Text**: `text-red-600`

---

## 📱 Responsive Classes

### Container:
```css
max-w-md w-full          /* Max width 448px, full width on mobile */
px-4 py-12               /* Horizontal padding 1rem, vertical 3rem */
```

### Form Card:
```css
bg-white                 /* White background */
rounded-2xl              /* Extra large border radius */
shadow-xl                /* Extra large shadow */
p-8                      /* Padding 2rem */
space-y-6                /* Vertical spacing 1.5rem between children */
```

### Input Fields:
```css
w-full                   /* Full width */
px-4 py-3                /* Padding horizontal 1rem, vertical 0.75rem */
border border-gray-300   /* Border 1px gray */
rounded-lg               /* Large border radius */
focus:ring-2             /* Focus ring 2px */
focus:ring-blue-500      /* Blue focus ring */
```

### Buttons:
```css
w-full                   /* Full width */
px-4 py-3                /* Padding */
rounded-lg               /* Large border radius */
font-medium              /* Font weight 500 */
transition-colors        /* Smooth color transitions */
```

---

## 🔍 Validation Patterns

### Email Validation:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```
- Allows: `user@example.com`, `name.surname@company.co.uk`
- Rejects: `user@`, `@example.com`, `user@.com`

### Password Validation:
```javascript
minLength: 6 characters
```

### Name Validation:
```javascript
minLength: 2 characters
```

---

## 🛠️ API Service Structure

```javascript
// frontend/src/services/api.js

api
├── interceptors
│   ├── request  → Add JWT token
│   └── response → Handle 401 errors
│
└── API Methods
    ├── authAPI
    │   ├── login(email, password)
    │   ├── register(name, email, password)
    │   └── getMe()
    │
    ├── jdAPI
    │   ├── analyze(jobDescription)
    │   ├── create(data)
    │   ├── getAll()
    │   └── ...
    │
    ├── candidateAPI
    │   ├── upload(formData)
    │   ├── getAll()
    │   └── ...
    │
    ├── matchAPI
    │   ├── getMatches(jdId)
    │   ├── submitFeedback(...)
    │   └── ...
    │
    └── analyticsAPI
        ├── getOverview()
        ├── getMatchDistribution()
        └── ...
```

---

## 🎯 Loading States

### Button Loading State:
```jsx
{loading ? (
  <>
    <svg className="animate-spin ...">...</svg>
    Signing in...
  </>
) : (
  <>
    Sign in
    <svg>→</svg>
  </>
)}
```

Visual effect:
- Spinner icon rotates continuously
- Button text changes
- Button becomes disabled
- Cursor changes to `not-allowed`
- Background color lightens (`bg-blue-400`)

---

## ⚠️ Error Display

### Inline Field Error:
```jsx
{errors.email && (
  <p className="text-red-600 flex items-center">
    <svg>⚠</svg>
    {errors.email}
  </p>
)}
```

### Server Error Alert:
```jsx
{serverError && (
  <div className="bg-red-50 border border-red-200 ...">
    <svg>✖</svg>
    <span>{serverError}</span>
  </div>
)}
```

---

## 📦 State Management

### Login Component State:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [serverError, setServerError] = useState('');
```

### LocalStorage State:
```javascript
localStorage.setItem('token', 'JWT_TOKEN_HERE');
localStorage.setItem('user', JSON.stringify(userObject));
```

---

## 🔄 Lifecycle Hooks

### Auto-redirect on Mount:
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/');  // Already logged in
  }
}, [navigate]);
```

### Get User Info:
```javascript
useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    setUserName(userData.name);
  }
}, []);
```

---

## 🎉 Success Indicators

### Login Success:
1. ✅ Token saved to localStorage
2. ✅ User data saved to localStorage
3. ✅ Redirect to Dashboard
4. ✅ Header shows: "Welcome, [Name]"
5. ✅ All protected routes accessible

### Logout Success:
1. ✅ Token removed from localStorage
2. ✅ User data removed from localStorage
3. ✅ Redirect to Login page
4. ✅ Protected routes redirect back to Login

---

## 📋 Testing Checklist

### Login Page:
- [ ] Visit `/login` shows login form
- [ ] Empty email shows error
- [ ] Invalid email format shows error
- [ ] Empty password shows error
- [ ] Wrong credentials shows "Invalid credentials"
- [ ] Correct credentials redirects to dashboard
- [ ] "Forgot password?" link works
- [ ] "Create account" link works
- [ ] Loading spinner appears during login

### Register Page:
- [ ] Visit `/register` shows registration form
- [ ] All validation errors display correctly
- [ ] Password mismatch shows error
- [ ] Successful registration redirects to dashboard
- [ ] "Sign in instead" link works

### Protected Routes:
- [ ] Visiting `/` without token redirects to `/login`
- [ ] Visiting any protected route without token redirects to `/login`
- [ ] With valid token, all routes accessible

### Logout:
- [ ] Clicking logout redirects to `/login`
- [ ] After logout, visiting `/` redirects to `/login`
- [ ] Token is cleared from localStorage

---

**🎨 Your login system is beautifully designed and fully functional!**
