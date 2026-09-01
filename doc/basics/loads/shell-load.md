# 🧱 Shell

A uniform **surface pressure** on shell elements.

## 🔧 Grasshopper component

`Mesh Load (Alpaca4d)` — **Alpaca4d ▸ 05_Load**, nickname `MeshLoad`

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| ShellElement | `ShellElement` | Element | *all shells* | The shell element to load. **If left empty the load is applied to every shell element in the model.** |
| Force | `Force` | Vector | — | Pressure `px, py, pz` in **global** axes, in `kN/m²`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Load | `Load` | Load | Surface load, for a [Load Pattern](load-pattern.md). |

## 📈 When to use it

**Use it when**

- Floor live loads, roof snow, wind pressure on a façade, soil pressure on a retaining wall
  — anything acting over an area.

**Do not use it when**

- The pressure varies over the surface. This is **uniform** per element, so a varying
  pressure means grouping the mesh faces and applying a different component to each group.
- The action is along a line or at a point → [Beam Load](beam-load.md) or
  [Point Load](point-load.md).

{% hint style="info" %}
The pressure is **not** applied along the shell normal. The vector is in global axes, so a
downward load on a pitched roof given as `0, 0, -q` is a load per square metre **of the
sloping surface**, not of its plan projection. For a snow load defined on plan, scale by
`cos θ` yourself.
{% endhint %}

## 🔗 Relation to OpenSees

There is no OpenSees surface-load command for these elements. Alpaca4d converts the pressure
into equivalent nodal loads — the element area divided among its vertices — and writes them
inside the enclosing pattern:

```tcl
load $nodeTag $Fx $Fy $Fz $Mx $My $Mz
```
