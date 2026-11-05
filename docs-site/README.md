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
`src/public`, and SUMMARY.md becomes the sidebar. `src/`, `dist/` and the sidebar are generated
and not committed.
