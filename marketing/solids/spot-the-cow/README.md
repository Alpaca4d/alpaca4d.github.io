# Spot the Cow: LinkedIn post

A solid concrete cow, 2.4 m long, standing on its four hooves under its own weight, in 5 030 Ten Node
Tetrahedra, coloured by vertical stress. Here: the cow from the front and from the side
(`spot-the-cow.png`, `spot-the-cow-side.png`), the canvas (`grasshopper-definition.png`) and the canvas
beside the result (`spot-the-cow-in-grasshopper.png`). The docs' picture of it is one folder up:
`../spot-the-cow.png`. There is no video.

## What to attach

- **The post:** `spot-the-cow.png`, the cow from the front with its legend.
- **A carousel instead:** `spot-the-cow.png`, `spot-the-cow-side.png`, `spot-the-cow-in-grasshopper.png`.
- **Alt text:** A concrete cow made of small tetrahedra, coloured by vertical stress: its legs blue in
  compression, the top of its neck red in tension.

## The post

Copy everything in the box.

```text
Can you analyse something that isn't a beam or a slab? Like a cow?

I made a 2.4 m concrete cow and stood it on its hooves. It weighs 47 kN.

The legs are squeezed.
The top of the neck is stretched, where the head hangs out.

Hand check on the legs: -0.089 MPa. Model: -0.094 MPa.

Alpaca4d brings any 3D mesh into Grasshopper, and OpenSees solves it.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 90 words.

## Other openings

- "I analysed a concrete cow. The hand check agreed."
- "Not every structure is made of beams."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The cow, with the .gh: https://alpaca4d.github.io/examples/spot-the-cow/
```

## The numbers, if someone asks

| Where | Vertical stress |
| --- | --- |
| Legs, 20 cm up | -0.094 MPa (hand check: 45.7 kN / 0.52 m² = -0.089 MPa) |
| Body, 60 cm up | -0.024 MPa |
| Top of the neck, where the head hangs out past the front legs | +0.11 MPa |

- **The cow:** Keenan Crane's Spot, public domain (CC0); 1.93 m³ of concrete C30/37 at 2 500 kg/m³,
  47.4 kN, and the reactions add up to that. 5 030 Ten Node Tetrahedra on 1 431 corner points, meshed
  with gmsh.
- **Held:** pinned at every node on the ground. The stress right under the hooves, down to -1.4 MPa, is
  a point-support peak, not real: the picture's scale is set to ±0.15 MPa.
- **What it needs:** an OpenSees newer than 3.8.0, built from master since 16 October 2026. And a
  licence: 5 030 elements is over the free 50.
