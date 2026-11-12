# Footbridge report: an example to share

An Alpaca4d example report of beams and shells: a footbridge of 40 m: a 200 mm concrete deck of ASD shells on a steel box girder of beams, tied together by rigid links, under its own weight and a crowd of 5 kN/m2.

It was written by the Report component from the definition `Tools/Examples/Report/ReportMixed.gh` in the Alpaca4d repository - the structure its own example builds, with the analyses and the report beside it. Every picture was drawn by the report itself, there is no Model View on the canvas for it, and the headings are numbered by the report.

HOLD: the Report component is only on the `report-module` branch, in no Yak beta, and has no example page on the website. Share once it is released.

## Files

- `footbridge-report.pdf`: the report, 5 pages, 8 tables and 11 pictures.
- `footbridge-page-1.png` to `footbridge-page-5.png`: each page as a picture.
- `footbridge-pages.png`: all the pages on one sheet.
- `grasshopper-definition.png`: the definition on the canvas.

## What is in it

- The model: its summary, the girder's section, and a picture coloured by section with its supports and loads.
- Static analysis: the displacement, the shear and the bending moment in the box girder, and the Von Mises stress at the top of the deck, with their largest and smallest values written on.
- Natural vibration: the first six modes, with their frequencies and participating mass.
- No reactions: the bearings sit on the girder nodes the deck's rigid links hang from, and the reactions read there leave out what the links carry. To be fixed before they go in.

## Alt text

Pages of an analysis report of footbridge: tables of the model and its results, and pictures of its displacement, forces and modes in colour, each with its largest and smallest value written on it.
