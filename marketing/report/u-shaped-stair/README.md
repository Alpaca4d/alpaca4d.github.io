# U-shaped stair report: an example to share

An Alpaca4d example report of beams and shells, a stair: a U-shaped steel stair between floors 4.2 m apart: hollow section stringers and posts as beams, 20 mm steel plate treads and landings as shells, under its own weight, finishes and imposed load, then walked on after SCI P354.

It was written by the Report component from the definition `Tools/Examples/Report/ReportStair.gh` in the Alpaca4d repository - the structure its own example builds, with the analyses and the report beside it. Every picture was drawn by the report itself, there is no Model View on the canvas for it, and the headings are numbered by the report.

HOLD: the Report component is only on the `report-module` branch, in no Yak beta, and has no example page on the website. Share once it is released.

## Files

- `u-shaped-stair-report.pdf`: the report, 10 pages, 10 tables and 13 pictures.
- `u-shaped-stair-page-1.png` to `u-shaped-stair-page-10.png`: each page as a picture.
- `u-shaped-stair-pages.png`: all the pages on one sheet.
- `grasshopper-definition.png`: the definition on the canvas.

## What is in it

- The model: its summary, the sections, and a picture coloured by section with its supports.
- Static analysis: the displacement, the bending moments in the stringers, the Von Mises stress in the plates and the reactions, with their largest and smallest values written on.
- Natural vibration: the first six of twelve modes, with their frequencies and participating mass.
- Footfall: the response factor R over the stair against the limit of 32 for a stair in light use, and the nodes that respond most, with the steady-state factor, its acceleration and the pace that gives it.

## Alt text

Pages of an analysis report of u-shaped stair: tables of the model and its results, and pictures of its displacement, forces and modes in colour, each with its largest and smallest value written on it.
