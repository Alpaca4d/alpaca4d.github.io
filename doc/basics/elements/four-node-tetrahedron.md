# Four Node Tetrahedron

The **four node tetrahedron** is a linear 3D solid element. It is the fallback for
volumetric geometry that will not mesh into hexahedra — which is most geometry that was not
drawn with bricking in mind.

## 🔧 Grasshopper component

`FourNodeTetrahedron (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

Constructs one tetrahedral element from one 4-vertex mesh.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Mesh | `Mesh` | Mesh | — | Tetrahedral mesh with **4 vertices**, in `m`. Passed through `CleanTetrahedron` to order the corners. |
| Material | `Material` | Material | — | An [nD material](../materials/ND.md). |
| Colour | `Colour` | Colour | Alpaca4d brick colour | Display colour in the Rhino viewport. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element | Tetrahedral element, to be connected to [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- The volume you need to model cannot be meshed into hexahedra.
- You are filling an irregular or free-form solid region.

**Do not use it when**

- A hexahedral mesh is available → prefer [SSP Brick](brick.md). The linear tetrahedron has
  a constant strain field, so it is stiff in bending and needs a much finer mesh to reach
  the same accuracy.
- The body is thin → use [Shell](shell.md).

## 🔗 Relation to OpenSees

```tcl
element FourNodeTetrahedron $eleTag $n1 $n2 $n3 $n4 $matTag $bx $by $bz
```

- The 4 mesh vertices map to `$n1 … $n4`.
- `$matTag` is the **Material** input.
- Body forces are not exposed by the component; use [Gravity Load](../loads/gravity.md) for
  self-weight.

Tetrahedron nodes have **3 DOF**.
