# Hinge Release

A **hinge release** is the DOF pattern of one beam end. It is consumed by the **WithHinges**
unit of the [ForceBeamColumn](beam-with-hinges.md) component, and by nothing else.

## 🔧 Grasshopper component

`Hinge Release (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Tx | `Tx` | Boolean | `true` | Axial translation along *x*. **`false` = released.** |
| Ty | `Ty` | Boolean | `true` | Translation along *y*. `false` = released. |
| Tz | `Tz` | Boolean | `true` | Translation along *z*. `false` = released. |
| Rx | `Rx` | Boolean | `true` | Torsional rotation about *x*. `false` = released. |
| My | `My` | Boolean | `true` | Bending about *y*. `false` = released. |
| Mz | `Mz` | Boolean | `true` | Bending about *z*. `false` = released. |

{% hint style="warning" %}
The sense is inverted relative to what the word "release" suggests: `true` means **held**,
`false` means **released**. It reads the same way as the booleans on
[Support](support.md), which is why it is that way round.
{% endhint %}

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Release | `Release` | Release | Release condition, for the `ReleaseI` or `ReleaseJ` input of a **WithHinges** beam. |

## 📈 When to use it

**Use it when**

- You need a pinned beam end: set `My` and `Mz` to `false`.
- You need a moment release about one axis only.
- You are building a member that carries axial force only.

**Do not use it when**

- The member is fully continuous — leave `ReleaseI` and `ReleaseJ` empty and the ends are
  taken as fixed.

## 🔗 Relation to OpenSees

There is no OpenSees release command. A released DOF becomes a hinge section with that
property scaled by **10⁻⁶**, placed by `HingeRadau` — see
[Beam With Hinges](beam-with-hinges.md#relation-to-opensees) for the mapping from each
boolean to the section property it softens.

Because the hinge is a very soft section rather than a true free end, the release is
approximate. Its accuracy depends on `Lp/L`, which is why that ratio is clamped.
