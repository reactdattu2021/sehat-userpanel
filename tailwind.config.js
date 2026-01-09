/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
         sans: ["Open Sans", "sans-serif"],
        outfit: ["Outfit", "sans-serif"]
       
      },
    },
  },
  plugins: [],
}

