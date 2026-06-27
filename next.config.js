/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /scholars is now a real page (the "Your scholar" hub). Keep a couple of
      // other guessable aliases pointing at it.
      { source: "/standards", destination: "/scholars", permanent: false },
      { source: "/your-scholar", destination: "/scholars", permanent: false },
    ];
  },
};
module.exports = nextConfig;
