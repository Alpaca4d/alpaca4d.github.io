# Playground, the Cliff: LinkedIn post

Lesson 2 of the Playground, the website's island game that teaches Alpaca4d in ten lessons: the
River's plank built into a cliff and sticking out over the drop, a cantilever balcony with the
alpaca at its tip. Here: the steps (`01-balcony.png`, `02-built-in.png`, `04-alpaca.png`,
`05-assemble.png`), a wrong pick that lets the balcony swing down (`03-pin-swings-down.png`), the
answer with the lesson done (`06-run.png`), the game on a phone (`07-phone.png`) and the balcony
close up (`08-the-balcony.png`).

## What to attach

- **The post:** `06-run.png`: the balcony bent true to scale under the alpaca, labelled "390 mm",
  beside the answer and its hand calculation. There is no video of it.
- **A carousel instead:** `08-the-balcony.png`, `06-run.png`, `07-phone.png`.
- **Alt text:** A timber plank built into a block at the edge of a cliff and sticking out over the
  drop, bent down under an alpaca at its tip, labelled "390 mm, true to scale".

## The post

Copy everything in the box.

```text
How far does a balcony bend under an alpaca?

In the Alpaca4d Playground, you build a timber plank out over a cliff. The alpaca walks to the tip.

You guess. Then the model answers: 39 cm, drawn true to scale.

Far too much to stand on. That's why real balconies are deep, short, or both.

Alpaca4d. Structural analysis at the speed of design.

Play it free in your browser. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EngineeringEducation
```

About 85 words.

## Other openings

- "Would you stand on this balcony?"
- "39 cm at the tip. Drawn true to scale."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Play it free in your browser: https://alpaca4d.github.io/playground.html#cliff
The lesson, with its Grasshopper file: https://alpaca4d.github.io/docs/learn/02-cliff.html
```

## The numbers, if someone asks

- **The balcony:** C24 timber, 300 mm wide and 50 mm thick, lying flat, 4 m out, fixed at the root.
- **The alpaca:** 0.6 kN at the tip.
- **How far the tip goes down:** 390 mm by hand (PL³/3EI) and in OpenSees; the shear adds 0.05 mm.
- **Try:** on its edge, 10.8 mm; half the span, 49 mm, eight times less.
