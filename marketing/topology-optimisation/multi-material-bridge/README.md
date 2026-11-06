# Multi-Material Bridge: LinkedIn post

The block of the Topology Bridge, 16 x 2 x 4 m under a steel deck, where Multi-Material Topology chooses,
brick by brick, between steel, concrete and nothing. Here: the run, design by design
(`multi-material-bridge-run.mp4`, and a `.gif`), the design (`multi-material-bridge-design.png`,
`multi-material-bridge-design-front.png`) and the design analysed in Von Mises stress
(`multi-material-bridge-analysed.png`).

## What to attach

- **The post:** `multi-material-bridge-run.mp4`. 11.7 s of the block sorting itself into concrete
  (orange) and steel (blue); it needs no sound.
- **A carousel instead:** `multi-material-bridge-design.png`, `multi-material-bridge-design-front.png`,
  `multi-material-bridge-analysed.png`.
- **Alt text:** A block of bricks under a steel deck turning, step by step, into two orange concrete
  legs near the ends and a blue steel arch under the middle of the deck.

## The post

Copy everything in the box.

```text
What if every brick in a bridge could choose: steel, concrete or nothing?

I gave a 16 m block a steel deck. Its budget: 5% steel, 15% concrete.

The concrete made two thick legs near the ends.
The steel made an arch under the middle.

Concrete is six times softer. So it goes where it can be thick.

Try it in Grasshopper. Alpaca4d runs it with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 90 words.

## Other openings

- "Steel where the bridge needs it. Concrete where it will do."
- "Two materials, one block. Every brick has to choose."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The bridge, with the .gh: https://alpaca4d.github.io/examples/multi-material-bridge/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Design domain | the Topology Bridge's block, 16 x 2 x 4 m, pinned along both ends of its bottom |
| Load | 10 kN/m² on a steel deck, kept solid |
| Materials | steel, E = 210 GPa, ν = 0.3; concrete C30/37, E = 33 GPa, ν = 0.2 |
| Shares | at most 5% of the block below the deck in steel, 15% in concrete |
| Run | 3 456 bricks; converges after 265 iterations, under a minute on an Apple M2 Pro |

- **Why the steel is under the deck:** only the Young's moduli count. The steel goes where the deck needs
  stiffening most for its volume, not because steel is good in tension.
- **The method:** Zheng et al. (2024), with MMA; the densities sharpen every 50 iterations, so the design
  becomes clear only after iteration 200 or so.
- **Licence:** Multi-Material Topology is one of the optimisers a licence unlocks. The call to action is
  for Topology Optimisation, which runs free up to 500 elements.
