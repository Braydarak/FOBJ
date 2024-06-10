/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#001F54",
      secondary: "#477CCF",
      inputs: "#C6C6C6",
      disableInput: "#CDCDCD",
      whiteBG: "#666464",
      backgroundcolor: "#FFFFFF",
      inputBorder: "#838383",
      inputText: '#454545',
      cardBG: '#FBFBFB',
      errorRed: '#CC0000'
    },
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
