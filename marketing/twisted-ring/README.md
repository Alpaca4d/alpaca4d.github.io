# Twisted Ring: LinkedIn post

The geometry of a twisted ring truss, from fourteen sliders and a list in one Python component, for
an exercise on the Section Optimiser and on multi-objective design. Geometry only: there is no
analysis yet. The folder holds one picture, as `twisted-ring.png` and `twisted-ring.svg`: a diamond
profile turning once round an elliptical ring, the chords dark, the frames blue, the bracing orange
and the diaphragms purple.

## What to attach

- **The post:** `twisted-ring.png`. Post it only as an invitation, as below: the ring has no page on the website and no analysis yet. Better still, wait until it has an example page.
- **A carousel instead:** none; this folder has the one picture.
- **Alt text:** A twisted ring truss: a diamond profile turning once round an elliptical ring, its
  chords dark, frames blue, bracing orange and diaphragms purple.

## The post

Copy everything in the box.

```text
This is where a design starts.

A ring of steel truss that twists as it goes round.
Its four-sided profile turns once on the way.
Fourteen sliders set its size, waves, twist and bracing.

It is only a shape so far. No supports, no loads.
That part is yours.

With Alpaca4d, the same lines become a structure you can analyse and size.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #StructuralEngineering #ParametricDesign
```

About 85 words.

## Other openings

- "Fourteen sliders, one twisted ring."
- "Every structure starts as a shape."

## First comment

The ring has no page on the website yet, so the comment holds only the download link. LinkedIn shows posts with links in them to fewer people, so post it as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

| Slider | Range, and where it opens |
| --- | --- |
| Radius X, Radius Y | 18 to 22 m, 20 m: an ellipse when they differ |
| Wave height, waves | 0 to 2 m and 0 to 3 times round |
| Swell, swells | −50 to 50 % and 0 to 8 times round |
| Sides | 3 to 8, 4 |
| Width, depth of the profile | 1 to 3 m, 1.5 m and 3 m |
| Twist steps | −12 to 12, 2 |
| Slices | 40 to 60, 48 |
| Bracing | None, Diagonal, Zigzag, Checkerboard, Cross or K |

- **A twist step:** 360/Sides degrees when the width equals the depth; otherwise 180 with an even
  number of sides and 360 with an odd one, so that the ring always closes.
- **The picture's settings:** not recorded with it.
- **Licence, if asked:** the ring itself is a plain Python component; analysing it needs Run Analysis, which without a licence takes models of up to 50 elements, and sizing it needs the Section Optimiser, which needs a licence (https://alpaca4d.github.io/docs/references/license.html).
