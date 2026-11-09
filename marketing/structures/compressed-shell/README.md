# Compressed shell: LinkedIn post

A concrete shell of four legs, 20 m from end to end and 8 m high at its crown, form-found with Kangaroo
to carry its own weight in compression, then analysed in Alpaca4d: under its own 63.5 t it moves at
most 0.29 mm. Here: its deformed shape in iso-surfaces (`compressed-shell-deformed.png`), its supports
and weight (`compressed-shell-loads.png`), the GIF of it deforming and the canvas.

## What to attach

- **The post:** `compressed-shell-deforming.gif`.
- **A carousel instead:** `compressed-shell-deformed.png`, `compressed-shell-loads.png`,
  `grasshopper-definition.png`.
- **Alt text:** A concrete shell standing on four legs with an opening at its crown, coloured in bands
  of how far it moves under its own weight, the movement drawn 2000 times larger.

## The post

Copy everything in the box.

```text
How little can 64 tonnes of concrete move?

This shell stands on four legs, 20 metres across. It is 15 cm thick.

Its shape was found, not drawn: pushed up like a balloon, held at its feet. That is the shape that only squeezes, never bends.

Under its own weight it moves less than a third of a millimetre. Here it is drawn 2000 times larger.

Find the form, then check it, in one Grasshopper file.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #Kangaroo #StructuralEngineering #ShellStructures
```

About 90 words. The shell is 256 elements, past the free limit: the CTA offers the free tier, not
this model.

## Other openings

- "The shape that only squeezes."
- "15 cm of concrete, 20 m across."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The shell, with the .gh: https://alpaca4d.github.io/examples/compressed-shell/
```

## The numbers, if someone asks

- **The form:** a cross of four legs, 20 m from end to end, its crown 8 m up, with an opening at the
  top; a coarse net of 16 quads refined to 256 by Kangaroo, its edges strings shortening to nothing,
  every node pushed up, held at the ends of the legs.
- **The shell:** 150 mm of concrete (E 30 GPa, 2 500 kg/m³) as 256 ASD shells, built in at the leg
  ends; 63.5 t.
- **The most it moves:** 0.29 mm under its own weight.
