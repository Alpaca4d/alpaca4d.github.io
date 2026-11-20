# Alpaca4d docs on VitePress

The Markdown pages in `../doc`, shown with the website's look, at <https://alpaca4d.github.io/docs/>.
`../doc` is only read: GitBook keeps syncing it as before.

```sh
npm install
npm run dev      # live preview at http://localhost:5173/docs/
npm run build    # static site in dist/, to be served at /docs/
```

Every push to main publishes the website and these docs together, built by
`.github/workflows/pages.yml`.

`npm run sync` (run by both) rebuilds `src/` from `../doc`: README.md becomes index.md,
`{% hint %}` and `{% file %}` become VitePress boxes and download cards, pictures and files go to
`src/public`, and SUMMARY.md becomes the sidebar. A component's picture and its Inputs and
Outputs tables become one card (`scripts/cards.mjs`), and "Relation to OpenSees" folds away.
Formulas are MathJax (`markdown-it-mathjax3`): GitBook's `$$...$$` on lines of its own is shown
on its own, and `$$x$$` within a line becomes `$x$`, inline. (`tslib` is listed only because npm
leaves it out otherwise: two packages share it, and the one it is filed under is for another platform.)
`src/`, `dist/` and the sidebar are generated and not committed.

## The examples

The examples are not in the docs: they are on the website, at <https://alpaca4d.github.io/examples/>,
one folder each in `../examples`. `npm run examples` (the last step of `npm run build`) writes the
gallery and a page per example into `dist-examples/`, in the website's look, with a small picture
for each card, and a page at each example's old address in the docs (`dist/examples/…`) that
sends the reader on. The workflow lays `dist-examples/` over `examples/` at /examples/. Each example page
draws its definition under its picture, zoomable, from the `<slug>-definition.json` beside its
`.gh` (`assets/site/gh-canvas.js`), which Alpaca4d's `Tools/GhCanvas/run.sh` reads from the `.gh`.

An example with a `<slug>-try.json` beside its `.gh` also gets a **Try it** section under its
picture, and a "Try it" tag on its card and picture: a 3D model the reader changes with a few inputs,
drawn by `assets/site/try-it.js` with the site's three.js. The JSON is the definition solved by
Alpaca4d and OpenSees beforehand for every setting of those inputs, written by Alpaca4d's
`Tools/TryIt/bake.sh` in a running Rhino. Nothing is solved in the browser or on a server.
An example on a component's page (the femur's) gets the same: `sync.mjs` puts the viewer under its
`.gh` when a `<name>-try.json` sits beside it in `../doc`, and the theme loads it
(`.vitepress/theme/index.js`, with three.js and `assets/site/try-it.css` from `config.mjs`).

To preview the website, the docs and the examples together, build, then serve the repository at
`/` with `dist/` at `/docs/` and `dist-examples/` over `/examples/`.
