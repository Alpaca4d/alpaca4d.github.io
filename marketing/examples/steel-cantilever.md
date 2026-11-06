# Steel Cantilever: LinkedIn post

A 4 m steel cantilever checked to EN 1993-1-1 by Utilisation, and why an IPE 300 fails where an
HEA 200 of the same weight passes. One picture in this folder: `steel-cantilever.png`, the
cantilever, the two sections to scale and their utilisations as bars.

## What to attach

- **The post:** `steel-cantilever.png`. The chart carries the story on its own.
- **A carousel instead:** none; this folder has the one picture for it.
- **Alt text:** A 4 m steel cantilever and its utilisations: an HEA 200 passes at 0.89, an IPE 300
  of the same weight fails lateral-torsional buckling at 1.11.

## The post

Copy everything in the box.

```text
Two steel beams weigh the same. Why does one fail?

A 4 m cantilever with a load at the tip.
An IPE 300 or an HEA 200. Both 42 kg/m.

The IPE 300 is deeper, so it is stronger in bending.
But it is narrow, so it twists sideways. It fails at 111%.
The HEA 200 passes at 89%.

Alpaca4d checks both to the Eurocode, step by step.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 90 words.

## Other openings

- "Same weight. Same steel. One passes, one fails."
- "The deeper beam is stronger. Until it twists."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The cantilever, with the .gh: https://alpaca4d.github.io/examples/steel-cantilever/
```

## The numbers, if someone asks

| Section | Bending | LTB, lengths 2 L | LTB, lengths left empty | Max |
| --- | --- | --- | --- | --- |
| HEA 200 | 0.48 | **0.89** | 0.52 | 0.89, LTB |
| IPE 300 | 0.30 | **1.11** | 0.38 | 1.11, LTB |
| HEA 240 | 0.28 | 0.46 | 0.28 | 0.46, LTB |

- **The moment at the root:** (15 + 0.79) × 4 = 63.1 kNm, the tip load and half the beam's weight.
- **The HEA 200:** Class 3, so its resistance uses W_el; M_cr = 81.88 kNm, χLT = 0.542.
- **Licence, if asked:** Utilisation works without a licence, and so does Run Analysis on models of up to 50 elements (https://alpaca4d.github.io/docs/references/license.html).
