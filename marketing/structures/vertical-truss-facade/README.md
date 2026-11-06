# Vertical Truss Facade: LinkedIn post

A glass wall 12 m wide and 10.8 m tall, held only at its foot and its top, stiffened against the
wind by a vertical truss behind every mullion, analysed with Alpaca4d. The folder holds the wall
deforming (`vertical-truss-facade-deforming.mp4`, and a `.gif`), the still at full deformation
(`vertical-truss-facade-deformed.png`), the supports and loads (`vertical-truss-facade-loads.png`)
and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `vertical-truss-facade-deforming.mp4`. A 2.7 s loop of the wall bowing in the wind
  and back; it needs no sound.
- **A carousel instead:** `vertical-truss-facade-deformed.png`, `vertical-truss-facade-loads.png`,
  then `grasshopper-definition.png`.
- **Alt text:** A glass wall stiffened by vertical trusses behind its mullions, bowing under wind,
  coloured by its displacement, the deformed shape drawn 200 times its size.

## The post

Copy everything in the box.

```text
How do you hold up a glass wall 11 m tall?

It is held only at the floor and at the top.

I put a slim steel truss behind every upright.
In the wind, the wall bends just 3 mm, halfway up.

The video shows it 200 times bigger. Otherwise you would not see it.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FacadeEngineering
```

About 85 words.

## Other openings

- "A glass wall 11 m tall. What keeps it standing?"
- "11 m of glass, and it bends just 3 mm."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The facade, with the .gh: https://alpaca4d.github.io/examples/vertical-truss-facade/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Wall | 12 m wide, 10.8 m tall, held at its foot and its top |
| Grid | mullions every 1.5 m, transoms every 1.8 m |
| Mullions | RHS 120x60x4, the outer chord of each truss |
| Inner chords | CHS 76.1x4, 0.9 m behind |
| Posts and diagonals | CHS 48.3x4, as bars that only pull or push |
| Loads | wind 1.2 kN/m², glass 0.5 kN/m², and the own weight |
| Bow | 3.2 mm, in the middle of its height |

- **The steel:** S355.
- **The picture:** the deformed shape is drawn 200 times its size.
- **Licence, if asked:** the pictures are drawn by Model View, which needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
