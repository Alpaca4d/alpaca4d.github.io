# Reaction Forces

The force and moment each [Support](../elements/support.md) applies to the structure,
reported **in the support's own axes**.

## 🔧 Grasshopper component

`Reaction Forces (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | Read every recorded step instead of one. **ReactionForce** and **ReactionMoment** become trees `{step}`; **SupportPosition** stays a flat list. **Step** is ignored. |
| Step | `Step` | Integer | `0` | Analysis step. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| SupportPosition | `SupportPosition` | Plane (list) | Where each support is, **and the axes its reactions are given in**. Its origin is the support position; its axes are the frame below. |
| ReactionForce | `ReactionForce` | Vector (list) | Reaction force, in `kN`, in the support's own axes. |
| ReactionMoment | `ReactionMoment` | Vector (list) | Reaction moment, in `kN·m`, in the support's own axes. |

The three lists are parallel: item *i* of each belongs to the same support.

## 💡 Why the support's own axes

For a support placed on a **Point** the plane is world-aligned, so the reactions are the
global components — exactly as before.

For a support placed on a **Plane**, the reactions are resolved onto that plane. This is what
makes a released direction read as the zero it actually is: OpenSees reports reactions in
global components whatever the support is turned to, which for a skewed support spreads a
reaction running along one local axis across all three global ones.

{% hint style="info" %}
A skewed support carries its restraint on a coincident auxiliary node — see
[Support](../elements/support.md#relation-to-opensees) — so that is where OpenSees puts the
reaction, and the support node itself reads zero. This component reads the right node
automatically; you never see the auxiliary node.
{% endhint %}

## 📈 When to use it

**Use it when**

- You need foundation loads to pass on to a footing design.
- You are checking global equilibrium: the sum of the vertical reactions should match the
  applied load, and if it does not, something in the model is not connected.
- You want to confirm a support is doing what you meant — a released direction should read
  zero.

## 💡 Notes

- Reactions are what the **support applies to the structure**. Sign convention follows the
  plane's axes.
- Restrained directions of a skewed support are held by a penalty spring, so their reactions
  are accurate to about one part in 10⁶ rather than exact.
