# Spot the Cow

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/basics/elements/ten-node-tetrahedron/spot-the-cow/spot-the-cow.png" alt="Spot the cow in ten node tetrahedra, coloured by vertical stress: the legs in compression, the top of the neck in tension"><figcaption></figcaption></figure>

[spot-the-cow](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/basics/elements/ten-node-tetrahedron/spot-the-cow/spot-the-cow.gh)

A solid concrete cow, 2.4 m long, standing on its four hooves under its own weight, in 5 030
[Ten Node Tetrahedra](../../ten-node-tetrahedron.md). It shows how to bring a
tetrahedral mesh into Grasshopper, how to hold a solid on the ground, and how to read the stress
inside it.

Spot is Keenan Crane's cow, a mesh used throughout geometry processing.

{% hint style="info" %}
Ten Node Tetrahedron needs an OpenSees built from the master branch since 16 October 2026; see
[Setup](../../../../setup.md). With OpenSees 3.8.0, Run Analysis stops and says so.
{% endhint %}

## The model

| Group | What it does |
| --- | --- |
| 1 - Spot the cow in tetrahedra | The tetrahedra as a mesher writes them: **Nodes**, the 1 431 corner points, and **Tetrahedra**, four node numbers per tetrahedron, one branch each. **List Item** picks each tetrahedron's corners and **Construct Mesh** makes them into a four vertex mesh. |
| 2 - Concrete, and Ten Node Tetrahedra | An [nD](../../../materials/ND.md) Elastic Isotropic material, C30/37, with its density, and a Ten Node Tetrahedron for each mesh. |
| 3 - Pinned at every node on the ground | Every element's ten nodes from its **Points** output, in one list; those below 1 mm, once each, held in X, Y and Z by a [Support](../../../elements/support.md). |
| 4 - Its own weight | [Gravity](../../../loads/gravity.md), in a [Load Pattern](../../../loads/load-pattern.md). |
| 5 - Assemble Model | [Assemble](../../../assemble.md), and [Model View](../../../visualisation/model-view.md) to see the elements and the supports. |
| 6 - Solve, and the vertical stress | [Run Analysis](../../../analysis/run-analysis.md), and [View Results](../../../visualisation/view-results.md) on Brick stresses, σ33, over a **Range** of -0.15 to 0.15 MPa, with its [Legend](../../../visualisation/legend.md). |

## Tetrahedra from a mesher

Grasshopper has no tetrahedral mesher, so the tetrahedra come in as one hands them out: a list of
points, and four point numbers per tetrahedron, counted from 0. Ten Node Tetrahedron takes a four
vertex mesh, puts the corners in the order OpenSees wants, and adds a node in the middle of each
edge. The four mesh faces do not matter: any four that close the mesh will do.

The same two lists come out of any tetrahedral mesher: a TetGen `.node` and `.ele`, the nodes and
the tetrahedra of a gmsh `.msh`. Paste or read yours into **Nodes** and **Tetrahedra**, and the rest
of the definition runs as it is. This cow was meshed with [gmsh](https://gmsh.info), by
`Tools/Examples/SpotTheCowMesh.py` in the Alpaca4d repository.

## Holding a solid

{% hint style="warning" %}
**A support holds only the node at its point.** A ten node tetrahedron has a node in the middle of
every edge. Hold a face at its mesh vertices only, and the edge nodes between them stay free.
{% endhint %}

So the hooves are held at every node on the ground, taken from **Points**, which gives each
element's ten nodes, edge nodes included. **Cull Duplicates** keeps each node once: a node is shared
by the elements around it. Assemble Model warns when it finds an edge node left free between two
supported corners.

A solid node has no rotations, so a support on it holds translations only. The cow stands on
pinned points.

## What it shows

The cow weighs 47.4 kN: 1.93 m³ of concrete at 2 500 kg/m³. The reactions add up to that.

| Where | Vertical stress |
| --- | --- |
| Legs, 20 cm up | -0.094 MPa |
| Body, 60 cm up | -0.024 MPa |
| Top of the neck, where the head hangs out past the front legs | +0.11 MPa |
| At the pinned nodes under the hooves | down to -1.4 MPa |

The legs check by hand. At 20 cm up their cross-section is 0.52 m² and carries the 45.7 kN of cow
above it: 45.7 / 0.52 = -0.089 MPa, against -0.094 MPa in the model.

The stress under the hooves is not real. Holding a solid at its nodes makes a point support, and
the stress at a point support grows every time the mesh is refined. That is why **Range** is set to
±0.15 MPa: fitted to everything drawn, the scale would stretch from -1.4 to +0.3 MPa and leave the
rest of the cow one colour. Clear Range to see all of it.

Pick another result in View Results' **Result** menu: Von Mises, or Displacement, at most 0.02 mm.

## Credits

Spot by Keenan Crane, from his [3D model repository](https://www.cs.cmu.edu/~kmcrane/Projects/ModelRepository/),
dedicated to the public domain (CC0).
