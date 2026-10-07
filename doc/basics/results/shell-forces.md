# Shell Forces

The stress resultants on every shell element: membrane forces, bending moments and
transverse shears, all per unit width.

## 🔧 Grasshopper component

`Shell Forces (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | Read every recorded step instead of one. The outputs become trees `{step; element}`. **Step** is ignored. |
| Step | `Step` | Integer | `0` | Analysis step. |

### Outputs

One branch per shell element, values at the element's integration points.

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| pxx | `pxx` | Number (tree) | Membrane force along local *x* (axis 1), in `kN/m`. |
| pyy | `pyy` | Number (tree) | Membrane force along local *y* (axis 2), in `kN/m`. |
| pxy | `pxy` | Number (tree) | In-plane shear, in `kN/m`. |
| mxx | `mxx` | Number (tree) | Bending moment whose stresses run along local *x* (axis 1) — it bends the shell about local *y* — in `kN·m/m`. |
| myy | `myy` | Number (tree) | Bending moment whose stresses run along local *y* (axis 2) — it bends the shell about local *x* — in `kN·m/m`. |
| mxy | `mxy` | Number (tree) | Twisting moment, in `kN·m/m`. |
| vxz | `vxz` | Number (tree) | Transverse shear on the *x* face, in `kN/m`. |
| vyz | `vyz` | Number (tree) | Transverse shear on the *y* face, in `kN/m`. |

## 📈 When to use it

**Use it when**

- You are designing slab or wall reinforcement — `mxx`, `myy` and `mxy` are what go into a
  Wood–Armer calculation.
- You need membrane forces in a shear wall or a tank.

**Do not use it when**

- You want a contour → [View Results](../visualisation/view-results.md), with *Shell forces* picked as the result.
- You want the principal directions → [Principal Stress
  Lines](../visualisation/principal-stress-lines.md) traces them as curves.

{% hint style="warning" %}
**These are local-axis results, and the local axes are per face** unless you set them. Two
adjacent faces of the same slab can report `mxx` about different directions, which makes the
numbers meaningless to compare or to contour.

Set **Local X Axis** on the [ASD Shell](../elements/shell.md) component for any model whose
shell results you intend to read.
{% endhint %}

## 💡 Sign convention

All quantities are **per unit width**. Local *x*, *y* and *z* are axes 1, 2 and 3 of
**Local Axes** in [Model View](../visualisation/model-view.md) — red, green and blue. Positive
membrane force is tension. A positive `mxx` or `myy` puts the face on the **positive** local *z*
side — the side the blue arrow points to — in tension: the **Top** layer of
Shell Stresses. On a cantilever slab whose mesh faces up, `mxx` is positive
over the support.

Which side is +*z* follows the order of the mesh's vertices, not the world: a mesh whose faces
point down has its Top layer underneath.
