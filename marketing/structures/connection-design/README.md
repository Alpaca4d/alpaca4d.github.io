# Connection Design: LinkedIn post

The cast steel node of a tree column in shells, analysed with Alpaca4d. The folder holds the node
deforming (`connection-design-deforming.mp4`, and a `.gif`), its still
(`connection-design-deformed.png`), the supports and loads (`connection-design-loads.png`) and the
canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `connection-design-deforming.mp4`. A 2.7 s loop, the camera turning; it needs no
  sound.
- **A carousel instead:** `connection-design-deformed.png`, `connection-design-loads.png`, then
  `grasshopper-definition.png`.
- **Alt text:** A cast steel tree-column node in shells, coloured by Von Mises stress, highest where
  the branches meet the sphere.

## The post

Copy everything in the box.

```text
Where does the stress go in a tree column's node?

A trunk, a steel sphere, three branches leaning out.
Joined into one surface in Grasshopper, meshed in quads, analysed as shells.

The stress gathers where each branch meets the sphere: 298 MPa at the peak.
Most of the tubes stay under 100 MPa.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelStructures
```

About 70 words.

## Other openings

- "A tree column's node, in shells."
- "Three branches, one sphere, one trunk. Where does the stress go?"

## First comment

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The node, with the .gh: https://alpaca4d.github.io/examples/connection-design/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Node | trunk CHS 323.9, three branches CHS 219.1 leaning 35°, a 500 mm sphere |
| Shells | ASD Shells of S355, 25 mm thick, quads about 40 mm across |
| Loads | 250 kN down and 25 kN sideways on each branch; trunk built in |
| Von Mises | peak 298 MPa where the branches meet the sphere; most of the tubes under 100 MPa |
| The peak | sits at a corner of the shell model and climbs as the mesh refines: a design check reads it away from the weld |

- **The picture:** the deformed shape is drawn 50 times its size.
- **Licence, if asked:** the node's shells are past the free limit of 50 elements; a licence lifts it (https://alpaca4d.github.io/docs/references/license.html).
