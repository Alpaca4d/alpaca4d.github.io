# Mesh Loft - Mesh Series to Bricks: LinkedIn post

A concrete barrel vault built of bricks from nothing but polylines, analysed with Alpaca4d. The folder
holds the vault deforming under its own weight (`meshloft-meshbrick-deforming.mp4`, and a `.gif`),
its still (`meshloft-meshbrick-deformed.png`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `meshloft-meshbrick-deformed.png`, then `grasshopper-definition.png` as a carousel.
- **Or:** `meshloft-meshbrick-deforming.mp4`, a 2.7 s loop.
- **Alt text:** A concrete barrel vault of bricks, coloured by Von Mises stress, highest along its
  feet.

## The post

Copy everything in the box.

```text
From polylines to a solid in two components.

Mesh Loft turns each row of polylines into a mesh.
Mesh Series to Brick fills the space between two meshes with bricks.

Here: a concrete vault, 1,440 bricks, five through its thickness, under its own weight.
The stress peaks at 0.19 MPa along the feet.
A hand check gives 0.16.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 75 words.

## Other openings

- "Bricks from polylines."
- "A vault, solid, in 1,440 bricks."

## First comment

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The vault, with the .gh: https://alpaca4d.github.io/examples/meshloft-meshbrick/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Size | 8 m span, 2.5 m rise, 6 m long, 400 mm thick |
| Bricks | 5 layers of 24 x 12 SSP bricks, 1,440 in all, C30/37 |
| Load | its own weight |
| Von Mises | 0.04 to 0.19 MPa, highest along the feet |
| By hand at the feet | 49 kN/m down and 39 kN/m of thrust over 0.4 m: 0.16 MPa |

- **The picture:** the deformed shape is drawn 2000 times its size.
- **Licence, if asked:** 1,440 bricks are past the free limit of 50 elements; a licence lifts it (https://alpaca4d.github.io/docs/references/license.html).
