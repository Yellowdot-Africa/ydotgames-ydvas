/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(179.68deg, #FFCB05 71.6%, #000000 124.81%)',
        'darrk-gradient': 'linear-gradient(172.97deg, #221F20 0%, #000000 97.87%)',
        'nav-gradient': 'linear-gradient(91.48deg, #000000 0.51%, #666666 129.52%)',
        'background': 'linear-gradient(148.78deg, rgba(255, 255, 255, 0.1) 56.01%, rgba(153, 153, 153, 0.02) 81.13%)',
        'custom-t-gradient': 'linear-gradient(180deg, rgba(133, 133, 133, 0.4) 0%, rgba(64, 64, 64, 0.4) 100%)',
        'foot-nav-gradient': 'linear-gradient(180deg, rgba(221, 221, 221, 0.4) 0%, rgba(241, 241, 241, 0.4) 100%)',
        'profile-gradient': 'linear-gradient(174.25deg, #FFCB05 9.24%, #000000 41.91%)',
        'button-gradient': 'linear-gradient(90deg, #4A3B0B 0%, #FFCB05 50%, #4A3B0B 100%)',

      },
      boxShadow: {
        'custom-shadow': '0px 3px 4px 0px #00000040',
        'box-shadow': '0px 4px 4px 0px #00000040',

      },
    
      colors: {
        'dark-gradient': 'linear-gradient(172.97deg, #221F20 0%, #000000 97.87%)',
      },
      fontFamily: {
       
        'mtn-brighter-regular': ['mtn-brighter-regular', 'sans-serif'],
        'mtn-brighter-light': ['mtn-brighter-light', 'sans-serif'],
        'mtn-brighter-medium': ['mtn-brighter-medium', 'sans-serif'],
        'mtn-brighter-bold': ['mtn-brighter-bold', 'sans-serif'],
        'mtn-brighter-xtra-bold': ['mtn-brighter-xtra-bold', 'sans-serif'],
      },
      fontWeight: {
        'light': 300,
        'regular': 400,
        'medium': 500,
        'bold': 700,
        'extrabold': 800,
      }
    },
  },
  plugins: [],
}

