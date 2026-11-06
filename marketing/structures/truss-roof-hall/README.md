# Truss Roof Hall: LinkedIn post

A steel hall 24 m across and 30 m long, six Pratt trusses on columns, under its own weight, roof
finishes and snow, analysed with Alpaca4d. The folder holds the hall deforming
(`truss-roof-hall-deforming.mp4`, and a `.gif`), the still at full deformation
(`truss-roof-hall-deformed.png`), the supports and loads (`truss-roof-hall-loads.png`) and the
canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `truss-roof-hall-deforming.mp4`. A 2.7 s loop of the hall sagging and springing
  back; it needs no sound.
- **A carousel instead:** `truss-roof-hall-deformed.png`, `truss-roof-hall-loads.png`, then
  `grasshopper-definition.png`.
- **Alt text:** A steel hall of six Pratt trusses on columns, sagging under snow, coloured by its
  displacement, the deformed shape drawn 60 times its size.

## The post

Copy everything in the box.

```text
How much does a steel roof bend under snow?

I built a steel hall in Grasshopper. 24 m wide, six roof trusses.

Then I added snow and the roof's own weight.
The middle trusses bend 4.5 cm.
The end ones bend less. They carry half as much roof.

The video shows it 60 times bigger.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelStructures
```

About 85 words.

## Other openings

- "Snow on a steel roof. How much does it bend?"
- "Six trusses. The two at the ends work less."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The hall, with the .gh: https://alpaca4d.github.io/examples/truss-roof-hall/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Span and length | 24 m and 30 m, six frames 6 m apart |
| Trusses | Pratt, 2.4 m deep, HEA160 chords, CHS 88.9x5 webs |
| Columns and purlins | HEA300 and IPE180, S355 |
| Loads | roof finishes 0.5 kN/m², snow 1.0 kN/m², and the own weight |
| Factors | 1.35 on what is permanent, 1.5 on the snow |
| Sag | 45 mm in the middle bays, about span/530 |

- **The members:** the webs and the bracing are bars that only pull or push; the rest are beams.
- **The picture:** the deformed shape is drawn 60 times its size.
- **Licence, if asked:** the pictures are drawn by Model View, which needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
