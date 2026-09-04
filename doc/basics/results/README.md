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

### [Nodal Displacements](nodal-displacements.md)

Reads displacement, rotation, velocity and acceleration at every node of an analysed model.

One value per node, in global axes, in the order the nodes were assembled. Velocity and
acceleration are recorded by a transient analysis only. After a
[Natural Vibration](../analysis/natural-vibration.md) analysis, **Step** picks the mode and
**Displacement** and **Rotation** are that mode's shape.

### [Reaction Forces](reaction-forces.md)

Reads the force and the moment carried by every support of an analysed model.

One value per support, given in the support's own axes, so a [Support](../elements/support.md)
placed on a **Plane** reports along that plane rather than along the global axes.
**SupportPosition** gives both where each support sits and the frame its reactions are in.

### [Beam Forces](beam-forces.md)

Reads the internal forces along every beam element of an analysed model — axial force, two
shears, torsion and two bending moments.

Each output is a tree with one branch per element, holding the values at the element's
integration sections from the I end to the J end, in local axes. **N** is positive in tension.

### [Shell Forces](shell-forces.md)

Reads the stress resultants of every shell element of an analysed model — membrane forces
`pxx`, `pyy` and `pxy`, bending moments `mxx`, `myy` and `mxy`, and transverse shears `vxz` and
`vyz`.

All of them per unit width and in the shell's local axes. Each output is a tree with one branch
per element, holding the values at the element's integration points.

### [Brick Stresses](brick-stresses.md)

Reads the stress state of every solid element of an analysed model — the six components of the
stress tensor plus the Von Mises equivalent stress.

One value per element, in the element's local axes — an [SSP Brick](../elements/brick.md) and a
[Four Node Tetrahedron](../elements/four-node-tetrahedron.md) both have a single integration
point, so there is nothing to sample along. These are the only two element types it reads.

### [Modal Analysis Report](modal-analysis-report.md)

Splits the report written by a [Natural Vibration](../analysis/natural-vibration.md) analysis
into its sections: eigenvalues, total and free mass, centre of mass, modal participation
factors, participating masses and their ratios.

Every output is one section of the report as text, ready for a panel. The cumulative ratio is
the one to check against a code threshold such as 90%.

## Common inputs

Every component except the Modal Analysis Report shares the same three inputs:

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | Read **every** recorded step instead of one. **Step** is then ignored. |
| Step | `Step` | Integer | `0` | Which analysis step to read. For a modal model, which **mode**. |

**History** is how you get a time history out in one go. With it set, each output gains a step
index in front of whatever index it already had:

| Component | With `History = false` | With `History = true` |
| --- | --- | --- |
| [Nodal Displacements](nodal-displacements.md) | a list, one item per node | a tree `{step}`, that step's value per node |
| [Reaction Forces](reaction-forces.md) | a list, one item per support | a tree `{step}` for the force and the moment; **SupportPosition** stays a flat list, since supports do not move |
| [Beam Forces](beam-forces.md) | a tree `{element}` | a tree `{step; element}` |
| [Shell Forces](shell-forces.md) | a tree `{element}` | a tree `{step; element}` |
| [Brick Stresses](brick-stresses.md) | a list, one item per element | a tree `{step}`, that step's value per element |

How many steps there are to read is set by **NumIncr** on
[Analysis Step](../analysis/analysis-step.md).

## Reading the numbers

- Forces are in `kN`, moments in `kN·m`, lengths in `m`, rotations in `rad`.
- Beam and shell results come back as a **data tree**, one branch per element; brick
  stresses are a flat list, one value per element.
- Beam and shell results are in **local** axes; nodal results are in global axes; reactions
  are in the support's own axes.

To see any of this in the viewport rather than as numbers, use the matching component in
[Visualisation](../visualisation/README.md).
