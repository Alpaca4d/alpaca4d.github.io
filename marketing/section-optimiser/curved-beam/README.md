# Curved Beam: LinkedIn post

A 12 m steel beam curving in a vertical plane, on three supports and ending in a cantilever, sized
by the Section Optimiser within the IPEs: element by element, and as one section for the whole
beam. The folder holds the beam sized element by element, a colour for each IPE
(`curved-beam-sections.png`, from above at an angle, and `curved-beam-sections-front.png`), the
definition beside the beam (`curved-beam-in-grasshopper.png`) and the canvas
(`grasshopper-definition.png`). There is no video, and no picture of the one-section beam.

## What to attach

- **The post:** `curved-beam-sections.png`, the beam from above at an angle, a colour for each IPE.
- **A carousel instead:** `curved-beam-sections.png`, `curved-beam-sections-front.png`, then
  `curved-beam-in-grasshopper.png`.
- **Alt text:** A curved steel beam sized element by element by the Section Optimiser, a colour for
  each IPE: deep in the middle, slender towards both ends.

## The post

Copy everything in the box.

```text
Where does a curved steel beam need its steel?

I drew a 12 m curved beam. Its end sticks far out, with a load near the tip.

Alpaca4d checked every piece to the Eurocode.
Each piece got the smallest IPE that works.
Each colour is a different size.

It is deep over the supports and slim at both ends.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 90 words.

## Other openings

- "Every colour is a different IPE. One beam."
- "A curved beam, sized piece by piece."

## First comment

The example page is not published yet (it is a draft), so the comment holds only the download link. LinkedIn shows posts with links in them to fewer people, so post it as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Beam | 12 m long, curving in a vertical plane, 30 elements |
| Supports | built in at its start, held up at two more points along its first third |
| Loads | 50 kN near the far end, and its own weight |
| Starting section | IPE300 in S355 |
| Sizing | element by element within the IPEs; and one section from a list of IPEs |

- **The masses:** each optimiser has a Mass panel; the one-section beam is the heavier. The pages
  give no figure, so do not quote one.
- **Licence, if asked:** the Section Optimiser needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
