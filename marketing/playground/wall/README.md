# Playground, the Wall with a window: LinkedIn post

Lesson 9 of the Playground, the website's island game that teaches Alpaca4d in ten lessons: a
concrete wall of shells with a window cut into it, carrying a floor, and how the forces get round
the opening. Here: the stress lines on the wall (`01-stress-lines.png`), the lines running round
the window (`02-run-round.png`), the floor pushed along the wall instead (`03-pushed-along.png`),
Assemble (`04-assemble.png`), the definition (`05-definition.png`) and the game on a phone
(`07-phone.png`). Leave out `06-opensees-lines.png`: it is a working page, with raw labels on it.

## What to attach

- **The post:** `01-stress-lines.png`. There is no video of it.
- **A carousel instead:** `01-stress-lines.png`, `02-run-round.png`, `07-phone.png`.
- **Alt text:** A low-poly concrete wall with a square window, twelve arrows of floor load along its
  top, covered in purple and blue lines that bend round the opening, and the alpaca looking
  through the window.

## The post

Copy everything in the box.

```text
Cut a window in a wall. Where do the forces go?

In the Alpaca4d Playground, you build a concrete wall with a window. It carries a floor.

Then you draw the paths the forces take. They bend around the opening.

They crowd at the window's top corners. That's where walls crack first.

Alpaca4d. Structural analysis at the speed of design.

Play it free in your browser. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ConcreteDesign
```

About 85 words.

## Other openings

- "Where do walls crack first?"
- "The forces go around the window. You can see them."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Play it free in your browser: https://alpaca4d.github.io/playground.html#wall
The lesson, with its Grasshopper file: https://alpaca4d.github.io/docs/learn/09-wall-with-a-window.html
```

## The numbers, if someone asks

- **The wall:** concrete, 5.5 m long, 4 m tall, 200 mm thick, with a window 1.5 m square, its sill
  1 m up; E = 33 000 MPa.
- **The floor:** 50 kN on each of 12 points along the top, 600 kN in all.
- **The stress:** 0.55 MPa far from the window; 0.75 MPa on average beside it, by hand and in
  OpenSees; 1.0 MPa right beside it; about 1.5 MPa at its top corners.
- **Try:** the floor pushed along the wall, 4.5 MPa at the corners; a wider window, 1.0 MPa on
  average.
