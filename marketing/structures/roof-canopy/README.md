# Roof Canopy: LinkedIn post

A canopy of six T-shaped steel frames, each a column with an arm cantilevering 4 m each way, under
snow lying deeper on one side, analysed with Alpaca4d. The folder holds the canopy deforming
(`roof-canopy-deforming.mp4`, and a `.gif`), the still at full deformation (`roof-canopy-deformed.png`),
the supports and loads (`roof-canopy-loads.png`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `roof-canopy-deforming.mp4`. A 2.7 s loop of the frames leaning under the snow and
  back; it needs no sound.
- **A carousel instead:** `roof-canopy-loads.png` first, the snow on the purlins, then
  `roof-canopy-deformed.png` and `grasshopper-definition.png`.
- **Alt text:** A canopy of T-shaped steel frames leaning under snow lying deeper on one side,
  coloured by its displacement, the deformed shape drawn 30 times its size.

## The post

Copy everything in the box.

```text
What happens when snow piles up on one side of a roof?

I built a canopy of T-shaped steel frames. Each arm reaches 4 m.

Then I put three times more snow on the left.
The left tips drop 7.5 cm.
The arms bend, and the columns lean over.

The video shows it 30 times bigger.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelStructures
```

About 85 words.

## Other openings

- "More snow on one side. What happens?"
- "Snow is never even. Neither is the load."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The canopy, with the .gh: https://alpaca4d.github.io/examples/roof-canopy/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Frames | six, 6 m apart |
| Each frame | an HEA240 column built in at its foot, an IPE270 arm cantilevering 4 m each way, rising 0.4 m to its tip |
| Purlins | IPE140, at the heads and at three points along each arm |
| Bracing | a cross of CHS 60.3x4 between two columns |
| Snow | 1.2 kN/m² on the left, 0.4 kN/m² on the right |
| Left tips drop | 75 mm |

- **The steel:** S355.
- **The picture:** the deformed shape is drawn 30 times its size.
- **Licence, if asked:** the pictures are drawn by Model View, which needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
