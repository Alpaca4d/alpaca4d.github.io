# Fiber Stress Strain

Splits a [Moment Curvature](moment-curvature.md) fibre result into its fibres, stresses and
strains — one branch per fibre.

## 🔧 Grasshopper component

`Fiber Stress Strain (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**, nickname `FBS`

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| FiberStressStrain | `FiberStressStrain` | Generic | — | The `fiberStressStrain` output of a [Moment Curvature](moment-curvature.md) component. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| FiberPoint | `FiberPoint` | PointFiber (tree) | The fibres of the analysed section, one branch each. |
| Stress | `Stress` | Number (tree) | Stress history of each fibre, in `kN/m²`, one branch per fibre. |
| Strain | `Strain` | Number (tree) | Strain history of each fibre, dimensionless, one branch per fibre. |

All three trees are parallel: branch *i* of each belongs to the same fibre, and within a
branch the values follow the increments of the analysis.

## 📈 When to use it

**Use it when**

- You want to know **when** something failed, and which fibre went first. Find the increment
  at which the extreme compression fibre passes `EpsilonCu`, or a bar passes `eult`, and read
  the moment and curvature at that index.
- You want the stress–strain path of one fibre, to check the material is doing what you
  expect — plot Stress against Strain for a single branch.
- You want to colour the section by strain at a chosen increment: take the *n*-th item of
  every branch and map it onto the **FiberPoint** positions.

**Do not use it when**

- You only need the section curve → `My` and `κy` come straight out of
  [Moment Curvature](moment-curvature.md).

{% hint style="info" %}
The number of branches is the number of fibres, which for a
[Patch](patch.md)-based section is the number of mesh faces. A finely meshed section produces
a large tree — expect hundreds of branches, each as long as `NumIncr`.
{% endhint %}
