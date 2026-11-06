# Two-Span Beam: LinkedIn post

A curved steel beam about 30 m long over two spans, a load on each, sized from a list of HEAs by the
Section Optimiser: element by element, and as one section for the whole beam. The folder holds the
beam deflecting (`two-span-beam-deflecting.mp4`, and a `.gif`), the HEA element by element with its
name wherever it changes (`two-span-beam-sections.png`, and `-front`), one HEA for the whole beam
(`two-span-beam-uniform-front.png`), the deflection (`two-span-beam-deflection.png`, and `-front`),
the bending moment and the shear (`two-span-beam-moment.png`, `two-span-beam-shear.png`,
`two-span-beam-moment-and-shear.png`), the definition beside the beam
(`two-span-beam-in-grasshopper.png`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `two-span-beam-sections-front.png`, each element coloured by its HEA, named
  wherever it changes. The post speaks only of what it shows.
- **A carousel instead:** `two-span-beam-sections-front.png`, `two-span-beam-sections.png`, then
  `two-span-beam-in-grasshopper.png`.
- **Not in this post:** `two-span-beam-uniform-front.png` (one HEA for the whole beam), the
  deflection, moment and shear pictures and `two-span-beam-deflecting.mp4` each need a post of
  their own.
- **Alt text:** A curved steel beam over two spans, built in at both ends and pinned in the middle,
  under 150 kN and 200 kN and ten times its own weight, each element coloured by its HEA, the HEA
  named wherever it changes, from HEA180 to HEA500.

## The post

Copy everything in the box.

```text
What if every part of a beam had just the steel it needs?

I drew a curved steel beam, 30 m long, with two heavy loads.

Alpaca4d checked every 25 cm piece to the Eurocode.
Each piece got the smallest section that works.
HEA500 over the middle support. HEA180 where it barely bends.

Each colour is a different size.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 90 words.

## Other openings

- "HEA500 here, HEA180 there. Same beam."
- "Why one size, when the beam needs many?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The beam, with the .gh: https://alpaca4d.github.io/examples/two-span-beam/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Beam | a curve about 30 m long in a vertical plane, elements about 25 cm long |
| Supports | built in at both ends, pinned between the spans |
| Loads | 150 kN and 200 kN, moved by sliders, and ten times the self-weight |
| Starting section | HEA300 in S235 |
| Element by element | HEA180 to HEA500, the largest at the middle support |
| One section for the whole beam | HEA500 |

- **The check:** EN 1993-1-1, as Utilisation does, on the forces each analysis finds; the
  optimiser stops when no section changes.
- **The sections in the pictures:** read off the HEA names the definition writes along the beam.
- **Licence, if asked:** the Section Optimiser needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
