# Curved beam, moving load: LinkedIn post

The curved beam example on two supports, 12 m of steel built in at its start, held up by a roller at
4.0 m and cantilevering 8 m beyond it, with a 50 kN load walking along it from the start to the tip
and back. At each node the
Section Optimiser sizes every element again, the first IPE that passes the steel check, smallest area
first. The colour is the section's size, on one scale for the whole loop, from light blue for an
IPE80 to orange for an IPE400; the caption under the beam gives where the load is and the steel's
mass. Here: the loop as a GIF and an MP4.

## What to attach

- **The post:** `curved-beam-moving-load.mp4`.
- **A GIF instead:** `curved-beam-moving-load.gif`, where a video will not play.
- **Alt text:** A curved steel beam on two supports, a load arrow walking along it; the beam turns
  deep and orange over the roller when the load is out on the cantilever, and slim and blue when
  the load sits over the roller. Under it, the load's position and the steel's mass.

## The post

Copy everything in the box.

```text
Move the load. Watch the beam change.

This is a 12 m curved steel beam. A 50 kN load walks along it.

At every step, Alpaca4d sizes each piece again: the smallest IPE that passes the Eurocode check.

The colour is the size. Blue is slim, orange is deep.

Load over the support: 74 kg of steel is enough.
Load at the tip: it takes 517 kg.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 70 words.

## Other openings

- "Where should the steel go? It depends on the load."
- "One load, 29 positions, 29 designs."

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
| Supports | built in at its start; held up at 4.0 m (a roller) |
| Loads | 50 kN, walked from 0.7 m to 12.0 m a node at a time; and the beam's own weight |
| Sizing | each element on its own, the first IPE that passes, smallest first; top flange held sideways every 0.5 m |
| Steel | 74 kg (all IPE80) with the load over the roller, 517 kg with it at the tip |
| Sections | IPE80 to IPE400 |

- **Converged:** at every position; the largest utilisation, of any element at any position, is
  0.998.
- **Licence, if asked:** the Section Optimiser needs a licence; without one, Run Analysis takes
  models of up to 50 elements (https://alpaca4d.github.io/docs/references/license.html).
- **Made with:** `Tools/Marketing/run.sh curvedbeam` in the Alpaca4d repository.
