export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-variable-compress': {},
    ...(process.env.NODE_ENV === 'production'
      ? { cssnano: { preset: 'default' } }
      : {}),
  },
};
