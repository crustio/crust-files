
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  
  // options: {
  //   remarkPlugins: [require("remark-gfm")],
  // },
});

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
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config;
  },
  trailingSlash: true,
  compiler: {
    styledComponents: true,
    
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // mdx
  pageExtensions: ["tsx", "mdx", "md"],
  output: 'export',
  // turbopack: {
  //   resolveAlias: {
  //     crypto: "crypto-browserify",
  //     path: "path-browserify",
  //     stream: "stream-browserify",
  //     https: "https-browserify",
  //     http: "stream-http",
  //     // fs: false,
  //     // ['next-mdx-import-source-file']: 'private-next-root-dir/mdx-components'
  //   }
  // }
} satisfies NextConfig;

// export default nextConfig
module.exports = withMDX(nextConfig);
