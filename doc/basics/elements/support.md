# Support

A **support** restrains degrees of freedom at a node. Alpaca4d supports can be axis-aligned,
in which case they are exact point constraints, or **skewed** — turned to an arbitrary plane,
for an inclined roller or a support on a sloping face.

## 🔧 Grasshopper component

`Support (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Position | `Position` | Plane | — | Where the support acts, in `m`. A **Point** restrains the global axes; a **Plane** restrains its own axes instead, which is how you get a skewed support. |
| Tx | `Tx` | Boolean | `true` | Translation along the support plane's *X* axis. `true` = restrained. |
| Ty | `Ty` | Boolean | `true` | Translation along the support plane's *Y* axis. |
| Tz | `Tz` | Boolean | `true` | Translation along the support plane's *Z* axis. |
| Rx | `Rx` | Boolean | `true` | Rotation about the support plane's *X* axis. |
| Ry | `Ry` | Boolean | `true` | Rotation about the support plane's *Y* axis. |
| Rz | `Rz` | Boolean | `true` | Rotation about the support plane's *Z* axis. |

A point arriving on **Position** is cast to a world-aligned plane at that point, so a model
built before planes were an option behaves exactly as it did.

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Support | `Support` | Support | Support object, to be connected to [Assemble](../assemble.md). |

### The seven presets

Seven common DOF patterns are recognised by name and drawn with their own symbol in
[Model View](../visualisation/model-view.md). Anything else is drawn as a short text tag
listing the restrained DOFs.

| Preset | Tx | Ty | Tz | Rx | Ry | Rz |
| --- | --- | --- | --- | --- | --- | --- |
| Rigid / Fixed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hinged / Pinned | ✓ | ✓ | ✓ | | | |
| Sliding in X and Y + Rz restraint | | | ✓ | | | ✓ |
| Sliding in X + Rz restraint | | ✓ | ✓ | | | ✓ |
| Sliding in Y + Rz restraint | ✓ | | ✓ | | | ✓ |
| Sliding in Z and Y + Rz restraint | ✓ | | | | | ✓ |
| Free | | | | | | |

## 📈 When to use it

**Use it when**

- Anywhere the structure meets the ground or a stiffer neighbouring system.
- You need a roller on an incline, or a bearing on a sloping face — feed a rotated **Plane**
  rather than trying to fake it with constraints.

**Do not use it when**

- You want two nodes of the model to move together rather than to be held still → use
  [Rigid Link](../constraints/equal-dof.md) or
  [Rigid Diaphragm](../constraints/diaphragm.md).

## 🔗 Relation to OpenSees

**Axis-aligned** supports are a single point constraint, exact and free of any penalty:

```tcl
fix $nodeTag  $tx $ty $tz $rx $ry $rz
```

**Skewed** supports are different. OpenSees has no notion of a nodal coordinate system —
`fix` only ever speaks global DOFs — so the restraint is carried by a `zeroLength` element
between the support node and a coincident node that is fixed outright:

```tcl
uniaxialMaterial Elastic $springTag $k $eta $kNeg
node $auxTag $x $y $z
fix  $auxTag 1 1 1 1 1 1
element zeroLength $eleTag $auxTag $nodeTag -mat $springTag ... \
        -dir $d1 $d2 ... -orient $xx $xy $xz  $yx $yy $yz
```

- `-orient` hands the element the support plane, after which the `-dir` indices count along
  the plane's own axes: **1–3 translation, 4–6 rotation**.
- Directions left out of `-dir` carry no stiffness at all, so a release along a local axis is
  exact. Only the restrained directions are a penalty.
- The penalty stiffness is **10⁶ × the stiffest term in the model** — recomputed per model
  from the element diagonals, so it is unit-independent and leaves the solver about ten
  digits of conditioning.

{% hint style="info" %}
For a skewed support the reaction lands on the auxiliary node, because that is where the
point constraint lives. [Reaction Forces](../results/reaction-forces.md) reads it back from
there and reports it in the support's own axes, so this is invisible from Grasshopper.
{% endhint %}
