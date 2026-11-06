# Arch bridge in an earthquake: LinkedIn post

A concrete deck arch, 80 m across, of two ribs leaning in and braced, shaken across by the first 12 s
of the El Centro earthquake (1940) in a transient analysis with Alpaca4d. Here: the still, the still
with its charts (`-2.png`), the video with its charts (`-shaking.mp4`, and a `.gif`) and the canvas.

## What to attach

- **The post:** `arch-bridge-earthquake-shaking.mp4`, with the deck's movement at the crown plotted
  under the bridge.
- **A carousel instead:** `arch-bridge-earthquake-2.png`, `arch-bridge-earthquake.png`,
  `grasshopper-definition.png`.
- **Alt text:** A concrete deck arch of two braced ribs swaying across in an earthquake, coloured by its
  displacement, with the ground's acceleration and the deck's movement at the crown plotted underneath.

## The post

Copy everything in the box.

```text
How does an arch bridge move in an earthquake?

I shook this one with a real earthquake record, sideways across the bridge.

The top of the arch moves the most: about 6 cm.
The feet stay put.

Its two ribs lean towards each other and are tied together. That's what holds it sideways.

Build your own arch in Grasshopper, and Alpaca4d shows you how it moves.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #BridgeEngineering
```

About 90 words.

## Other openings

- "Watch an arch bridge ride out an earthquake."
- "Where does an arch move the most?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The arch bridge, with the .gh: https://alpaca4d.github.io/examples/arch-bridge-earthquake/
```

## The numbers, if someone asks

- **The most it moves:** 62 mm across, at the crown, 2.7 s in.

- **The arch:** box ribs 3 x 1.6 m; nine pairs of spandrel columns; a 250 mm slab, 11 m wide, on two
  girders and floor beams; the deck slides along its abutments, held across.
- **The record:** El Centro north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, 5%
  Rayleigh damping, the bridge's own weight as its mass.
