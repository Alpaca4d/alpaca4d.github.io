# A twisting tower in an earthquake: LinkedIn post

A thirty-storey concrete tower that turns a quarter turn from its foot to its roof, shaken by the first 20 s of El Centro (1940) in a transient analysis with Alpaca4d. Here: the still (`twisting-tower-earthquake.png`), the still with its charts beside it (`twisting-tower-earthquake-2.png`), the video with
its charts (`twisting-tower-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `twisting-tower-earthquake-shaking.mp4`. It is 20 s long and plays muted; the charts beside it tell the story
  without sound.
- **A carousel instead:** `twisting-tower-earthquake-2.png`, `twisting-tower-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** A thirty-storey tower twisting a quarter turn from its foot to its roof, swaying under an earthquake, coloured from blue at the ground to orange at the top, with the ground's acceleration and the roof's movement plotted beside it.

## The post

Copy everything in the box.

```text
Does a twisting tower dance differently?

30 floors. A quarter turn from the ground to the roof.
One real earthquake.

The twist makes it a little softer: it swings every 3.2 s instead of 2.6.
But it fights twisting harder: its leaning columns spiral round it like a brace.
The roof: 36 cm at the most.

Build the form in Grasshopper. Shake it. See the answer in minutes.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "Twist a tower. Then shake it."
- "Every floor turned 3 degrees. What does the earthquake think?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/twisting-tower-earthquake/
```

## The numbers, if someone asks

- **Roof corner:** 360 mm at the most, 4.9 s in
- **Periods:** 3.2 s (2.6 s straight), first twist 1.6 s (2.1 s straight)
- **The tower:** 30 storeys of 3.5 m, 4 x 4 bays of 7 m, concrete columns 1 x 1 m, beams 0.45 x 0.8 m, 220 mm slabs
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 5%.
