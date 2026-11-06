# Femur Stress Lines: LinkedIn post

The Standardised Femur, held at the knee with the force of the hip on its head, in Ten Node Tetrahedra,
and the principal stress lines through the inside of the bone. Here: the lines through the whole bone
and the head (`femur.png`, `femur-whole.png`, `femur-front.png`), the docs' pictures of a slice 1 cm thick
(`femur-slice.png`) and of the same bone in SSP Bricks (`femur-bricks.png`), the canvas
(`grasshopper-definition.png`) and the canvas beside the result (`femur-in-grasshopper.png`). There is no
video.

## What to attach

- **The post:** `femur.png`, the top of the bone with its lines.
- **A carousel instead:** `femur.png`, `femur-whole.png`, `femur-in-grasshopper.png`.
- **Alt text:** The top of a thigh bone, its inside traced with blue lines running down the inner side
  and purple lines arching over the neck and down the outer side.

## The post

Copy everything in the box.

```text
How does your weight travel through your thigh bone?

I held a 3D femur at the knee. Then I loaded it like a walking step.

Blue lines: squeezing, down the inner side.
Purple lines: stretching, over the neck and down the outer side.

It's an illustration: the model is solid bone all through.

Alpaca4d draws these lines through solids in Grasshopper, from an analysis by OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #FEA #Biomechanics
```

About 85 words.

## Other openings

- "Every step you take, your thigh bone does this."
- "Squeezed on one side, stretched on the other."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The bone:** the Standardised Femur (Marco Viceconti, University of Sheffield, CC BY 4.0), 3 813 Ten
  Node Tetrahedra, cortical bone E = 17 GPa, ν = 0.3, all through: stiffer than a real femur.
- **The load:** 2 kN on the head, about two and a half times the weight of an 80 kg person when walking,
  leaning 13° from the shaft; held at the knee.
- **The lines:** a field grown from seeds in the bone's middle plane; compression (SL3) in blue, tension
  (SL1) in purple. In the docs' pictures, `femur-slice.png` and `femur-bricks.png`, tension is orange.
- **Licence:** 3 813 elements is over the free 50. It needs an OpenSees newer than 3.8.0.
