# 🌍 Gravity

Applies the **self-weight** of every element in the model, derived from the material density
and the section or thickness.

## 🔧 Grasshopper component

`Gravity Load (Alpaca4d)` — **Alpaca4d ▸ 05_Load**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Factor | `Factor` | Number | `1.0` | Multiplier on gravity. `1.0` is plain self-weight; `0.0` disables it; `1.35` gives a factored permanent load; values above 1 are also a quick way to include finishes not modelled explicitly. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Load | `Load` | Load | Gravity load, for a [Load Pattern](load-pattern.md). |

There is no geometry input. Gravity applies to the whole model, and its direction is −Z.

## 📈 When to use it

**Use it when**

- Any model where self-weight matters. Put it in its own permanent pattern (a "G" case) and
  combine it with the others.

**Do not use it when**

- You are modelling weight that is *not* in the elements — plant, finishes, a stored
  material → use [Point Load](point-load.md), [Beam Load](beam-load.md) or
  [Shell Load](shell-load.md), and [Mass Point](mass-point.md) for the dynamic side.

{% hint style="warning" %}
**Discretise your beams.** For beam elements the algorithm generates equivalent
**concentrated nodal loads at the element ends**, not a distributed load along the span. A
single element spanning 6 m therefore puts half its weight at each end and produces no
sagging moment from self-weight at all.

Split beams into several elements — five or more per span — and the equivalent nodal loads
land at enough points to approximate the real distribution. This also improves the
[Beam Forces](../results/beam-forces.md) diagram resolution, which is sampled at the
integration points of each element.
{% endhint %}

## 🔗 Relation to OpenSees

Gravity is resolved by Alpaca4d during assembly rather than written as its own command. Each
element's weight becomes `load` entries inside the enclosing pattern:

```tcl
pattern Plain $tag $tsTag -fact $factor {
    load $nodeTag 0.0 0.0 -$w
    ...
}
```

The weight of a beam is `A × ρ × L`, of a shell `t × ρ × area`, split between the nodes of
the element.
