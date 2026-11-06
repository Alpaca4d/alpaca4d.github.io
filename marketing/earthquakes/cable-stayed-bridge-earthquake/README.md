# Cable-stayed bridge in an earthquake: LinkedIn post

A cable-stayed bridge, two 80 m spans hung from one H-shaped pylon, shaken across by the first 12 s of
the El Centro earthquake (1940) in a transient analysis with Alpaca4d. Here: the still, the still with
its charts (`-2.png`), the video with its charts (`-shaking.mp4`, and a `.gif`) and the canvas.

## What to attach

- **The post:** `cable-stayed-bridge-earthquake-shaking.mp4`, with the deck's and the pylon's movement
  plotted under the bridge.
- **A carousel instead:** `cable-stayed-bridge-earthquake-2.png`, `cable-stayed-bridge-earthquake.png`,
  `grasshopper-definition.png`.
- **Alt text:** A cable-stayed bridge with an H-shaped pylon swaying across in an earthquake, coloured
  by its displacement, with the ground's acceleration and the movement of its deck and pylon plotted
  underneath.

## The post

Copy everything in the box.

```text
A bridge doesn't move as one piece.

I shook a cable-stayed bridge with a real earthquake record.

The deck swings slowly, about 13 cm.
The top of the tower goes back and forth about three times faster.

You only see this when you watch it move.

With Alpaca4d you build the bridge in Grasshopper, add the earthquake and watch it shake. OpenSees does the maths.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #BridgeEngineering
```

About 90 words.

## Other openings

- "Watch the tower and the deck. They don't move together."
- "What happens to a cable-stayed bridge in an earthquake?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The bridge, with the .gh: https://alpaca4d.github.io/examples/cable-stayed-bridge-earthquake/
```

## The numbers, if someone asks

| | Moves the most, across |
| --- | --- |
| The deck at mid-span | 134 mm |
| The top of the pylon | 93 mm |
| Anywhere on the bridge | 159 mm, 6.1 s in |

- **The bridge:** pylon 35 m above the deck, legs 3.5 m square; girders 1.5 x 2.5 m; stays 110 mm in two
  planes; the girders slide along their abutments, held across.
- **The record:** El Centro north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, 5%
  Rayleigh damping, the bridge's own weight as its mass.
