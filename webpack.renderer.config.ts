import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';

export const rendererConfig: Configuration = {
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
};
