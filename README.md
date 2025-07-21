# JoGang - Virtual Avatar Metaverse

A Highrise-inspired virtual avatar metaverse with user authentication and avatar display system.

## Features

### Authentication System
- **Login**: Username and password authentication
- **Register**: Username, email, password, and birthday registration
- **Session Management**: Persistent login using localStorage
- **Validation**: Age verification (13+), username/email uniqueness checks

### Avatar System
- **SVG-based Avatars**: Uses your custom SVG body templates from GitHub
- **Front/Back Views**: Toggle between front and back avatar views
- **Modular Design**: Combines multiple SVG parts (head, body, arms, legs, etc.)
- **Responsive Display**: Scales properly on different screen sizes

### User Interface
- **Modern Design**: Clean, gradient-based UI with glassmorphism effects
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Transitions and hover effects
- **User-Friendly**: Intuitive navigation and clear feedback messages

## How to Use

### For Users
1. **First Time**: Click "Register here" to create an account
   - Enter username (min 3 characters)
   - Enter email address
   - Enter password (min 6 characters)
   - Select your birthday (must be 13+ years old)
   - Click "Create Account"

2. **Login**: Use your username and password to login
   - Your session will be remembered until you logout

3. **Avatar View**: Once logged in, you'll see your avatar
   - Click "Switch to Back View" to see the back of your avatar
   - Avatar is currently naked (ready for future customization)

### For Developers
1. **GitHub Pages Deployment**: 
   - Push to GitHub repository
   - Enable GitHub Pages in repository settings
   - Your app will be available at `https://yourusername.github.io/jogang`

2. **Local Development**:
   - Open `index.html` in a web browser
   - Or use a local server: `python -m http.server 8000`

## File Structure

```
jogang/
├── index.html          # Main HTML file with all forms and pages
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
├── README.md           # This file
└── template/           # SVG avatar parts (from your GitHub repo)
    ├── front-body-flesh-*.svg
    └── back-body-flesh-*.svg
```

## Technical Details

### Data Storage
- Uses browser localStorage for user data
- No backend required - perfect for GitHub Pages
- User data includes: username, email, password, birthday, registration date

### Avatar Loading
- Fetches SVG files directly from your GitHub repository
- Combines multiple SVG parts into a single avatar
- Caches SVG content for better performance
- Supports both front and back views

### Security Notes
- Passwords are stored in plain text in localStorage (demo purposes only)
- For production use, implement proper backend authentication
- Consider using JWT tokens and encrypted password storage

## Demo Account
- Username: `demo`
- Password: `demo123`

## Future Enhancements
- Avatar customization (clothes, accessories, colors)
- World exploration features
- Friend system
- Real-time chat
- Backend integration with proper security
- Avatar marketplace
- Room/space creation

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for mobile devices

## Deployment to GitHub Pages

1. Push all files to your GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your app will be live at `https://yourusername.github.io/jogang`

## Contributing
Feel free to fork this project and add new features like:
- Avatar customization tools
- More body templates
- Social features
- Mini-games
- Virtual rooms

## License
Open source - feel free to use and modify as needed.