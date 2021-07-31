module.exports = {
  mode: "jit",
  purge: {
    enabled: true,
    content: ["src/views/*.ejs"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
