/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Common guessed URLs for the scholar/standards content → methodology.
      { source: "/scholars", destination: "/methodology", permanent: false },
      { source: "/standards", destination: "/methodology", permanent: false },
    ];
  },
};
module.exports = nextConfig;
