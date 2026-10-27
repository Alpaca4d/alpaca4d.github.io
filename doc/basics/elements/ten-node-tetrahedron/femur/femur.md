# Femur

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/basics/elements/ten-node-tetrahedron/femur/femur.png" alt="A femur held at the knee with the hip force on its head, coloured by displacement, the head moving 3.4 mm"><figcaption></figcaption></figure>

[femur](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/basics/elements/ten-node-tetrahedron/femur/femur.gh)

A thigh bone, held at the knee, with the force of the hip on its head, in 3 813
[Ten Node Tetrahedra](../../ten-node-tetrahedron.md). The bone is the
Standardised Femur, the reference geometry for finite element studies of the femur. The example
shows how to hold one end of a solid and load the other through a patch of nodes.

{% hint style="info" %}
Ten Node Tetrahedron needs an OpenSees built from the master branch since 16 October 2026; see
[Setup](../../../../setup.md). With OpenSees 3.8.0, Run Analysis stops and says so.
{% endhint %}

## The model

| Group | What it does |
| --- | --- |
| 1 - The femur in tetrahedra | The tetrahedra as a mesher writes them: **Nodes**, the 1 297 corner points, and **Tetrahedra**, four node numbers per tetrahedron, one branch each. **List Item** and **Construct Mesh** make each into a four vertex mesh. See [Spot the Cow](../spot-the-cow/spot-the-cow.md#tetrahedra-from-a-mesher). |
| 2 - Bone, and Ten Node Tetrahedra | An [nD](../../../materials/ND.md) Elastic Isotropic material: cortical bone, E = 17 GPa, ν = 0.3. |
| 3 - Held at the knee | Every element's ten nodes from its **Points** output; those in the bottom 2 cm, once each, held in X, Y and Z, as a bone potted in cement for a test. |
| 4 - The hip's force | The highest node is the top of the head. The force is shared equally among the nodes within 15 mm of it: **List Length** counts them and **Division** gives each its share of the 2 kN, as [Point Loads](../../../loads/point-load.md). |
| 5 - Assemble Model | [Assemble](../../../assemble.md), and [Model View](../../../visualisation/model-view.md) to see the supports and the loads. |
| 6 - Solve, and the displacement | [Run Analysis](../../../analysis/run-analysis.md), and [View Results](../../../visualisation/view-results.md) on Displacement, drawn 20 times larger, with its [Legend](../../../visualisation/legend.md). |

## The load

When you walk, the hip pushes on the head of the femur with about two and a half times your weight.
For an 80 kg person that is 2 kN. Here it leans 13° from the shaft, pushing the head down and out:
(0.45, 0, -1.95) kN. Spread over the 90 nodes on the top of the head, it does not punch through a
single node.

## What it shows

The head moves 3.4 mm, mostly sideways. The shaft bends over the knee, as it does under the
eccentric load of the neck. The reactions at the knee balance the 2 kN exactly.

Treat the numbers as an illustration, not as biomechanics. The bone is solid cortical bone all
through: the canal and the softer bone inside the ends are filled in, so this femur is stiffer than
a real one. Change **E** and the load in groups 2 and 4 to try your own.

## The geometry

The Standardised Femur comes as IGES surfaces that do not close into a solid: its faces stand up
to a millimetre apart, and CAD will not sew them. `Tools/Examples/FemurMesh.py`, in the Alpaca4d
repository, rebuilds a closed surface from the outer faces with a signed distance and marching
cubes. It then fills that surface with tetrahedra with [gmsh](https://gmsh.info).

## Credits

The [Standardised Femur](https://doi.org/10.15131/shef.data.3839766.v1) by Marco Viceconti,
University of Sheffield, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/);
see Viceconti et al., *Journal of Biomechanics* 29 (1996), 1241. Here its outer surface was rebuilt
as a closed solid and meshed with tetrahedra.
