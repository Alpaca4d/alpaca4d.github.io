# Inigo the Dragon

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/basics/elements/ten-node-tetrahedron/inigo-the-dragon/inigo-the-dragon.png" alt="Inigo the dragon in ten node tetrahedra, its fourth mode: both wings flapping together at 59 Hz"><figcaption></figcaption></figure>

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/basics/elements/ten-node-tetrahedron/inigo-the-dragon/inigo-the-dragon-2.png" alt="Three more modes of the dragon: swaying forward and back at 7.7 Hz, wagging its tail at 41.5 Hz, the wings flapping against each other at 60.1 Hz"><figcaption></figcaption></figure>

[inigo-the-dragon](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/basics/elements/ten-node-tetrahedron/inigo-the-dragon/inigo-the-dragon.gh)

A concrete dragon 5.5 m tall, standing on its two feet, in 10 903
[Ten Node Tetrahedra](../../ten-node-tetrahedron.md), and the ways it vibrates:
it sways, wags its tail and flaps its wings. The example runs a
[Natural Vibration](../../../analysis/natural-vibration.md) analysis on a solid and steps
through its modes in View Results.

Inigo is Keenan Crane's dragon, built from signed distance functions.

{% hint style="info" %}
Ten Node Tetrahedron needs an OpenSees built from the master branch since 16 October 2026; see
[Setup](../../../../setup.md). With OpenSees 3.8.0, Natural Vibration stops and says so.
{% endhint %}

## The model

| Group | What it does |
| --- | --- |
| 1 - Inigo the dragon in tetrahedra | The tetrahedra as a mesher writes them: **Nodes**, the 3 511 corner points, and **Tetrahedra**, four node numbers per tetrahedron, one branch each. **List Item** and **Construct Mesh** make each into a four vertex mesh. See [Spot the Cow](../spot-the-cow/spot-the-cow.md#tetrahedra-from-a-mesher). |
| 2 - Concrete, and Ten Node Tetrahedra | An [nD](../../../materials/ND.md) Elastic Isotropic material, C30/37, with a density of 2 500 kg/m³. |
| 3 - Held at every node on the soles | Every element's ten nodes from its **Points** output; those below 1 mm, once each, held in X, Y and Z by a [Support](../../../elements/support.md). |
| 4 - Assemble Model | [Assemble](../../../assemble.md), with no load at all. |
| 5 - The first 12 modes | [Natural Vibration](../../../analysis/natural-vibration.md) with **Vibration Modes** set to 12, and a **Mode** slider into the **Step** of [View Results](../../../visualisation/view-results.md), which draws the mode deformed. **Frequencies** lists them, in Hz. |

## No load, only mass

A natural vibration analysis needs mass, not load. It takes the mass from the material's density:
11.4 m³ of concrete, 28.5 t. Natural Vibration connects to Assemble Model, not to Run Analysis:
there is nothing to run first.

## The modes

**Mode** picks the mode View Results draws, counting from 0 as **Step** does: 0 is the first mode.

| Mode | Step | Frequency | Shape |
| --- | --- | --- | --- |
| 1 | 0 | 7.7 Hz | sways forward and back |
| 2 | 1 | 21.8 Hz | sways side to side |
| 3 | 2 | 41.5 Hz | wags its tail, and the wings rock |
| 4 | 3 | 59.1 Hz | both wings flap together |
| 5 | 4 | 60.1 Hz | the wings flap against each other, and the tail swings |

The definition opens on mode 4. Tick **Animate** in View Results' **Display** menu to watch it
move.

{% hint style="warning" %}
**A mode has no size of its own.** OpenSees scales each mode to a modal mass of one, and View
Results draws it at that size: 2.6 at the wing tip in mode 4, in metres per √tonne. The numbers on
the legend show where the dragon moves most, not by how much. A heavier model has smaller modes and
needs a larger **Deformation scale**. Here 0.1 moves the wing tip by a quarter of a metre, and
**Animate** sweeps the scale from 0 to 0.2 and back.
{% endhint %}

## The geometry

Inigo's wings are membranes a few centimetres thick, and its fingers and smile leave gaps narrower
than an element. Meshed as they are, they give a surface that passes through itself. So
`Tools/Examples/InigoTheDragonMesh.py`, in the Alpaca4d repository, rebuilds the dragon on a grid
before meshing it with [gmsh](https://gmsh.info): grown by 4.5 cm all over, which makes the wings
9 cm thicker, with every gap narrower than 18 cm filled and the soles cut flat. The scales, the
teeth and the finer details are gone; the dragon is all there.

## Credits

Inigo the Dragon by Keenan Crane, 2026, from his
[3D model repository](https://www.cs.cmu.edu/~kmcrane/Projects/ModelRepository/), dedicated to the
public domain (CC0).
