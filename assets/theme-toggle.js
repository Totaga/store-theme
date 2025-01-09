// theme-toggle.js

// Constants for theme configuration
const IGNORED_ELEMENTS = ['site-header', 'announcement-bar', 'header-wrapper'];

const LIGHT_THEME = 'color-scheme-1';
const DARK_THEME = 'color-scheme-2';

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    // Bind the init method to ensure proper 'this' context
    this.init = this.init.bind(this);
  }

  connectedCallback() {
    // Initialize when the element is added to the DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.init);
    } else {
      this.init();
    }
  }

  init() {
    this.button = this.querySelector('button.header__icon--theme');

    if (!this.button) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Check for saved theme preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const theme = systemDarkMode ? 'dark' : 'light';
      this.setTheme(theme);
      localStorage.setItem('theme', theme);
    }

    // Add click event listener
    this.button.addEventListener('click', () => this.toggleTheme());

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
    });
  }

  setTheme(theme) {
    // Set the data-theme attribute first for icon visibility
    document.documentElement.setAttribute('data-theme', theme);

    // Update ARIA label for accessibility
    this.button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

    // Get all elements that should change theme
    const elements = Array.from(document.getElementsByClassName(LIGHT_THEME))
      .concat(Array.from(document.getElementsByClassName(DARK_THEME)))
      .filter((element) => !IGNORED_ELEMENTS.some((className) => element.classList.contains(className)));

    // Update theme for each element
    elements.forEach((element) => {
      element.classList.remove(LIGHT_THEME, DARK_THEME);
      element.classList.add(theme === 'dark' ? DARK_THEME : LIGHT_THEME);
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }
}

// Define the custom element
customElements.define('theme-toggle', ThemeToggle);
