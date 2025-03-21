// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Ensure these paths match your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwind-scrollbar"), // Add this line to use the scrollbar plugin
  ],
};
