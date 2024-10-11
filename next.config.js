const nextMdx = require("@next/mdx");

const withMDX = nextMdx({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [require("remark-gfm")],
    rehypePlugins: [],
  },
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      os: false,
      assert: false,
      fs: false,
    };
    return config;
  },
  trailingSlash: true,
  compiler: {
    styledComponents: true,
  },
  // mdx
  pageExtensions: ["tsx", "md", "mdx"],
};

// export default nextConfig
module.exports = withMDX(nextConfig);
