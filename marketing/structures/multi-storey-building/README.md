# Multi-Storey Building: LinkedIn post

A reinforced concrete frame of five storeys with a slab on every floor, under its loads and the wind,
and its first modes, analysed with Alpaca4d. The folder holds the building deforming
(`multi-storey-building-deforming.mp4`, and a `.gif`) and its still
(`multi-storey-building-deformed.png`), the first mode (`multi-storey-building-mode.mp4`, a `.gif`
and `multi-storey-building-mode.png`), the supports and loads (`multi-storey-building-loads.png`)
and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `multi-storey-building-deforming.mp4`. A 2.7 s loop; it needs no sound.
- **A carousel instead:** `multi-storey-building-deformed.png`, `multi-storey-building-loads.png`,
  then `grasshopper-definition.png`.
- **Not in this post:** `multi-storey-building-mode.mp4`, the first mode, needs a post of its own.
- **Alt text:** A five-storey concrete frame with slabs, deformed and coloured by its displacement in
  bands, drawn 200 times its size.

## The post

Copy everything in the box.

```text
A five-storey concrete building, from sliders.

Bays, storeys and the slab mesh are all inputs in Grasshopper.
Beams and slabs share their nodes, so they bend together.

Under the finishes, people and wind, it moves at most 5.3 mm.
Its first mode is at 1.22 Hz.

The video shows it 200 times bigger.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ConcreteStructures
```

About 75 words.

## Other openings

- "120 columns, 760 beams, 1 200 slab quads. One slider changes it."
- "How much does a concrete frame sag and sway?"

## First comment

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The building, with the .gh: https://alpaca4d.github.io/examples/multi-storey-building/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Size | 30 x 15 m, five storeys of 3.5 m, 6 x 5 m bays |
| Members | C30/37: columns 400 x 400, beams 300 x 500, 200 mm slabs as shells |
| Loads | finishes 1.5 kN/m², people 3.0 kN/m², wind 0.8 kN/m², and the own weight, unfactored |
| Most it moves | 5.3 mm, on the top floors |
| First modes | 1.22, 1.23 and 1.40 Hz, then 3.70 Hz |

- **The picture:** the deformed shape is drawn 200 times its size.
- **Licence, if asked:** Run Analysis and Model View are free on models of up to 50 elements; a licence lifts the limit (https://alpaca4d.github.io/docs/references/license.html).
