# 🎲 Results

The result components read the model that comes back out of
[Run Analysis](../analysis/run-analysis.md) or
[Natural Vibration](../analysis/natural-vibration.md). There is no separate result object —
the analysis attaches its output to the `AlpacaModel` itself.

Underneath, results are recorded by the **MPCO** recorder written by M. Petracca and
G. Camata at [ASDEA Software Technology](https://asdeasoft.net/?product-stko), and read back
from the `recorder.mpco` file that the analysis leaves beside the Grasshopper document. An
[MPCO Recorder](../mpco-recorder.md) chooses what goes into it.

## Components in this tab

| Component | Nickname | Reads |
| --- | --- | --- |
| [Nodal Displacements](nodal-displacements.md) | `Nodal Displacements` | Displacement, rotation, velocity, acceleration at every node. |
| [Reaction Forces](reaction-forces.md) | `Reaction Forces` | Force and moment at every support, in the support's own axes. |
| [Beam Forces](beam-forces.md) | `Beam Forces` | N, Vy, Vz, Mx, My, Mz along every beam. |
| [Beam Stresses](beam-stresses.md) | `Beam Stresses` | Axial, bending, shear, torsion and Von Mises stresses along every beam. |
| [Utilisation](utilisation.md) | `Utilisation` | How much of its resistance every steel beam uses, to EN 1993-1-1. |
| [Shell Forces](shell-forces.md) | `Shell Forces` | Membrane, bending and shear resultants on every shell. |
| [Brick Stresses](brick-stresses.md) | `Brick Stresses` | The six stress components and Von Mises on every solid. |

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

### [Beam Stresses](beam-stresses.md)

Recovers the stresses along every beam from its forces with elastic beam theory: σN, the bending
stress from each moment, the extreme direct stress σmax and σmin, the peak shear from the shear
forces and from torsion, and Von Mises.

They depend on the section's shape, not its material. Same tree layout as Beam Forces, in MPa.

### [Utilisation](utilisation.md)

Checks every beam against the design code of its material — steel to EN 1993-1-1: cross-section
class, axial force, shear, torsion, bending, bending with axial force and shear, and flexural
buckling. One value per check per beam, 1 at the limit, with a **Report** of every number worked
out on the way.

The steel grade comes from the beam's material. Lateral-torsional buckling and the bending and
compression interaction of 6.3.3 are not checked yet.

### [Shell Forces](shell-forces.md)

Reads the stress resultants of every shell element of an analysed model — membrane forces
`pxx`, `pyy` and `pxy`, bending moments `mxx`, `myy` and `mxy`, and transverse shears `vxz` and
`vyz`.

All of them per unit width and in the shell's local axes. Each output is a tree with one branch
per element, holding the values at the element's integration points.

### [Brick Stresses](brick-stresses.md)

Reads the stress state of every solid element of an analysed model — the six components of the
stress tensor plus the Von Mises equivalent stress.

One value per element, in global axes or in the element's own — an [SSP Brick](../elements/brick.md) and a
[Four Node Tetrahedron](../elements/four-node-tetrahedron.md) both have a single integration
point, so there is nothing to sample along. These are the only two element types it reads.

The modal report — masses, centre of mass, participation factors and ratios — is no longer a
component of its own: it is in the [Modal Report](../analysis/natural-vibration.md#modal-report)
menu of Natural Vibration.

## Common inputs

Every component except Utilisation shares the same three inputs
(Utilisation checks one **Step** at a time and has no **History**):

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
| [Beam Stresses](beam-stresses.md) | a tree `{element}` | a tree `{step; element}` |
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
- Shell and brick stresses are in `kN/m²`; [Beam Stresses](beam-stresses.md) are in MPa (`N/mm²`),
  the unit design strengths are given in. One MPa is 1000 `kN/m²`.
- Utilisations have no unit: 1 is exactly at the limit.

To see any of this in the viewport rather than as numbers, use the matching component in
[Visualisation](../visualisation/README.md).
