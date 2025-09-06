/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,mdx}",
    "./src/components/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { 
          DEFAULT: "#2563EB",   // Primary blue
          light: "#60A5FA", 
          dark: "#1E40AF" 
        },
        accent: { 
          DEFAULT: "#F59E0B", 
          dark: "#B45309" 
        },
        neutral: {
          bg: "#F9FAFB",
          card: "#FFFFFF",
          text: "#1F2937",
          mutetext: "#6B7280",
          border: "#E5E7EB"
        }
      }
    }
  },
  plugins: [],
};