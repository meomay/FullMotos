/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1440px",
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
      center: true,
    },
    fontFamily: {
      oswald: ["Inter", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        logo: "url('/asset/images/logo.png')",
        "bg-hero": "url('/asset/images/bg-hero.jpeg')",
        "bg-footer": "url('/asset/images/bg-footer.jpg')",
        "bg-cta": "url('/asset/images/bg-cta.jpeg')",
        "img-map": "url('/asset/images/img-map.png')", //temp
        "bg-helmet": "url('/asset/images/bg-helmet.jpeg')",
        "bg-combo": "url('/asset/images/bg-combo.jpg')",
      },
      aspectRatio: {
        "3/4": "3 / 4",
      },
      colors: {
        primary: "#E10814",
      },
    },
  },
  plugins: [],
};
