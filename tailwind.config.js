/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        green: { dark: "#1E5C2E", mid: "#2E7D42", soft: "#4CAF6B", light: "#D4EDD9", pale: "#EDF7EF" },
        yellow: { dark: "#B8860B", mid: "#E6B800", soft: "#FFD740", light: "#FFF3B0", pale: "#FFFBE6" },
        ink: "#1A2E1E",
        muted: "#7A9480",
        border: "#C8DFCC",
        cream: "#F6F9F3",
        pod: { DEFAULT: "#6C3FC5", light: "#EDE9FE" },
        vid: { DEFAULT: "#B91C1C", light: "#FEE2E2" }
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Nunito"', "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
