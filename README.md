# SUDOtech Studio Website

A modern, high-performance one-page marketing website for a creative agency specializing in Graphic Design, Video Editing, and Data Management.

## Features

- **Modern Aesthetic**: Dark mode design with glassmorphism effects, neon accents, and smooth animations.
- **Responsive Layout**: Fully responsive grid system that works effectively on mobile, tablet, and desktop.
- **Interactive Elements**:
  - Smooth scrolling navigation
  - Sticky header with blur effect
  - Intersection Observer animations (fade-in on scroll)
  - Dynamic number counters for stats
  - Contact form submission simulation
- **Performance Optimized**:
  - Semantic HTML5 structure
  - CSS variables for easy theming
  - Vanilla JavaScript (no heavy libraries)
  - Lazy loading implementation

## Project Structure

- `index.html`: Main structure and content.
- `style.css`: All styles, variables, and responsive media queries.
- `script.js`: Interactive logic and DOM manipulation.

## Customization

### Colors
You can easily change the color scheme by modifying the CSS variables in `style.css`:

```css
:root {
  --primary: #6366f1;       /* Main Brand Color */
  --secondary: #8b5cf6;     /* Secondary Brand Color */
  --accent: #ec4899;        /* Accent Color */
  --bg-darker: #020617;     /* Background Color */
}
```

### Images
Replace the placeholder images in the `#portfolio` section with your own work. Ensure you update the `alt` texts for SEO.

### Contact Form
The contact form currently simulates a submission. To make it functional, integrate with a service like Formspree or Netlify Forms by updating the `<form>` tag:

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

## How to Run

Simply open `index.html` in any modern web browser. 

For development, you can use a local server (like Live Server in VS Code) to test features properly.
