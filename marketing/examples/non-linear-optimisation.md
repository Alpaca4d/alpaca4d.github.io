# Non-Linear Optimisation: LinkedIn post

Eight cases for the Non-Linear Optimisation component, each with a known answer. One picture in
this folder: `non-linear-optimisation.png`, six of the cases over their sliders' ranges, each with
where the sliders start and the answer it should end at.

## What to attach

- **The post:** `non-linear-optimisation.png`.
- **A carousel instead:** none; this folder has the one picture for it.
- **Alt text:** Six optimisation problems drawn over their sliders' ranges, Rosenbrock, Branin, a
  hill, NLopt's tutorial, a circle constraint and Rastrigin, each with where the sliders start and
  the answer it should end at.

## The post

Copy everything in the box.

```text
Can an optimiser find an answer you already know?

Here are six puzzles. Each has a known answer.
The white dot is where the sliders start.
The black dot is where they should end.

Each puzzle uses a different search method.

Alpaca4d's optimiser moves your Grasshopper sliders to find the answer.
Try it on the puzzles first. Then on your own design.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #StructuralEngineering #Optimisation
```

About 85 words.

## Other openings

- "Six puzzles. Six known answers. Can it find them?"
- "White dot: the start. Black dot: the answer."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The puzzles, with the .gh: https://alpaca4d.github.io/examples/non-linear-optimisation/
```

## The numbers, if someone asks

| Case | Algorithm | Expect |
| --- | --- | --- |
| 1 Rosenbrock | BOBYQA | 0 at (1, 1) |
| 2 Branin | DIRECT-L | 0.3979 at one of three points |
| 3 A hill, maximised | Nelder-Mead | 5 at (2, -1) |
| 4 NLopt's tutorial, two constraints | COBYLA | 0.5443 at (0.3333, 0.2963) |
| 5 Outside the unit circle, one constraint | ISRES | about -1.414 at about (-0.707, -0.707) |
| 6 Rastrigin | CRS2-LM | 0 at (0, 0) |
| 7 A gene pool of 12 | Sbplx | 0, every gene at 0.3 |
| 8 Three set-ups to refuse or warn about | - | a warning, and two refusals |

- **How it links:** like Galapagos, an object on the canvas, linked to sliders and results by
  dragging from its grips.
- **A licence is needed to run it;** linking and setting it up work without one.
