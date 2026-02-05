# VejaAquí Mobile App

A modern React Native mobile application built with Expo for browsing and managing real estate properties.

## Features

- **Authentication**: User registration and login with email/password
- **Property Browsing**: Search and browse properties with detailed information
- **Favorites**: Save favorite properties for quick access
- **Messaging**: Chat with property owners and agents
- **User Profile**: Manage your profile and view your saved properties
- **Property Details**: View comprehensive property information with images

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation between screens
- **Supabase** - Backend & authentication
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/              # Authentication screens
│   │   ├── HomeScreen.tsx     # Home page
│   │   ├── SearchScreen.tsx   # Property search
│   │   ├── FavoritesScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PropertyDetailScreen.tsx
│   │   └── NotFoundScreen.tsx
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   ├── navigation/            # Navigation configuration
│   ├── context/               # React context providers
│   ├── services/              # API and Supabase services
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions and themes
│   └── App.tsx                # App entry point
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── tsconfig.json              # TypeScript configuration
└── index.ts                   # Root entry point
```

## Setup & Installation

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your Supabase URL and anon key

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on your device**:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Environment Variables

Create a `.env` file in the mobile directory with:

```
EXPO_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
```

## Key Features

### Authentication
- Email/password registration and login
- Password reset functionality
- Session persistence across app restarts

### Navigation
- Bottom tab navigation with 5 main sections
- Stack navigation for detail views
- Smooth transitions between screens

### UI Components
- Custom Button component with variants
- Input fields with validation
- Card components for content display
- Theme system with consistent colors and spacing

### Data Management
- Supabase integration for real-time data
- Row-level security for user data protection
- Async storage for session management

## Development

### Adding New Screens

1. Create a new file in `src/screens/`
2. Add the screen to the appropriate navigator
3. Add the route type to `src/types/navigation.ts`

### Adding New Components

1. Create a new file in `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Import and use in your screens

### Styling

- Use the theme system in `src/utils/theme.ts`
- Color palette includes primary, secondary, accent, and semantic colors
- 8px spacing system for consistent layouts
- Responsive design patterns throughout

## Building for Production

To build for iOS:
```bash
eas build --platform ios
```

To build for Android:
```bash
eas build --platform android
```

## Troubleshooting

- **Clear cache**: `expo start -c`
- **Reset dependencies**: `rm -rf node_modules && npm install`
- **Check environment**: Ensure `.env` file is properly configured

## Support

For issues or questions, please refer to:
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [Supabase Documentation](https://supabase.com/docs)
