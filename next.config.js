// const remarkParse = require('remark-parse')
// const remarkGfm = require.resolve('remark-gfm')
// const remarkHtml = require.resolve('remark-html')
// import remarkParse from 'remark-parse';
// import remarkGfm from 'remark-gfm';
// import remarkHtml from 'remark-html';

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  // options: {
  //   remarkPlugins: [],
  //   rehypePlugins: [],
  // },
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
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  // mdx 
  pageExtensions: ['js', 'tsx', 'md', 'mdx'],
})
