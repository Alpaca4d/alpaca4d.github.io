# 🎲 Results

The result components read the model that comes back out of
[Run Analysis](../analysis/run-analysis.md) or
[Natural Vibration](../analysis/natural-vibration.md). There is no separate result object —
the analysis attaches its output to the `AlpacaModel` itself.

Underneath, results are recorded by the **MPCO** recorder written by M. Petracca and
G. Camata at [ASDEA Software Technology](https://asdeasoft.net/?product-stko), and read back
from the `recorder.mpco` file that the analysis leaves beside the Grasshopper document.

## Components in this tab

| Component | Nickname | Reads |
| --- | --- | --- |
| [Nodal Displacements](nodal-displacements.md) | `Nodal Displacements` | Displacement, rotation, velocity, acceleration at every node. |
| [Reaction Forces](reaction-forces.md) | `Reaction Forces` | Force and moment at every support, in the support's own axes. |
| [Beam Forces](beam-forces.md) | `Beam Forces` | N, Vy, Vz, Mx, My, Mz along every beam. |
| [Shell Forces](shell-forces.md) | `Shell Forces` | Membrane, bending and shear resultants on every shell. |
| [Brick Stresses](brick-stresses.md) | `Brick Stresses` | The six stress components and Von Mises on every solid. |
| [Modal Analysis Report](modal-analysis-report.md) | `Modal Analysis Report` | Masses, centre of mass, participation factors and ratios. |

## Common inputs

Every component except the Modal Analysis Report shares the same three inputs:

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | **Not implemented.** The input exists but does nothing. |
| Step | `Step` | Integer | `0` | Which analysis step to read. For a modal model, which **mode**. |

To build a time history, feed a series of step indices into **Step** and graft the outputs —
`History` will not do it for you.

## Reading the numbers

- Forces are in `kN`, moments in `kN·m`, lengths in `m`, rotations in `rad`.
- Element results come back as a **data tree**, one branch per element.
- Beam and shell results are in **local** axes; nodal results are in global axes; reactions
  are in the support's own axes.

To see any of this in the viewport rather than as numbers, use the matching component in
[Visualisation](../visualisation/README.md).
