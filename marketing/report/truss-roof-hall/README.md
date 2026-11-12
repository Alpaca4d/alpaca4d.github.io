# Truss roof hall report: an example to share

An Alpaca4d example report of beams: a steel hall 24 m across and 30 m long, five bays of Pratt trusses on HEA300 columns, every member a beam - the webs and the bracing pinned at their ends - under its own weight, finishes and snow, factored.

It was written by the Report component from the definition `Tools/Examples/Report/ReportBeams.gh` in the Alpaca4d repository - the structure its own example builds, with the analyses and the report beside it. Every picture was drawn by the report itself, there is no Model View on the canvas for it, and the headings are numbered by the report.

HOLD: the Report component is only on the `report-module` branch, in no Yak beta, and has no example page on the website. Share once it is released.

## Files

- `truss-roof-hall-report.pdf`: the report, 9 pages, 10 tables and 15 pictures.
- `truss-roof-hall-page-1.png` to `truss-roof-hall-page-9.png`: each page as a picture.
- `truss-roof-hall-pages.png`: all the pages on one sheet.
- `grasshopper-definition.png`: the definition on the canvas.

## What is in it

- The model: its summary, the sections, the supports, and a picture coloured by section with the supports and loads.
- Static analysis: the displacement, the axial force and the bending moment in the members, and the reactions at the twelve feet, each picture with its largest and smallest value written on it and its table after it.
- Natural vibration: the first six modes, with their frequencies and participating mass.
- Linear buckling: the first four buckled shapes and their load factors.

## Alt text

Pages of an analysis report of truss roof hall: tables of the model and its results, and pictures of its displacement, forces and modes in colour, each with its largest and smallest value written on it.
