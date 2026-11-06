# Interaction Domain and Moment Curvature: LinkedIn post

The N-My-Mz resistance domain of reinforced concrete sections, design forces checked against it,
and the moment-curvature curve, with Alpaca4d. The folder holds a 400 x 600 column's domain in five
views with its results (`3-column-domain.png`), a T beam's section, domain, diagrams and
moment-curvature curves with its results (`2-section-and-results.png`), the definition
(`1-components.png`), and the components on their own in `components/` (`domain-3d.png`,
`domain-check.png`, `n-m-diagram.png`, `my-mz-diagram.png`, `moment-curvature.png`).

## What to attach

- **The post:** `3-column-domain.png`. The 3D domain is the eye-catcher; the results panel answers
  the post.
- **A carousel instead:** none. The post speaks only of the column in `3-column-domain.png`.
- **Not in this post:** `2-section-and-results.png` and `1-components.png` are a T beam, another
  case, with its moment-curvature curves; it needs a post of its own.
- **Alt text:** A 400 x 600 reinforced concrete column: its fibre section, its N-My-Mz domain in 3D,
  its My-Mz diagrams at three axial forces with three design combinations checked against them, its
  N-My and N-Mz diagrams, and its results.

## The post

Copy everything in the box.

```text
Will this concrete column hold?

A 400 by 600 mm column, with six steel bars.
It must carry a push down and bending both ways, at once.

Alpaca4d draws everything it can carry as one 3D shape.
Each load case is a dot. Inside is safe.
I checked three. Two are inside. One is just outside.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #StructuralEngineering #ReinforcedConcrete
```

About 75 words.

## Other openings

- "Will this column hold? See the answer in 3D."
- "Three loads, one shape, and one dot just outside."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The column, with the .gh: https://alpaca4d.github.io/examples/column-domain/
```

## The numbers, if someone asks

The column, 400 x 600, C30/37 (fcd 17 MPa) and B500 (fyd 435 MPa), 4 φ25 + 2 φ20:

| N | My | Mz | SF, N held | SF, all three scaled |
| --- | --- | --- | --- | --- |
| −2000 | 250 | 80 | 1.59 | 1.42 |
| −1000 | 400 | 150 | **0.89** | **0.88** |
| −3000 | 100 | 60 | 2.74 | 1.44 |

- **Axial resistances:** Nc = −5117 kN, Nt = 1127 kN, what a hand calculation gives.
- **The T beam, for its own post** (600 deep, flange 800 x 150 mm, web 300 mm, 4 φ20 + 6 φ12): Nc = −5109 kN,
  Nt = 841 kN. Moment curvature at N = 0: sagging, yield 276 and ultimate 286 kNm, ductility 4.1;
  hogging, 148 and 152 kNm, 4.0. At N = −1000 kN sagging: 431 and 458 kNm, 3.7.
- **Forces** in kN and kNm, compression negative.
- **Licence, if asked:** Interaction Domain, its views, Domain Check and Moment Curvature need a licence (https://alpaca4d.github.io/docs/references/license.html).
