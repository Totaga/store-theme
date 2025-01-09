class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('DOMContentLoaded', this.init.bind(this));
    // Also try to init immediately in case the DOM is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.init.bind(this));
    } else {
      this.init();
    }
  }

  init() {
    this.button = this.querySelector('button');

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
    // Remove all color scheme classes
    document.documentElement.classList.remove('color-scheme-1', 'color-scheme-3');
    // Add appropriate color scheme class
    document.documentElement.classList.add(`color-scheme-${theme === 'dark' ? '3' : '1'}`);
    // Update data-theme attribute for icon visibility
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }
}

customElements.define('theme-toggle', ThemeToggle);
