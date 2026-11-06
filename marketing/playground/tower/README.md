# Playground, the Watchtower: LinkedIn post

Lesson 7 of the Playground, the website's island game that teaches Alpaca4d in ten lessons: one leg
of a steel watchtower, braced at mid-height, and the load that would buckle it. Here: the tower
(`01-the-tower.png`), the answer with its buckled shape (`02-buckled-shape.png`), wrong picks
(`03-braced-one-way.png`, `04-head-free.png`, `05-crushed.png`), Assemble (`06-assemble.png`) and
the game on a phone (`07-phone.png`).

## What to attach

- **The post:** `02-buckled-shape.png`: the tower's legs in their buckled shape, labelled "Load
  factor 6.83", beside the answer. There is no video of it.
- **A carousel instead:** `02-buckled-shape.png`, `07-phone.png`.
- **Alt text:** A low-poly steel watchtower on a hill, its four legs bent in a full wave held at
  mid-height by the bracing, labelled "Load factor 6.83", beside the Grasshopper snippet and the
  answer.

## The post

Copy everything in the box.

```text
How much can a slender steel leg carry before it buckles?

In the Alpaca4d Playground, you build one leg of a watchtower: a steel tube, 6 m tall, braced halfway up.

The model answers: almost 7 times the platform's weight.

You see the shape it buckles into, held in the middle by the brace.

Alpaca4d. Structural analysis at the speed of design.

Play it free in your browser. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #Buckling
```

About 85 words.

## Other openings

- "When does a watchtower leg buckle?"
- "Almost 7 times its load. Then it buckles."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Play it free in your browser: https://alpaca4d.github.io/playground.html#tower
The lesson, with its Grasshopper file: https://alpaca4d.github.io/docs/learn/07-watchtower.html
```

## The numbers, if someone asks

- **The leg:** a circular hollow section 60.3 mm across with a 3.2 mm wall, S235, 6 m tall, pinned at
  its foot, held sideways at mid-height and at its head; 8 kN from the platform.
- **By hand:** each 3 m half is pinned at both ends, P_cr = π²EI/L² = 54.0 kN = 6.76 × 8 kN.
- **Linear Buckling:** 6.83 with 8 pieces to a half wave (1.2% high), 7.10 with Divisions 4, 8.20
  with 2.
- **Try:** no bracing, 1.69; braced one way only, 1.69; the head free, 0.93, with a warning.
