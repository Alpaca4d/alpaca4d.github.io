# High-Tension Tower: LinkedIn post

A steel lattice pylon 42 m tall under its wires' weight and the wind, analysed with Alpaca4d. The
folder holds the tower leaning under its loads (`high-tension-tower-deforming.mp4`, and a `.gif`)
and its still (`high-tension-tower-deformed.png`), the supports and loads
(`high-tension-tower-loads.png`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `high-tension-tower-deforming.mp4`. A 2.7 s loop of the pylon leaning and back; it
  needs no sound.
- **A carousel instead:** `high-tension-tower-deformed.png`, `high-tension-tower-loads.png`, then
  `grasshopper-definition.png`.
- **Alt text:** A steel lattice pylon leaning under the wind, coloured by its displacement, the
  deformed shape drawn 40 times its size, its loads on it.

## The post

Copy everything in the box.

```text
How far does a 42 m pylon lean in the wind?

I drew one in Grasshopper: 423 steel tubes, four conductors and an earth wire.

Then I hung the wires on it and let the wind blow.
The top moves 48 mm.
The windward legs are pulled, the leeward ones pushed.

The video shows it 40 times bigger.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelStructures
```

About 80 words.

## Other openings

- "423 steel tubes, one pylon, a windy day."
- "42 m tall, and the top moves 48 mm."

## First comment

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The pylon, with the .gh: https://alpaca4d.github.io/examples/high-tension-tower/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Size | 42 m tall, feet 8 m apart, a shaft 2.4 m wide from 22 m |
| Members | 423 CHS of S355: legs 193.7x10, arm chords 114.3x6.3 as beams; bracing 76.1x4 and struts 60.3x4 as bars |
| Loads | 20 kN and 12 kN of wind at each conductor (the earth wire half), 1.0 kN/m² of wind on the tower, and the own weight |
| Lean at the top | 48 mm, about h/870 |
| Axial forces | from 227 kN of compression to 103 kN of tension |

- **The picture:** the deformed shape is drawn 40 times its size.
- **Licence, if asked:** Run Analysis and Model View are free on models of up to 50 elements; a licence lifts the limit (https://alpaca4d.github.io/docs/references/license.html).
