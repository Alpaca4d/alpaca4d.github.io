# 🎯 Point

A concentrated **force and moment** applied at a single point.

## 🔧 Grasshopper component

`Point Load (Alpaca4d)` — **Alpaca4d ▸ 05_Load**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Point | `Point` | Point | — | Where the load acts. Matched to the nearest node within the [Assemble](../assemble.md) tolerance. |
| Force | `Force` | Vector | — | Force components `Fx, Fy, Fz` in **global** axes, in `kN`. |
| Moment | `Moment` | Vector | `0, 0, 0` | Moment components `Mx, My, Mz` in **global** axes, in `kN·m`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Load | `Load` | Load | Point load, for a [Load Pattern](load-pattern.md). |

## 📈 When to use it

**Use it when**

- The area of application is small compared with the structure — a column reaction on a
  transfer beam, a machine base, a cable anchorage.
- You are applying a control force for a pushover.

**Do not use it when**

- The load is genuinely distributed → [Beam Load](beam-load.md) or
  [Shell Load](shell-load.md).
- There is no node at the point. A point load lands on the **nearest** node within tolerance;
  if there is none within it, assembly fails with *"Point load at location … is not part of
  the model!"* — raise the [Assemble](../assemble.md) tolerance or move the point.

{% hint style="info" %}
The moment components are dropped on a 3 DOF node — one belonging only to bricks or
tetrahedra. Only nodes touched by a beam or a shell carry rotational DOFs.
{% endhint %}

## 🔗 Relation to OpenSees

Inside the enclosing pattern:

```tcl
load $nodeTag $Fx $Fy $Fz $Mx $My $Mz   ;# 6 DOF node
load $nodeTag $Fx $Fy $Fz               ;# 3 DOF node
```
