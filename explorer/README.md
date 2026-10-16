# Alpaca4d Explorer

A web page for exploring a design study made with the Alpaca4d Explorer components in
Grasshopper: parallel coordinates to filter on, a gallery, a table and a scatter of the designs
that pass, and each design's values, picture and 3D model.

Live at <https://alpaca4d.github.io/explorer/>.

## Opening a study

The page opens on the sample study, under a card to drop a folder on or type an address in.
*Explore the sample*, or *Esc*, puts the card away.

- **A folder on this computer**: drop it on the page, or *Choose folder* on the card, or
  *Open ▸ Study folder…*. The files are read by the browser and never uploaded.
- **A folder on the web**: the address field on the card, *Open ▸ From a web address…*, or
  `?study=<address>` in the URL. The server has to allow cross-origin reads; GitHub
  (`github.com/<user>/<repo>/tree/<branch>/<path>`) does, and its folder links are turned into
  raw ones. `&design=12` opens a design. An address that does not open leaves the card up, with
  the address in its field.
- **The sample**: behind the card, or `?study=sample/footbridge/`.

## The study folder

```
data.csv
12_2.5_HEA200.png      one picture per design, or one per view
12_2.5_HEA200.glb      the 3D model, glTF binary, Y up, metres
```

`data.csv` has a header row and one row per design. Its columns:

| Column | Holds |
| --- | --- |
| `in:Name` | An input. Numbers become numeric axes, anything else a category axis. |
| `out:Name` | A result. |
| `img` | The picture, relative to data.csv or a full URL. Several pictures are `img:View` each (`img_1` also works). |
| `threeD` | The 3D model, a `.glb` or `.gltf`. |
| `Rating` | Stars, 1 to 5; read on open and written on export. |
| anything else | A numeric column becomes an axis; text is shown with the design. |

A `.glb` may carry labels - Rhino's text dots and text - in its scene's extras, as
`{"alpaca4d": {"labels": [{"text", "position": [x, y, z], "color": "#rrggbb", "kind": "dot" | "text"}]}}`,
positions in the file's own frame. The 3D view draws them facing the camera.

An empty cell, `NaN` or `-999` is no data. A unit in brackets, `Span [m]`, is shown under the
axis name. Studies made with Colibri for Design Explorer open as they are, apart from their
Spectacles 3D models, which are not shown.

## Running it locally

ES modules do not load from `file://`, so serve the site root and open `/explorer/`:

```
cd alpaca4d.github.io
python3 -m http.server 8000
# http://localhost:8000/explorer/
```

There is no build step. D3 and three.js are in `vendor/`, at fixed versions, so the page loads
nothing from anywhere else.

| File | Does |
| --- | --- |
| `js/main.js` | Opening studies, the top bar, drag and drop, keys |
| `js/study.js` | Reading data.csv and finding its files |
| `js/state.js` | Filters, goals, Pareto front, colours, sorting, ratings; remembered per study in the browser |
| `js/parcoords.js` | Parallel coordinates: canvas lines, SVG axes and brushes |
| `js/results.js` | Gallery, table, scatter |
| `js/detail.js` | The selected design |
| `js/viewer3d.js` | The 3D view, loaded the first time 3D is asked for |

## The sample

`sample/footbridge` is a steel truss footbridge: span, depth, panels and chord section against
mass, deflection, utilisation and first frequency, 108 designs. It is made by
`sample/make_sample.py` from hand-calculation estimates, not by an Alpaca4d analysis; run it
again after changing it.

## Credits

The Explorer grew out of [Design Explorer](https://github.com/tt-acm/DesignExplorer), MIT
License, and keeps its study format. See `LICENSE`.
