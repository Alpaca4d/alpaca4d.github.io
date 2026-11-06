# Beam-Column Joint: LinkedIn post

Where an interior beam-column joint needs its material, found three ways side by side in a 1 m cube of
steel bricks: Topology Optimisation (SIMP), BESO Topology and Multi-Material Topology. Here: each run
(`beam-column-joint-simp-run.mp4`, `-beso-run.mp4`, `-multi-material-run.mp4`, and `.gif`s), each design
(`beam-column-joint-simp.png`, `-beso.png`, `-multi-material.png`), each design analysed in Von Mises
stress (`-analysed.png`) and the three side by side (`beam-column-joint-comparison.png`).

## What to attach

- **The post:** `beam-column-joint-multi-material-run.mp4`. 11.7 s of the cube sorting itself into
  concrete and steel; it needs no sound.
- **A carousel instead:** `beam-column-joint-multi-material.png`,
  `beam-column-joint-multi-material-analysed.png`. The SIMP and BESO runs, and the comparison, would make
  posts of their own.
- **Alt text:** A cube of bricks between a column and four beam stubs turning, step by step, into
  concrete struts and a core with steel ties across the top.

## The post

Copy everything in the box.

```text
Where does a joint need concrete, and where steel?

A column and four beams meet in a 1 m cube. I let every brick choose: steel, concrete or nothing.

The concrete went into the core and the struts.
The steel went into the ties across the top.

One beam bends it almost twice as hard. That side got more.

Try it in Grasshopper. Alpaca4d runs it with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 90 words.

## Other openings

- "Concrete or steel? Let every brick choose."
- "One beam bends harder. The joint notices."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The joint, with the .gh: https://alpaca4d.github.io/examples/beam-column-joint/
```

## The numbers, if someone asks

- **The node:** a cube of steel bricks, 1 m a side, E = 210 GPa; concrete C30/37, E = 33 GPa, for
  Multi-Material Topology to choose.
- **The column:** 0.4 m square, held at its foot, 1 500 kN at its head.
- **The beams:** 0.2 m wide, 0.4 m deep; 150 kN and 150 kNm from +x, 150 kN and 80 kNm from -x, 100 kN
  and 100 kNm from +y and from -y. The joint takes the 70 kNm difference into the column.
- **Kept:** 20% of the cube for Topology Optimisation and BESO; up to 6% steel and 14% concrete for
  Multi-Material Topology.

| | Iterations | Compliance | Time, Apple M2 Pro |
| --- | --- | --- | --- |
| Topology Optimisation | 160 | 0.358 | about a minute and a half |
| BESO Topology | 94 | 0.280 | under a minute |
| Multi-Material Topology | 265 | 0.675 | four to five minutes |

- **What they find:** ties across the top from each beam's top to the one opposite, struts under them
  into the column, the column carried through. Each puts a fifth to a third more material on the
  150 kNm side than on the 80 kNm side; along y, where the beams balance, the joint is exactly symmetric.
- **Multi-Material** chooses by stiffness only: it knows nothing of concrete cracking.
- **Size and licence:** 9 024 bricks at 2 per 10 cm, so it needs one; BESO and Multi-Material are
  optimisers a licence unlocks.
