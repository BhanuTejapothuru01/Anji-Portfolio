# Ram editz Portfolio

A cinematic, dark-themed portfolio website for **Ram editz** — a video production creative agency.

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `portfolio.html` | Portfolio / showreel |
| `services.html` | Services |
| `process.html` | Our process |
| `contact.html` | Contact form |

## Quick Start

Open `index.html` in your browser, or run a local server:

```bash
cd reelcraft-portfolio
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080)

## Customization

Edit **`js/config.js`** to update:

- Site name, email, location, social links
- Video URLs (YouTube embeds or direct `.mp4` files)
- Formspree form ID for live contact submissions

### Video URLs

```js
// YouTube
url: 'https://www.youtube.com/embed/VIDEO_ID?autoplay=1'

// Direct MP4
url: 'https://yoursite.com/reel.mp4'
```

### Contact Form

1. Sign up at [formspree.io](https://formspree.io)
2. Add your form ID to `config.js`: `formspreeId: 'your_form_id'`

## Features

- Full-screen cinematic nav overlay
- Video modal player (YouTube + MP4)
- Scroll reveal animations
- Glassmorphism service cards
- Budget slider on contact form
- Mobile-first responsive design

## Tech Stack

- HTML5, CSS3 (glassmorphism, CSS animations)
- Vanilla JavaScript (nav overlay, scroll spy, form handling)
- Google Fonts: Inter + Syne
# Anji-Portfolio
