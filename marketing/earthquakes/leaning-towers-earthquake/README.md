# Two leaning towers in an earthquake: LinkedIn post

Two steel towers of 26 and 20 storeys leaning 15 degrees towards each other over a street, shaken along the way they lean by the first 20 s of El Centro (1940) with Alpaca4d. Here: the still (`leaning-towers-earthquake.png`), the still with its charts under it (`leaning-towers-earthquake-2.png`), the video with
its charts (`leaning-towers-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `leaning-towers-earthquake-shaking.mp4`. It is 20 s long and plays muted; the charts under it tell the story
  without sound.
- **A carousel instead:** `leaning-towers-earthquake-2.png`, `leaning-towers-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** Two steel towers leaning towards each other over a street, swaying out of step under an earthquake, with the ground's acceleration and each tower's top plotted underneath.

## The post

Copy everything in the box.

```text
Two towers lean towards each other over a street. Then the ground shakes.

26 floors and 20 floors. 15 degrees each.

They don't move together. The taller one swings slower.
At one moment the gap between their tops closes by half a metre.

That's the check that matters when you put two towers this close, or a bridge between them.

Leaning geometry, a real earthquake, in Grasshopper.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "How close can two leaning towers stand?"
- "Same earthquake. Two towers. Out of step."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/leaning-towers-earthquake/
```

## The numbers, if someone asks

- **Tops:** west 426 mm, east 190 mm at the most; the gap closes by up to 512 mm
- **Periods:** 3.0 s (west), 2.3 s (east)
- **The towers:** steel frames of 3 x 4 bays of 7.5 m, box columns 600 x 40 mm, HEB600 beams, 200 mm slabs; 60 m apart at the ground
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 5%.
