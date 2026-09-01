# Brick

The **brick** is a 3D solid hexahedral element based on the OpenSees `SSPbrick`
formulation — *Stabilized Single Point*. One integration point plus a stabilization term,
which keeps it free of the shear locking that a fully integrated 8-node brick suffers from
in bending, and cheap with it.

Use it for volumetric behaviour: foundations, cores, massive walls, blocks, soil volumes.

## 🔧 Grasshopper component

`SSP Brick (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

Constructs one brick element from one hexahedral mesh.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Mesh | `Mesh` | Mesh | — | Hexahedral mesh with **8 vertices**, in `m`. Passed through `CleanHexahedron` to put the corners in the order OpenSees expects. |
| Material | `Material` | Material | — | An [nD material](../materials/ND.md). Uniaxial materials are not accepted. |
| Colour | `Colour` | Colour | Alpaca4d brick colour | Display colour in the Rhino viewport. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element | Brick element, to be connected to [Assemble](../assemble.md). |

{% hint style="info" %}
One component makes **one** element. To build a solid region, graft a list of hexahedral
meshes into the component — [Mesh Series to Brick](../utility/mesh-series-to-brick.md) and
[Mesh Loft](../utility/mesh-loft.md) exist to produce them.
{% endhint %}

## 📈 When to use it

**Use it when**

- You need a full 3D stress state — confinement, triaxial behaviour, contact with soil or
  massive concrete.
- The region cannot be represented accurately by beams or shells.
- You are studying stress concentrations inside a body.

**Do not use it when**

- The body is thin compared to its in-plane dimensions → use [Shell](shell.md).
- The behaviour is bending-dominated and member-like → use
  [ForceBeamColumn](force-beam-column.md).
- Your geometry only meshes into tetrahedra → use
  [Four Node Tetrahedron](four-node-tetrahedron.md).

## 🔗 Relation to OpenSees

```tcl
element SSPbrick $eleTag $n1 $n2 $n3 $n4 $n5 $n6 $n7 $n8 $matTag $bx $by $bz
```

- The 8 mesh vertices map to `$n1 … $n8`.
- `$matTag` is the **Material** input.
- The body forces `$bx $by $bz` are not exposed by the component and are left at the
  OpenSees default. Self-weight is applied instead as equivalent nodal loads by
  [Gravity Load](../loads/gravity.md).

Note that a brick node has **3 DOF**, not 6. A brick sharing a node with a beam or shell
therefore transfers force but no moment.
