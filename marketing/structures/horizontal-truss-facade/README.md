# Horizontal Truss Facade: LinkedIn post

A glass facade 24 m wide and 12 m tall, held against the wind by two horizontal trusses spanning
between the building's columns, analysed with Alpaca4d. The folder holds the facade deforming
(`horizontal-truss-facade-deforming.mp4`, and a `.gif`), the still at full deformation
(`horizontal-truss-facade-deformed.png`), the supports and loads (`horizontal-truss-facade-loads.png`)
and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `horizontal-truss-facade-deforming.mp4`. A 2.7 s loop of the facade bowing in the
  wind and back; it needs no sound.
- **A carousel instead:** `horizontal-truss-facade-deformed.png`,
  `horizontal-truss-facade-loads.png`, then `grasshopper-definition.png`.
- **Alt text:** A glass facade held by two horizontal wind trusses, bowing under wind, coloured by
  its displacement, the deformed shape drawn 100 times its size.

## The post

Copy everything in the box.

```text
Can two trusses hold up 24 m of glass?

The building's columns stand 24 m apart. A glass wall fills the gap.

I put two steel trusses behind the glass, running across from column to column.
In the wind, they bend less than 2 cm in the middle.

The video shows it 100 times bigger.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FacadeEngineering
```

About 85 words.

## Other openings

- "24 m of glass, and two trusses to hold it."
- "Columns 24 m apart. Glass in between. What holds it?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The facade, with the .gh: https://alpaca4d.github.io/examples/horizontal-truss-facade/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Facade | 24 m wide, 12 m tall |
| Mullions | RHS 150x100x5, every 2 m, on their feet and held at the top |
| Trusses | two, spanning 24 m, inner chord 1.5 m behind the facade |
| Chords and posts | CHS 114.3x5 and CHS 76.1x4 |
| Diagonals | CHS 60.3x4, as bars that only pull or push |
| Wind | 1.0 kN/m², and the own weight |
| Bow | 17 mm in the middle of the trusses |

- **The steel:** S355.
- **The picture:** the deformed shape is drawn 100 times its size.
- **Licence, if asked:** the pictures are drawn by Model View, which needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
