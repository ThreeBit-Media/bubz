# Bubz

A customizable, self-contained loading indicator web component with falling bubble animations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- Fully customizable (text, color, size, speed)
- Single file, no dependencies
- Auto-centers in any container
- Smart visibility management (pauses when hidden)
- Shadow DOM encapsulation
- Responsive and lightweight
- Production-ready minified version (5.8 KB)

## Demo

**[View Live Demo](https://threebit-media.github.io/bubz/)**

## Quick Start

### Option 1: Download Files

1. Download `bubz.min.js` (or `bubz.js` for development)
2. Include it in your HTML:

```html
<script src="bubz.min.js"></script>
<bubz-indicator></bubz-indicator>
```

### Option 2: Direct Link (CDN)

```html
<script src="https://cdn.jsdelivr.net/gh/ThreeBit-Media/bubz@main/bubz.min.js"></script>
<bubz-indicator text="LOADING"></bubz-indicator>
```

## Usage

### Basic

```html
<bubz-indicator></bubz-indicator>
```

### Custom Text

```html
<bubz-indicator text="PROCESSING"></bubz-indicator>
```

### Custom Color

```html
<bubz-indicator text="LOADING" color="#4CAF50"></bubz-indicator>
```

### Custom Size

```html
<bubz-indicator text="LOADING" size="1.5"></bubz-indicator>
```

### Custom Speed

```html
<bubz-indicator text="LOADING" speed="0.5"></bubz-indicator>
```

## JavaScript API

### Show/Hide

```javascript
const loader = document.querySelector('bubz-indicator');

// Show with fade-in
loader.show();

// Hide with fade-out
loader.hide();

// With callbacks
loader.show(() => console.log('Shown!'));
loader.hide(() => console.log('Hidden!'));

// Check visibility
loader.isVisible(); // returns true/false
```

### Dynamic Properties

```javascript
const loader = document.querySelector('bubz-indicator');

loader.text = 'NEW TEXT';
loader.color = '#FF9800';
loader.size = 1.2;
loader.speed = 0.8;
```

## Attributes

| Attribute | Type   | Default     | Description                          |
|-----------|--------|-------------|--------------------------------------|
| `text`    | String | `"LOADING"` | The text to display                  |
| `color`   | String | `"#777"`    | Base color (hex format)              |
| `size`    | Number | `1`         | Size multiplier                      |
| `speed`   | Number | `1`         | Speed multiplier (higher = slower)   |

## Methods

- `show(callback)` - Show the indicator with fade-in effect
- `hide(callback)` - Hide the indicator with fade-out effect
- `isVisible()` - Returns true if visible

## Full Page Overlay Example

```html
<div id="overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; z-index: 9999; align-items: center; justify-content: center;">
  <bubz-indicator text="LOADING" color="#fff"></bubz-indicator>
</div>

<script>
  // Show overlay
  document.getElementById('overlay').style.display = 'flex';

  // Hide overlay
  document.getElementById('overlay').style.display = 'none';
</script>
```

## Browser Support

Works in all modern browsers that support:
- Web Components
- Shadow DOM
- ES6 Classes
- IntersectionObserver

## Files

- `bubz.js` (10 KB) - Readable source for development
- `bubz.min.js` (5.8 KB) - Minified for production
- `demo.html` - Interactive demo and documentation
- `LICENSE` - MIT License

## License

MIT License - Copyright (c) 2026 ThreeBit Media

## Author

Bill Knechtel

---

Made with ❤️ by ThreeBit Media
