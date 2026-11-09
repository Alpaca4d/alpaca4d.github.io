# The Rebellious Slave in tetrahedra: LinkedIn post

Michelangelo's Rebellious Slave (about 1513, Louvre), from SMK's public-domain scan of its plaster
cast, in 28 119 ten-node tetrahedra in Alpaca4d: the vertical stress under its own weight in
iso-surfaces, and its first two modes swaying. Here: the stress from in front (`rebellious-slave.png`)
and from its left, the two modes as stills and GIFs, the canvas, and the canvas beside the statue.

## What to attach

- **The post:** `rebellious-slave.png`, the stress from in front.
- **A carousel instead:** `rebellious-slave.png`, `rebellious-slave-left.png`, `mode-1.gif`,
  `rebellious-slave-in-grasshopper.png`.
- **Alt text:** Michelangelo's Rebellious Slave as a 3D model of small tetrahedra, their edges drawn,
  coloured by the vertical stress its own weight puts in it: compression down the legs, most at the
  ankles, nearly none above the hips.

## The post

Copy everything in the box.

```text
Where does a marble statue carry its weight?

I put Michelangelo's Rebellious Slave into Grasshopper: 28,000 small pieces of marble.

It weighs 875 kg.

The colours show the squeeze. Almost none above the hips. Then down the legs, and most at the ankles, where they are thinnest.

Even there it is under half a megapascal. Marble takes over a hundred times that.

Then it sways: about 50 times a second.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #Michelangelo #ComputationalDesign
```

About 90 words. The statue is 28 119 elements, past the free limit: the CTA offers the free tier,
not this model.

## Other openings

- "Michelangelo, in 28,000 tetrahedra."
- "How hard is a statue's own weight?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The statue, with the .gh: https://alpaca4d.github.io/docs/basics/elements/ten-node-tetrahedron.html#the-rebellious-slave
Scan: SMK, Statens Museum for Kunst, plaster cast KAS86, public domain.
```

## The numbers, if someone asks

- **The statue:** 2.13 m on its plinth, 0.32 m³, 875 kg of Carrara marble (E 50 GPa, ν 0.25,
  2 700 kg/m³), in 28 119 ten-node tetrahedra on 8 406 corners, held under the plinth.
- **The stress:** vertical compression of 0.1 to 0.3 MPa in the legs and 0.35 to 0.4 MPa at the
  ankles; Carrara marble takes about 100 MPa in compression.
- **The modes:** 49.8 Hz forward and back, 59.3 Hz side to side.
- **The scan:** SMK's plaster cast KAS86 of the marble in the Louvre, Public Domain Mark.
