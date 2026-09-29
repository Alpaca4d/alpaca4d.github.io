# Spring Link

A **spring link** is an element between two nodes that are apart. It carries one uniaxial
spring per local direction, and nothing at all in the directions left out. It models a
connection with a real stiffness: a bearing, a bolt, a damper, the interlayer of laminated
glass.

## 🔧 Grasshopper component

`Spring Link (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Line | `Line` | Line (list) | — | One line per link, from the node it starts at to the node it ends at, in `m`. Both ends have to land on nodes the model already has. |
| Material | `Material` | Material (list) | — | One [uniaxial material](../materials/Uniaxial.md) per direction, in the order of **Direction**. A single material is used for every direction. Its `E` is read as a stiffness: `kN/m` for a translation, `kN·m/rad` for a rotation. |
| Direction | `Direction` | Integer (list) | — | The local directions that carry anything: `1`, `2`, `3` translation along local *x*, *y*, *z*; `4`, `5`, `6` rotation about them. Anything left out is free. |
| Plane | `Plane` | Plane | *along the link* | The frame the directions count in. Left empty, *x* runs along the link and *y* and *z* across it. Give the world XY plane to count along the global axes instead. |
| ElementId | `ElementId` | Text | *(empty)* | Optional name, shared by every link this component makes. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element (list) | The links, for the **Elements** input of [Assemble](../assemble.md). |

### The six directions

| Direction | In the local frame | Acts as |
| --- | --- | --- |
| `1` | translation along *x* | the axial spring, along the link unless a **Plane** says otherwise |
| `2`, `3` | translation along *y*, *z* | the shear springs, across the link |
| `4` | rotation about *x* | torsion |
| `5`, `6` | rotation about *y*, *z* | bending |

A link on direction `1` alone pulls along its own axis and resists nothing else. On a solid's
node only `1` to `3` exist, because a solid node has no rotations.

## 📈 When to use it

**Use it when**

- A connection has a stiffness you know: an elastomeric bearing, a bolt group, a flexible
  joint between two parts of the structure.
- Some directions should be stiff and others free: a slider, or a pin that carries force but
  no moment.
- Two parallel surfaces are joined through a soft layer. For laminated glass, give each node
  pair a shear stiffness `k = G·A / t` for the area of glass that node carries.

**Do not use it when**

- The join has no give at all → a [Rigid Link](../constraints/rigid-link.md) is exact and has
  no stiffness to choose.
- Chosen degrees of freedom should simply read the same at both nodes → use
  [Equal DOF](../constraints/equal-dof.md).
- The node should be held against the ground → use a [Support](support.md). A link cannot
  ground a node: its two ends have to be apart, and two points in the same place are one node.

## 💡 Notes

- **A link makes no nodes.** [Assemble](../assemble.md) looks for a node within its
  **Tolerance** of each end, and stops with an error if an end has none. Put both ends on beam
  ends, mesh vertices or other nodes.
- **A link has no mass.** It is a stiffness between two nodes and nothing else. Weight at a
  bearing goes on a [Mass Point](../loads/mass-point.md) at the node.
- **The shear springs act at mid-length.** A shear force on a link of some length also turns
  its nodes. That is not an error to tune away: it is what makes two offset panes act together.
- **No result component reads a link's forces yet.**
- **Links do not survive a round trip through Tcl.** [Deserialise](../utility/deserialise.md)
  does not read `twoNodeLink` back, and says so in its warnings.

## 🔗 Relation to OpenSees

```tcl
element twoNodeLink $eleTag $iNode $jNode -mat $matTag1 $matTag2 ... -dir $dir1 $dir2 ... -orient $yp1 $yp2 $yp3
```

When the frame runs along the link, only the *y* hint is written after `-orient`, and
OpenSees takes *x* from the two nodes. A **Plane** that points elsewhere writes all six
numbers, *x* first.
