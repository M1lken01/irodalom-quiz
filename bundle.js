'use strict';
const fs = require('fs');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier');

fs.writeFileSync('src/build/style.css', new CleanCSS().minify(fs.readFileSync('src/style.css', 'utf8')).styles);

let htmlContent = fs.readFileSync('src/index.html', 'utf8');
htmlContent = htmlContent.replace('<!-- style -->', `<style>${fs.readFileSync('src/build/style.css', 'utf8')}</style>`);
htmlContent = htmlContent.replace('<!-- script -->', `<script defer>${fs.readFileSync('src/build/script.js', 'utf8')}</script>`);

fs.writeFileSync(
  'dist/index.html',
  htmlMinifier.minify(htmlContent, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
  }),
);
