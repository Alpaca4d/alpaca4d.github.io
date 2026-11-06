# Barrel Vault: LinkedIn post

A concrete barrel vault 16 m across under wind blowing across it, pressure on its windward quarter
and suction over the rest, analysed in shells with Alpaca4d. The folder holds the vault deforming
(`barrel-vault-deforming.mp4`, and a `.gif`), the still at full deformation (`barrel-vault-deformed.png`),
the supports and loads (`barrel-vault-loads.png`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `barrel-vault-deforming.mp4`. A 2.7 s loop of the vault lifting and settling; it
  needs no sound.
- **A carousel instead:** `barrel-vault-loads.png` first, the wind loads on each strip, then
  `barrel-vault-deformed.png` and `grasshopper-definition.png`.
- **Alt text:** A concrete barrel vault under wind, coloured by its displacement, most at its free
  ends, the deformed shape drawn 200 times its size.

## The post

Copy everything in the box.

```text
Does wind push a curved roof down, or lift it up?

I built a concrete vault in Grasshopper. 16 m wide, 24 m long, 12 cm thick.

Then I blew wind across it.
It pushes on one side and pulls on the rest.
The pull wins. The roof lifts up to 8 mm, most at its open ends.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ShellStructures
```

About 90 words.

## Other openings

- "Wind on a curved roof: push or pull?"
- "I blew wind across a concrete vault. It lifted."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The vault, with the .gh: https://alpaca4d.github.io/examples/barrel-vault/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Vault | 16 m across, 5 m high, 24 m long |
| Shell | 120 mm of concrete, ASD Shells, pinned along both long edges |
| Peak velocity pressure | 0.8 kN/m² |
| Pressure coefficients | +0.6 on the windward quarter, −1.0 on the middle half, −0.4 on the leeward quarter |
| Strips | sixteen round the arc, a Mesh Load each along its normal |
| Largest movement | 8.3 mm, at the free ends |

- **The coefficients:** typed in, to be taken from your code of practice.
- **The picture:** the deformed shape is drawn 200 times its size.
- **Licence, if asked:** the pictures are drawn by Model View, which needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
