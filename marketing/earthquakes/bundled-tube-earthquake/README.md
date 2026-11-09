# A bundled tube in an earthquake, after the Willis Tower: LinkedIn post

A 108-storey steel tower of nine bundled tubes, modelled after the structure of the Willis Tower in Chicago, shaken by all 31 s of El Centro (1940) with Alpaca4d. Here: the still (`bundled-tube-earthquake.png`), the still with its charts beside it (`bundled-tube-earthquake-2.png`), the video with
its charts (`bundled-tube-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `bundled-tube-earthquake-shaking.mp4`. It is 31 s long and plays muted; the charts beside it tell the story
  without sound.
- **A carousel instead:** `bundled-tube-earthquake-2.png`, `bundled-tube-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** A 108-storey steel tower of nine square tubes stopping at different heights, swaying under an earthquake, coloured by displacement, with the ground's acceleration and the roof's movement plotted beside it.

## The post

Copy everything in the box.

```text
Nine tubes. 108 floors. One earthquake.

I modelled the structure of the Willis Tower: nine square steel tubes, bundled, stopping at floors 50, 66, 90 and 108.
20,000 members. Every floor a rigid diaphragm.

It swings once every 8.5 s.
The roof: 73 cm at the most.

A supertall in Grasshopper, analysed on a laptop.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "How does a 108-storey tower ride out an earthquake?"
- "Nine tubes, bundled. The idea that made the Willis Tower possible."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/bundled-tube-earthquake/
```

## The numbers, if someone asks

- **Roof:** 730 mm at the most, 10.4 s in; the top of the 50-storey tubes 352 mm
- **Period:** 8.5 s
- **The model:** nine 22.9 m tubes, steel box columns 900 x 60 mm 4.6 m apart, HEM1000 spandrels, belt trusses at three floors, 800 kg/m2 floors; 20 900 elements
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 2%. A model of how the structure works, not of the tower.
