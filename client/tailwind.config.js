/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#ffbf00",
        "primary-100" : "#ffc929",
        "secondary-200" : "#00b050",
        "secondary-100" : "#0b1a78",
        // Professional Admin Colors - White, Blue, Orange Theme
        "admin-bg" : "#F0F5FF",           // Light blue tint background
        "admin-sidebar" : "#1E40AF",     // Deep blue sidebar
        "admin-sidebar-hover" : "#1E3A8A", // Darker blue for hover
        "admin-primary" : "#2563EB",      // Blue primary buttons
        "admin-primary-hover" : "#1D4ED8", // Darker blue for hover
        "admin-accent" : "#F97316",      // Orange accent
        "admin-accent-hover" : "#EA580C", // Darker orange
        "admin-card" : "#FFFFFF",         // White cards
        "admin-border" : "#BFDBFE",      // Light blue border
        "admin-text" : "#1E3A8A",        // Deep blue text
        "admin-text-muted" : "#64748B",  // Muted blue-grey
        "admin-success" : "#10B981",     // Green for success
        "admin-danger" : "#EF4444",       // Red for danger/delete
      }
    },
  },
  plugins: [],
}

