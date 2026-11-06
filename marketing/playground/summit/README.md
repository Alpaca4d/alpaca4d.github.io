# Playground, the Summit bridge: LinkedIn post

Lesson 10, the last, of the Playground, the website's island game that teaches Alpaca4d in ten
lessons: a block of concrete bricks filling a chasm, carved by Topology Optimisation into the
lightest bridge. Here: the iterations as a video (`summit-iterations.mp4`, and a `.gif`), one of
them (`iteration-12.png`), the design by its Von Mises stress (`von-mises-side.png`), the steps
(`01-block.png`, `07-assemble-wiring.png`), wrong picks (`02-names-swapped.png`,
`03-roller-bowstring.png`, `04-held-at-the-top.png`, `05-one-spot.png`, `06-nothing-kept.png`),
the design in the game (`08-the-bridge-by-von-mises.png`) and the game on a phone (`09-phone.png`).

## What to attach

- **The post:** `summit-iterations.mp4`: the block carved away, iteration by iteration, until an
  arch is left. It plays muted.
- **A carousel instead:** `iteration-12.png`, `von-mises-side.png`, `09-phone.png`.
- **Alt text:** A block of concrete bricks spanning a chasm under a walkway, carved away iteration
  by iteration until only an arch under the deck is left.

## The post

Copy everything in the box.

```text
Give the computer a block of concrete. What bridge comes out?

In the Alpaca4d Playground, 300 concrete bricks fill a 12 m gap.

You ask it to keep a quarter, where it helps the bridge most.

Forty steps later, an arch is left.

Alpaca4d. Structural analysis at the speed of design.

Play it free in your browser. Link in the comments.

#Grasshopper #OpenSees #TopologyOptimisation #StructuralEngineering
```

About 75 words.

## Other openings

- "Start with a block. End with an arch."
- "Keep a quarter of the concrete. Which quarter?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Play it free in your browser: https://alpaca4d.github.io/playground.html#summit
The lesson, with its Grasshopper file: https://alpaca4d.github.io/docs/learn/10-summit-bridge.html
```

## The numbers, if someone asks

- **The block:** 12 m across, 4 m deep, 1.2 m wide, C30/37 concrete, 30 × 10 bricks of 0.4 m: 300
  bricks, 144 t; a walkway of 5 kN/m² on its top row, the deck.
- **What it keeps:** the deck and a quarter of the rest, 46.8 t; the design, the 90 bricks at a
  density of 0.5 or more, is 43.2 t. 40 iterations.
- **The push on the rock:** 28.4 kN by hand, 26.8 kN in OpenSees.
- **Try:** one end free to slide, a bowstring, 3.6 times as flexible; held at the top, a hanging
  shape, 2.3 times as flexible.
- **The license:** Topology Optimisation runs without one on models of up to 500 elements.
