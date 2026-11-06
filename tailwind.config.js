/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        green: { dark: "#1B1F1C", mid: "#2B3D32", soft: "#8FA396", light: "#E7E8E5", pale: "#F2F2EF" },
        yellow: { dark: "#7D6F4E", mid: "#B5A67C", soft: "#CDBF9A", light: "#F3F0E8", pale: "#FAF9F5" },
        ink: "#1B1F1C",
        muted: "#8A8E8A",
        border: "#E2E3E0",
        cream: "#F8F8F6",
        pod: { DEFAULT: "#3F4441", light: "#F2F2F0" },
        vid: { DEFAULT: "#B91C1C", light: "#FEE2E2" }
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
