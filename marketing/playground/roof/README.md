# Playground, the Snowy roof: LinkedIn post

Lesson 3 of the Playground, the website's island game that teaches Alpaca4d in ten lessons: a timber
rafter under snow and its own weight, and how deep it must be. Here: the steps (`01-the-rafter.png`,
`02-the-snow.png`, `05-load-pattern.png`, `06-deep-enough.png`, `07-run.png`), two wrong picks
(`03-four-times-the-snow.png`, `04-snapped.png`), the game on a phone (`08-phone.png`) and the roof
close up (`09-the-roof.png`).

## What to attach

- **The post:** `09-the-roof.png`, the snowy roof sagging under its load. There is no video of it.
- **A carousel instead:** `09-the-roof.png`, `06-deep-enough.png`, `08-phone.png`.
- **Alt text:** A low-poly cabin roof covered in snow, sagging between its two walls, with arrows
  for the snow along the rafter and the alpaca standing beside it.

## The post

Copy everything in the box.

```text
How deep must a roof beam be to carry the snow?

In the Alpaca4d Playground, you build a 4 m timber rafter under snow.

It may sag 16 mm at most.

You try depths with a slider. At 15 cm it sags 14 mm. It passes.

Alpaca4d. Structural analysis at the speed of design.

Play it free in your browser. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TimberEngineering
```

About 75 words.

## Other openings

- "How deep is deep enough under snow?"
- "A rafter, a snowy roof, and a 16 mm limit."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Play it free in your browser: https://alpaca4d.github.io/playground.html#roof
The lesson, with its Grasshopper file: https://alpaca4d.github.io/docs/learn/03-snowy-roof.html
```

## The numbers, if someone asks

- **The rafter:** C24 timber, 75 mm wide, 4 m span on a pin and a roller, rafters 0.6 m apart.
- **The load:** 1.5 kN/m² of snow, 0.9 kN/m on each rafter, plus its own weight: 0.945 kN/m at
  150 mm deep.
- **The sag:** 47 mm at 100 mm deep, 24.5 mm at 125, 14.3 mm at 150 (14.2 by hand), 6.1 mm at 200;
  the limit is L/250 = 16 mm.
- **Twice as wide**, 150 × 100 mm: 24.4 mm, only twice as stiff.
- **The rafter breaks**, at 75 × 100 mm, at about 1.5 kN/m over 4 m.
