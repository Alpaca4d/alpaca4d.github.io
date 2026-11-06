# Girder bridge in an earthquake: LinkedIn post

A concrete girder bridge over three spans, a slab on two girders and piers of two columns each, shaken
across by the first 12 s of the El Centro earthquake (1940) in a transient analysis with Alpaca4d.
Here: the still, the still with its charts (`-2.png`), the video with its charts (`-shaking.mp4`, and a
`.gif`) and the canvas.

## What to attach

- **The post:** `girder-bridge-earthquake-shaking.mp4`, with the deck's movement at mid-span plotted
  under the bridge.
- **A carousel instead:** `girder-bridge-earthquake-2.png`, `girder-bridge-earthquake.png`,
  `grasshopper-definition.png`.
- **Alt text:** A concrete girder bridge on two-column piers swaying across in an earthquake, its deck
  slab in bands of displacement, with the ground's acceleration and the deck's movement plotted
  underneath.

## The post

Copy everything in the box.

```text
What happens to a bridge deck in an earthquake?

I shook this concrete bridge with a real earthquake record, sideways.

The piers sway. The deck bends.
The middle of the main span moves the most: 9 cm.
The ends, held by their bearings, barely move.

Each pier is two columns, tied halfway up. You can see them bend.

Build it in Grasshopper, run the earthquake, and Alpaca4d shows you where it moves.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #BridgeEngineering
```

About 90 words.

## Other openings

- "Where does a bridge move most in an earthquake?"
- "Watch the piers bend."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The girder bridge, with the .gh: https://alpaca4d.github.io/examples/girder-bridge-earthquake/
```

## The numbers, if someone asks

- **The bridge:** spans 40 + 50 + 40 m; a 250 mm slab, 12 m wide, as shells, on girders 1 x 2.2 m;
  cross girders every 10 m; piers of two round columns 1.6 m across and 18 m tall.
- **The most it moves:** 90 mm across, in the middle of the main span, 2.2 s in.
- **The record:** El Centro north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, 5%
  Rayleigh damping, the bridge's own weight as its mass.
