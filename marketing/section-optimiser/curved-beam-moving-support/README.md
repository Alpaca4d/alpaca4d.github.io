# Curved beam, moving support: LinkedIn post

The curved beam example on two supports, 12 m of steel built in at its start and carrying 50 kN near
its far end, with its other support, a roller, walking from 2.3 m to past the load and back. At each node the
Section Optimiser sizes every element again, the first IPE that passes the steel check, smallest area
first. The colour is the section's size, on one scale for the whole loop, from light blue to orange
for an IPE400; the caption under the beam gives where the support is and the steel's mass. Here: the
loop as a GIF and an MP4.

## What to attach

- **The post:** `curved-beam-moving-support.mp4`.
- **A GIF instead:** `curved-beam-moving-support.gif`, where a video will not play.
- **Alt text:** A curved steel beam on two supports, with a load near its far end and the roller
  support sliding along it; the beam is deep and orange when the support is far from the load, and slim and blue when the
  support reaches the load. Under it, the support's position and the steel's mass.

## The post

Copy everything in the box.

```text
Where should the support go?

This curved steel beam carries 50 kN near its far end. One support slides along it.

At every step, Alpaca4d picks the smallest IPE for each piece, checked to the Eurocode.

Far from the load: 483 kg of steel.
Right under the load: 74 kg. Six and a half times less.

You see it while you move the slider.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 70 words.

## Other openings

- "Move one support. Save 80% of the steel."
- "The same beam, the same load. Only the support moves."

## First comment

The example page is not published yet (it is a draft), so the comment holds only the download link.
LinkedIn shows posts with links in them to fewer people, so post it as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Beam | 12 m long, curving in a vertical plane, 30 elements, S355 |
| Supports | built in at its start; one roller, walked from 2.3 m to 11.4 m a node at a time |
| Loads | 50 kN at 10.7 m, and the beam's own weight |
| Sizing | each element on its own, the first IPE that passes, smallest first; top flange held sideways every 0.5 m |
| Steel | 483 kg with the roller at 2.3 m, 74 kg (all IPE80) with it under the load at 10.7 m |
| Sections | IPE80 to IPE400 |

- **Converged:** at every position; the largest utilisation, of any element at any position, is
  0.999.
- **Licence, if asked:** the Section Optimiser needs a licence; without one, Run Analysis takes
  models of up to 50 elements (https://alpaca4d.github.io/docs/references/license.html).
- **Made with:** `Tools/Marketing/run.sh curvedbeam` in the Alpaca4d repository.
