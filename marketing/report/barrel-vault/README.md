# Barrel vault report: an example to share

An Alpaca4d example report of shells: a concrete barrel vault 16 m across, 5 m high, 24 m long and 120 mm thick, all ASD shells, pinned along its long edges, under its own weight and wind blowing across it.

It was written by the Report component from the definition `Tools/Examples/Report/ReportShells.gh` in the Alpaca4d repository - the structure its own example builds, with the analyses and the report beside it. Every picture was drawn by the report itself, there is no Model View on the canvas for it, and the headings are numbered by the report.

HOLD: the Report component is only on the `report-module` branch, in no Yak beta, and has no example page on the website. Share once it is released.

## Files

- `barrel-vault-report.pdf`: the report, 6 pages, 6 tables and 14 pictures.
- `barrel-vault-page-1.png` to `barrel-vault-page-6.png`: each page as a picture.
- `barrel-vault-pages.png`: all the pages on one sheet.
- `grasshopper-definition.png`: the definition on the canvas.

## What is in it

- The model: its summary, and a picture with its supports and loads.
- Static analysis: the displacement, the Von Mises stress at the top of the shell, and the reactions, with their largest and smallest values written on.
- Natural vibration: the first six modes, with their frequencies and participating mass.
- Linear buckling: the first four buckled shapes and their load factors.

## Alt text

Pages of an analysis report of barrel vault: tables of the model and its results, and pictures of its displacement, forces and modes in colour, each with its largest and smallest value written on it.
