export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-variable-compress': ['x', 'y'],
    ...(process.env.NODE_ENV === 'production'
      ? { cssnano: { preset: 'default' } }
      : {}),
  },
};
