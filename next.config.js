const remarkParse = require('remark-parse')

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkParse],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  webpack: (config) => {
    config.resolve.fallback = {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      os: false,
      assert: false,
      fs: false,
    }
    return config
  },
  trailingSlash: true,
  // mdx 
  pageExtensions: ['js', 'tsx', 'md', 'mdx'],
})
