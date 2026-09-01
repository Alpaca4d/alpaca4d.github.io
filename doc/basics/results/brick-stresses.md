# Brick Stresses

The full stress tensor at every solid element, plus the Von Mises equivalent stress.

## 🔧 Grasshopper component

`Brick Stresses (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

Applies to [SSP Brick](../elements/brick.md) and
[Four Node Tetrahedron](../elements/four-node-tetrahedron.md) elements.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | Not implemented. |
| Step | `Step` | Integer | `0` | Analysis step. |

### Outputs

One branch per element, values at the element's integration points.

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Sigma11 | `σ₁₁` | Number (tree) | Normal stress along axis 1, in `kN/m²`. |
| Sigma22 | `σ₂₂` | Number (tree) | Normal stress along axis 2. |
| Sigma33 | `σ₃₃` | Number (tree) | Normal stress along axis 3. |
| Sigma12 | `σ₁₂` | Number (tree) | Shear stress in the 1–2 plane. |
| Sigma23 | `σ₂₃` | Number (tree) | Shear stress in the 2–3 plane. |
| Sigma13 | `σ₁₃` | Number (tree) | Shear stress in the 1–3 plane. |
| VonMises | `VonMises` | Number (list) | Von Mises equivalent stress, in `kN/m²`. |

## 📈 When to use it

**Use it when**

- You are checking a solid region against a strength criterion — Von Mises for a ductile
  material, the principal stresses for a brittle one.
- You need the stress state at a detail: a bearing, an anchorage, a stress concentration.

**Do not use it when**

- You want a contour → [Brick Stresses View](../visualisation/brick-stresses-view.md), which
  colours the mesh by any of the seven quantities.

{% hint style="info" %}
An [SSP Brick](../elements/brick.md) has a **single integration point**, at the centroid.
Each branch therefore holds one value per element, and the stress you get is an element
average — fine for a global picture, coarse near a concentration. Refine the mesh where the
gradient is steep.
{% endhint %}
