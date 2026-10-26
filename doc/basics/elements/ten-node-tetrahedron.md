# Ten Node Tetrahedron

The **ten node tetrahedron** is the quadratic 3D solid element: the four corners of a
tetrahedron plus a node at the middle of each of its six edges. Its strain varies linearly
through it, so it can bend, where the [four node tetrahedron](four-node-tetrahedron.md), with
one constant strain, locks up. It is the element to use for volumes that only mesh into
tetrahedra.

It is made from the same 4-vertex mesh as the four node tetrahedron. The six edge nodes are
added for you at the edge midpoints.

{% hint style="warning" %}
**It needs an OpenSees newer than 3.8.0.** In OpenSees 3.8.0 and earlier the element
integrates over a sixth of its volume, so it comes out **six times too soft** (and six times too
light), and reading its stresses corrupts memory. The fixes are in OpenSees pull request
#1833, merged into the master branch on 16 October 2026. Use an OpenSees built from master
since then, or a release after 3.8.0. On an older one, Run Analysis stops with a message
saying so; it does not hand back wrong numbers.
{% endhint %}

## 🔧 Grasshopper component

`TenNodeTetrahedron (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

<figure><img src="../../.gitbook/assets/components/tennodetetrahedron.png" alt="Ten Node Tetrahedron component" width="378"><figcaption></figcaption></figure>

Constructs one quadratic tetrahedral element from one 4-vertex mesh.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Mesh | `Mesh` | Mesh | — | Tetrahedral mesh with **4 vertices**, its corners, in `m`. The corners are put in OpenSees order and checked for a positive Jacobian; the edge nodes are added at the midpoints. |
| Material | `Material` | Material | — | An [nD material](../materials/ND.md). |
| Colour | `Colour` | Colour | Alpaca4d brick colour | Display colour in the Rhino viewport. |
| ElementId | `ElementId` | Text | *(empty)* | Optional name for the element, used to pull its results out later. Free text, and yours to repeat: one name over twenty meshes labels all twenty, and asking for it returns all twenty. Give a list to name them apart. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element | Tetrahedral element, to be connected to [Assemble](../assemble.md). |
| Points | `Points` | Point (list) | The element's ten nodes: the four corners, then the middles of edges 1-2, 2-3, 3-1, 1-4, 2-4 and 3-4. |

### Supports and point loads go on nodes

A [Support](support.md) holds the one node at its point. A face supported only at its mesh
vertices is held at its corners and **free at the edge nodes between them**, and bulges there.
Support the edge nodes too: take the points from **Points**, keep the ones on the supported
face, and remove duplicates. [Assemble](../assemble.md) warns when it finds an edge node
between two supported corners with no support of its own.

## 📈 When to use it

**Use it when**

- The volume cannot be meshed into hexahedra, which is most geometry not drawn with bricking
  in mind.
- The solid bends: a cantilever 10 × 1 × 1 cut into 60 tetrahedra deflects 0.4018 against
  beam theory's 0.4024 with ten node elements, and 0.098 with four node ones, a quarter of it.

**Do not use it when**

- A hexahedral mesh is available and coarse is good enough → [SSP Brick](brick.md) is cheaper.
- The body is thin → use [Shell](shell.md).
- Your OpenSees is 3.8.0 or older → [Four Node Tetrahedron](four-node-tetrahedron.md), with a
  much finer mesh.

## 📊 Results

[Brick Stresses](../results/brick-stresses.md) gives one value per element: the mean of its four
integration points, which is the stress at its centre. [View Results](../visualisation/view-results.md)
draws how the stress varies across each element, from the four points read back to its nodes.

Its own weight ([Gravity Load](../loads/gravity.md)) is shared among the nodes the way the
element itself shares a body force: −1/20 of the element's weight on each corner and 1/5 on
each edge node. The total is the weight.

## 🔗 Relation to OpenSees

```tcl
element TenNodeTetrahedronStd $eleTag $n1 $n2 $n3 $n4 $n5 $n6 $n7 $n8 $n9 $n10 $matTag $bx $by $bz
```

- `$n1 … $n4` are the corners, `$n5 … $n10` the edge nodes on 1-2, 2-3, 3-1, 1-4, 2-4, 3-4.
  `TenNodeTetrahedronStd` takes them in that standard order; plain `TenNodeTetrahedron` has
  `$n9` and `$n10` the other way round.
- `$matTag` is the **Material** input.
- Body forces are not exposed by the component; use [Gravity Load](../loads/gravity.md) for
  self-weight.

Tetrahedron nodes have **3 DOF**.
