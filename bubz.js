/**
 * Bubz - A customizable loading indicator web component
 *
 * Usage:
 *   <bubz-indicator text="LOADING" color="#777"></bubz-indicator>
 *
 * Attributes:
 *   - text: The text to display (default: "LOADING")
 *   - color: Base color for bubbles and text (default: "#777")
 *   - size: Size multiplier (default: 1)
 *   - speed: Animation speed multiplier (default: 1, lower = faster)
 *
 * Methods:
 *   - show(callback): Show the loading indicator
 *   - hide(callback): Hide the loading indicator
 */

class BubzIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._intervalId = null;
    this._isVisible = true;
    this._observer = null;
  }

  static get observedAttributes() {
    return ["text", "color", "size", "speed"];
  }

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback() {
    this.render();
    this.startAnimation();
    this.setupVisibilityObserver();
  }

  /**
   * Called when the element is removed from the DOM
   */
  disconnectedCallback() {
    this.stopAnimation();
    this.teardownVisibilityObserver();
  }

  /**
   * Set up an IntersectionObserver to monitor visibility
   */
  setupVisibilityObserver() {
    // Use IntersectionObserver to pause animation when not visible
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && this._isVisible) {
            // Element is visible in viewport and not manually hidden
            this.startAnimation();
          } else {
            // Element is not visible (scrolled away, display:none, etc)
            this.stopAnimation();
            this.clearBubbles();
          }
        });
      },
      { threshold: 0 },
    );

    this._observer.observe(this);
  }

  /**
   * Tear down the IntersectionObserver
   */
  teardownVisibilityObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  /**
   * Called when an observed attribute is changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot.innerHTML) {
      this.render();
      this.stopAnimation();
      this.startAnimation();
    }
  }

  get text() {
    return this.getAttribute("text") || "LOADING";
  }

  set text(value) {
    this.setAttribute("text", value);
  }

  get color() {
    return this.getAttribute("color") || "#777";
  }

  set color(value) {
    this.setAttribute("color", value);
  }

  get size() {
    return parseFloat(this.getAttribute("size")) || 1;
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  get speed() {
    return parseFloat(this.getAttribute("speed")) || 1;
  }

  set speed(value) {
    this.setAttribute("speed", value);
  }

  /**
   * Render the loading indicator
   */
  render() {
    const text = this.text;
    const baseColor = this.color;
    const size = this.size;
    const speed = this.speed;
    const glowColor = this.lightenColor(baseColor, 0.6);

    const columnHeight = 70 * size;
    const columnWidth = 20 * size;
    const containerWidth = text.length * columnWidth;
    const fontSize = size < 0.8 ? "x-small" : size < 1.2 ? "smaller" : "small";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          opacity: 1;
          transition: opacity 300ms ease-in-out;
        }

        :host([hidden]) {
          opacity: 0;
          pointer-events: none;
        }

        .bubz-container {
          height: ${columnHeight}px;
          min-height: ${columnHeight}px;
          width: ${containerWidth}px;
          margin: 0;
          padding: 0;
        }

        .bubz-row {
          width: ${containerWidth}px;
        }

        .bubble-column {
          width: ${columnWidth}px;
          display: inline-block;
          height: ${columnHeight}px;
          margin: 0;
          padding: 0;
          position: relative;
          text-align: center;
        }

        .loading-text {
          width: ${columnWidth}px;
          display: inline-block;
          text-align: center;
          font-family: Arial, Helvetica, sans-serif;
          color: ${baseColor};
          font-size: ${fontSize};
          animation: gentle-bounce ${2100 * speed}ms ease-in-out infinite;
        }

        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-${1.5 * size}px);
          }
        }

        @keyframes fall-and-fade {
          0% {
            transform: translateY(0px) scale(0);
            opacity: 0;
          }
          20% {
            transform: translateY(${12.6 * size}px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(${50.4 * size}px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(${63 * size}px) scale(0);
            opacity: 0;
          }
        }

        .bubble {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
          animation: fall-and-fade ${3000 * speed}ms linear both;
        }
      </style>

      <div class="bubz-container">
        <div class="bubz-row" data-row="bubbles"></div>
        <div class="bubz-row" data-row="text"></div>
      </div>
    `;

    // Create structural columns
    const bubbleRow = this.shadowRoot.querySelector('[data-row="bubbles"]');
    const textRow = this.shadowRoot.querySelector('[data-row="text"]');

    for (let i = 0; i < text.length; i++) {
      const bubbleColumn = document.createElement("div");
      bubbleColumn.classList.add("bubble-column");
      bubbleColumn.setAttribute("data-index", i);
      bubbleRow.appendChild(bubbleColumn);

      const textColumn = document.createElement("div");
      textColumn.innerHTML = text[i];
      textColumn.classList.add("loading-text");
      textColumn.style.animationDelay = `${i * 300 * speed}ms`;
      textRow.appendChild(textColumn);
    }

    // Store configuration for animation
    this._baseColor = baseColor;
    this._glowColor = glowColor;
    this._size = size;
    this._speed = speed;
  }

  /**
   * Start the bubble animation
   */
  startAnimation() {
    if (this._intervalId) return;

    const columns = this.shadowRoot.querySelectorAll(".bubble-column");
    if (!columns.length) return;

    this._intervalId = setInterval(() => {
      columns.forEach((column, index) => {
        if (this.randBool()) {
          const bubbleSize = this.randBool() ? 7 * this._size : 4 * this._size;
          const bubble = this.createBubble(bubbleSize, this._baseColor, this._glowColor);
          bubble.style.animationDelay = `${index * 70 * this._speed}ms`;
          bubble.addEventListener("animationend", () => bubble.remove());
          column.appendChild(bubble);
        }
      });
    }, 630 * this._speed);
  }

  /**
   * Stop the bubble animation
   */
  stopAnimation() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Create a bubble SVG element
   * @param {number} size - Diameter of the bubble
   * @param {string} color - Fill color of the bubble
   * @param {string} glowColor - Glow color for the bubble
   * @returns {SVGElement} - The created bubble SVG element
   */
  createBubble(size, color, glowColor) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("class", "bubble");
    svg.style.filter = `drop-shadow(0 0 ${2 * this._size}px ${glowColor})`;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const center = (size / 2).toString();
    circle.setAttribute("cx", center);
    circle.setAttribute("cy", center);
    circle.setAttribute("r", center);
    circle.setAttribute("fill", color);

    svg.appendChild(circle);
    return svg;
  }

  /**
   * Return a random boolean value (1 or 0)
   */
  randBool() {
    return Math.floor(Math.random() * 2);
  }

  /**
   * Lighten a hex color by a given percentage, used in the bubble glow effect
   * @param {*} hex
   * @param {*} percent
   * @returns rgb string
   */
  lightenColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
    const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * percent));
    const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * percent));
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Show the loading indicator
   * @param {Function} callback - Optional callback to run after show completes
   */
  show(callback) {
    // Only restart animation if it was actually hidden
    const wasHidden = !this._isVisible;

    this._isVisible = true;
    this.removeAttribute("hidden");

    // Restart animation when showing (only if it was stopped)
    if (wasHidden) {
      this.startAnimation();
    }

    if (callback) {
      // Wait for transition to complete
      setTimeout(callback, 300);
    }

    return this;
  }

  /**
   * Hide the loading indicator
   * @param {Function} callback - Optional callback to run after hide completes
   */
  hide(callback) {
    // Only stop animation if it was actually visible
    const wasVisible = this._isVisible;

    this._isVisible = false;
    this.setAttribute("hidden", "");

    // Stop animation when hiding to prevent bubble buildup
    if (wasVisible) {
      this.stopAnimation();
      // Clear any existing bubbles that are mid-animation
      this.clearBubbles();
    }

    if (callback) {
      // Wait for transition to complete
      setTimeout(callback, 300);
    }

    return this;
  }

  /**
   * Clear all bubble elements from the columns
   */
  clearBubbles() {
    const bubbles = this.shadowRoot.querySelectorAll(".bubble");
    bubbles.forEach((bubble) => bubble.remove());
  }

  /**
   * Check if the indicator is currently visible
   */
  isVisible() {
    return this._isVisible;
  }
}

// Register the custom element
customElements.define("bubz-indicator", BubzIndicator);
