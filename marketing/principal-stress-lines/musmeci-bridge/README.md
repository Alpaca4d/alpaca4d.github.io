# Musmeci Bridge: LinkedIn post

A concrete membrane form-found by Kangaroo on paired footings over four spans, after Sergio Musmeci's
bridge over the Basento at Potenza, analysed with Alpaca4d, with its principal stress lines in its
surface; for the pictures, a deck on its crowns and the ground under it. Here: walking under it
(`musmeci-bridge-walk-through.mp4`), the form being found (`musmeci-bridge-form-finding.mp4`), the
bridge spinning (`musmeci-bridge-spin.mp4`), each with a `.gif`; from three sides, from the valley and
from under it (`musmeci-bridge.png`, `-clean.png`, `-elevation.png`, `-top.png`, `-from-the-valley.png`,
`-below.png`), the canvas (`grasshopper-definition.png`) and the canvas beside the result
(`musmeci-bridge-in-grasshopper.png`).

## What to attach

- **The post:** `musmeci-bridge-walk-through.mp4`. 7 s walking under the vaults; it needs no sound.
- **A carousel instead:** `musmeci-bridge-from-the-valley.png`, `musmeci-bridge-below.png`,
  `musmeci-bridge.png`, `musmeci-bridge-in-grasshopper.png`.
- **Alt text:** Walking under a bridge of four thin concrete vaults on paired footings, their surface
  covered in purple and blue lines that show where the forces flow.

## The post

Copy everything in the box.

```text
Can a bridge be one thin, curved sheet of concrete?

Sergio Musmeci built one over the Basento, at Potenza.

I made my own from an 80 m net. Kangaroo pushed it up into four vaults, about 11 m high.

Then I made it 30 cm of concrete, under its own weight.

The lines show where the forces flow.

Alpaca4d checks it with OpenSees, in the same Grasshopper file.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ShellStructures
```

About 90 words.

## Other openings

- "A bridge made of one curved sheet. Walk under it."
- "Kangaroo found the shape. Here is how it carries itself."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The form:** a flat net 80 x 12 m in 80 x 12 quads, held at a pair of footings on every pier line,
  four spans of 20 m, pushed up by a load on every node, its edges springs as long as the flat net's;
  Kangaroo's Zombie Solver finds four vaults rising about 11 m, their free edges arching between the
  footings.
- **The shell:** concrete, 300 mm thick, pinned at the footings, under its own weight; membrane lines.
- **For the pictures:** a deck resting on the vaults' crowns, and the ground. The analysis is the
  membrane alone.
- **Needs:** Kangaroo2, which Rhino 7 and 8 ship; a licence, as 960 shells is over the free 50. No
  example page: the definition was made for these pictures.
