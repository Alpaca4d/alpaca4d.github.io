# Stress Lines Benchmarks: LinkedIn post

The checks of Principal Stress Lines against closed-form solutions: a round bar twisted and pulled, and
Timoshenko and Goodier's cantilever and simply supported beam, through solids; and the shells' cantilever,
plate with a hole and slab in bending. Here: the twisted bar (`twisted-bar.png`, `twisted-bar-field.png`),
the solid beams against their closed forms and as fields of lines in bricks
(`cantilever-against-closed-form.png`, `cantilever-field-bricks.png`,
`simply-supported-against-closed-form.png`, `simply-supported-field-bricks.png`), the shells
(`shells-cantilever.png`, `shells-slab-bending.png`, `shells-all-three.png`) and the shells' canvas
(`grasshopper-shells.png`). There is no video.

## What to attach

- **The post:** `twisted-bar.png`, the bar with its spiralling lines.
- **A carousel instead:** `twisted-bar.png`, `twisted-bar-field.png`. The beam and shell checks would
  make posts of their own.
- **Alt text:** A square bar, nearly clear, with orange and blue lines spiralling round its axis in
  opposite directions and short purple lines pointing straight out from it.

## The post

Copy everything in the box.

```text
Twist a bar and pull it. The lines of force should be spirals. Are they?

They are. Orange is stretched, blue is squeezed. They wind opposite ways.

It's one of my checks against textbook answers.

On average, every check is within 0.1 to 0.6 degrees of the exact answer.

Alpaca4d draws these lines through solids in Grasshopper, from an analysis by OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 85 words.

## Other openings

- "Twist it, pull it, and the forces spiral."
- "Before you trust a picture, check it against the textbook."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The bar:** in Ten Node Tetrahedra, twisted and pulled. Its tension (orange) and compression (blue)
  lines are helices winding opposite ways round the axis; the middle principal stress (purple) points
  straight out from it.
- **The solid checks:** the twisted bar, Boussinesq's point load on a half-space, and Timoshenko and
  Goodier's cantilever and simply supported beam, on models OpenSees solved: the lines follow the exact
  directions to within 0.1–0.6° on average, on Ten Node Tetrahedra and on SSP Bricks alike.
- **Near supports and loads:** a beam held and loaded as it would be drawn follows them as closely only
  more than a depth away from its supports and loads.
- **The shell checks:** within half a degree on average, on meshes as coarse as eight shells across a
  beam's depth.
