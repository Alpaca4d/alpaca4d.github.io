# Femur: LinkedIn post

A thigh bone, the Standardised Femur, held at the knee with the force of the hip on its head, in 3 813
Ten Node Tetrahedra, coloured by displacement. Here: the bone (`femur-displacement.png`), the canvas
(`grasshopper-definition.png`) and the canvas beside the result (`femur-in-grasshopper.png`). The docs'
picture of it is one folder up: `../femur.png`. There is no video.

## What to attach

- **The post:** `femur-displacement.png`, the whole bone with its displacement legend.
- **A carousel instead:** `femur-displacement.png`, `femur-in-grasshopper.png`.
- **Alt text:** A thigh bone made of small tetrahedra, held at the knee, coloured by how far it moves:
  dark at the knee, red at the head.

## The post

Copy everything in the box.

```text
How much does a thigh bone bend when you walk?

Your hip pushes on it with about 2.5 times your weight. For 80 kg, that's 2 kN.

I held a 3D femur at the knee and loaded its head.

The head moves 3.4 mm, mostly sideways.

The model is solid bone all through, so a real one moves more.

Alpaca4d brings 3D meshes into Grasshopper. OpenSees solves them.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #FEA #Biomechanics
```

About 90 words.

## Other openings

- "Your thigh bone moves 3 mm with every step. Roughly."
- "A bone is a structure too."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The femur, with the .gh: https://alpaca4d.github.io/docs/basics/elements/ten-node-tetrahedron.html#femur
```

## The numbers, if someone asks

- **The bone:** the Standardised Femur by Marco Viceconti, University of Sheffield (CC BY 4.0), the
  reference geometry for finite element studies of the femur. Its outer surface rebuilt as a closed
  solid and meshed with gmsh: 3 813 Ten Node Tetrahedra on 1 297 corner points.
- **The material:** cortical bone, E = 17 GPa, ν = 0.3, all through: the canal and the softer bone in
  the ends are filled in, so this femur is stiffer than a real one. An illustration, not biomechanics.
- **Held:** every node in the bottom 2 cm, as a bone potted in cement for a test.
- **The load:** 2 kN, (0.45, 0, -1.95) kN, leaning 13° from the shaft, spread over the 90 nodes within
  15 mm of the top of the head.
- **The result:** the head moves 3.4 mm, mostly sideways; the reactions balance the 2 kN. The first two
  modes, in the same file: 57 and 61 Hz.
- **What it needs:** an OpenSees newer than 3.8.0, and a licence (3 813 elements).
