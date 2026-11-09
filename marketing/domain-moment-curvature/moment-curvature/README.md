# Moment curvature: LinkedIn post

A 300 x 500 mm reinforced concrete section, eight bars along its bottom and three along its top,
bent until it fails under 400 kN of compression, with Alpaca4d's Moment Curvature: its curve drawn
beside the section by Moment Curvature Diagram, first yield and the ultimate state marked. Here: the
section beside its curve (`moment-curvature.png`), the canvas, and the canvas beside the picture.

## What to attach

- **The post:** `moment-curvature.png`.
- **A carousel instead:** `moment-curvature.png`, `moment-curvature-in-grasshopper.png`.
- **Alt text:** A concrete section with eight bars along its bottom and three along its top, beside
  its moment-curvature curve, first yield and failure marked as dots.

## The post

Copy everything in the box.

```text
How much warning does a concrete beam give before it breaks?

I bent this section until it failed: 30 by 50 cm, eight steel bars on the side that stretches.

The orange dot: the steel starts to yield. The red dot: the concrete crushes. 696 kNm.

They are close together. Lots of steel makes it strong, but it barely bends before it goes.

The curve tells you before the site does.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ReinforcedConcrete
```

About 85 words. Moment Curvature needs a licence whatever the section, so the CTA offers the free
tier, not this example.

## Other openings

- "More steel, stronger beam. Better beam?"
- "Bent until it broke."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The section, with the .gh: https://alpaca4d.github.io/examples/moment-curvature/
```

## The numbers, if someone asks

- **The section:** 300 x 500 mm, Concrete01 (C25/30 preset) in 240 fibres, phi 24 ReinforcingSteel
  (B450C) bars 30 mm in from the short faces, eight along one and three along the other; 400 kN of
  compression held.
- **Eight bars in tension (Direction 180):** first yield 666 kNm, ultimate 696 kNm at 0.0143 rad/m,
  the concrete crushing at 3.5 per mille; curvature ductility 1.4; EI to first yield 65 800 kNm2.
- **Three bars in tension (Direction 0):** 329 kNm and 359 kNm at 0.0249 rad/m, a bar reaching its
  ultimate strain; ductility 3.7.
