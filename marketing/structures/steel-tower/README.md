# Steel Tower: LinkedIn post

A steel lattice tower 21 m tall with a stair climbing inside it, under its own weight, people on the
stair and wind, and its first modes, analysed with Alpaca4d. The folder holds the tower deforming
under the wind (`steel-tower-deforming.mp4`, and a `.gif`) and its still (`steel-tower-deformed.png`),
the first mode (`steel-tower-mode.mp4`, a `.gif` and `steel-tower-mode.png`), the supports and loads
(`steel-tower-loads.png`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `steel-tower-deforming.mp4`. A 2.7 s loop of the tower leaning in the wind and
  back; it needs no sound. The post speaks only of what it shows.
- **A carousel instead:** `steel-tower-deformed.png`, `steel-tower-loads.png`, then
  `grasshopper-definition.png`.
- **Not in this post:** `steel-tower-mode.mp4` (and its `.gif` and `.png`), the first mode, needs a
  post of its own.
- **Alt text:** A steel lattice tower with a stair inside it, swaying under wind, coloured by its
  displacement, the deformed shape drawn 120 times its size.

## The post

Copy everything in the box.

```text
How much does a 21 m steel tower move in the wind?

I built one in Grasshopper, with a stair climbing up inside.

Then I added wind, and people on the stairs.
The top moves just over 1 cm.
The stairs bend a little under the people.

The video shows it 120 times bigger.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelStructures
```

About 85 words.

## Other openings

- "A stair inside a steel tower. How much does it move?"
- "21 m tall, and the top moves about 1 cm."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The tower, with the .gh: https://alpaca4d.github.io/examples/steel-tower/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Size | 21 m tall, 4 m square |
| Legs | CHS 168.3x6.3, S355, pinned at the ground |
| Landings and stringers | IPE180 and IPE160 |
| Bracing | CHS 76.1x4, as bars that only pull or push |
| Loads | wind 1.0 kN/m², people on the stair 4.0 kN/m², and the own weight |
| Lean at the top | 12.5 mm under the wind |
| First three modes | 5.3, 5.7 and 7.2 Hz |

- **The picture:** the deformed shape is drawn 120 times its size.
- **Licence, if asked:** the pictures are drawn by Model View, which needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
