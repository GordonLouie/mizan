/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // OLD BRAND KILL-SWITCH: if the legacy mizaninvesting.com domain(s) are
      // pointed at this project, permanently redirect every path to the
      // HalalGauge equivalent. Two live sites serving the same product under
      // different brands (with diverging verdicts) is a trust disaster —
      // the old domain must only ever 301.
      {
        source: "/:path*",
        has: [{ type: "host", value: "mizaninvesting.com" }],
        destination: "https://www.halalgauge.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mizaninvesting.com" }],
        destination: "https://www.halalgauge.com/:path*",
        permanent: true,
      },
      // Old index slugs (pre-rebrand) → new slugs.
      { source: "/indexes/mizan-halal-50", destination: "/indexes/halal-50", permanent: true },
      { source: "/indexes/mizan-halal-tech", destination: "/indexes/halal-tech", permanent: true },
      { source: "/indexes/mizan-halal-income", destination: "/indexes/halal-income", permanent: true },
      // /scholars is now a real page (the "Your scholar" hub). Keep a couple of
      // other guessable aliases pointing at it.
      { source: "/standards", destination: "/scholars", permanent: false },
      { source: "/your-scholar", destination: "/scholars", permanent: false },
    ];
  },
};
module.exports = nextConfig;
