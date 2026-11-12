# Two-storey frame report: LinkedIn post

A two-storey steel frame analysed four ways in Alpaca4d - static, natural vibration, linear
buckling and footfall - and written up as a ten-page PDF by the Report component, from the report components: a
page with the office's title block, texts, tables and Report Views, in order. Every picture in it was
drawn by the report itself; there is no Model View on the canvas. Here: the PDF,
each page as a picture (`-page-1.png` to `-page-10.png`), all ten on one sheet (`-pages.png`) and
the canvas.

HOLD: the Report component is only on the `report-module` branch, in no Yak beta, and has no
example page on the website. Post once it is released.

## What to attach

- **The post:** `two-storey-frame-report.pdf`, as a LinkedIn document post, so people flip
  through the pages.
- **A carousel instead:** `two-storey-frame-page-7.png`, `two-storey-frame-page-1.png`,
  `two-storey-frame-page-4.png`, `grasshopper-definition.png`.
- **Alt text:** Pages of an analysis report of a two-storey steel frame: tables of the model and its
  natural frequencies, and pictures of its mode shapes and buckled shapes in colour.

## The post

Copy everything in the box.

```text
How long does it take you to write up an analysis?

This ten-page report took 3 seconds.

You lay it out once in Grasshopper.
Your title block on every page.
The tables of the model, and of each result after its picture.
Each mode shape, with the natural frequencies after them.
The buckling factors, with the buckled shapes.
The footfall response, coloured over the floors.

Change the model. Press the button. The report follows.
No screenshots. No copy and paste.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #Rhino3D
```

About 85 words.

## Other openings

- "Still pasting screenshots into your reports?"
- "Write the template once. Get the report every time."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

- **The frame:** 6 x 4 m on plan, two storeys of 3.5 m, fixed at its feet; HEB200 columns, IPE300
  and IPE240 beams, S355; 48 elements, 3,100 kg.
- **The report:** 10 pages, 11 tables, 16 pictures, written in about 3 s once the analyses had run.
- **What it found:** 14.9 mm at most under the loads; first mode 4.70 Hz; first buckling factor
  13.5; footfall response factor 0.25 at most, walking, 3% damping.
