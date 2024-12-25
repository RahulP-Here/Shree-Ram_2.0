/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     
    extend: {
      fontFamily: {
        'gujarati': ['Anek Gujarati', 'sans-serif'],
      },
      colors: {
        'text': '#424242',
        'light-text': '#c4c3c3',
        'background': '#fff3e0',
        'primary': '#f57a00',
        'secondary': '#edf0f2',
        'accent': '#d54215',
        'highlight': '#FFB300',
        'alwhite':'#FAF3E6',
        'light-primary':'#F7EBD9',
        'light-accent':'#F2E7D4',
       }, 
    },
  },
  plugins: [],
   
}