// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn3D: 'fadeIn3D 0.5s ease-out',
      },
      keyframes: {
        fadeIn3D: {
          '0%': { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
};
