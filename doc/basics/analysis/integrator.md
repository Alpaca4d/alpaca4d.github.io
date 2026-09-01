# Integrator

The **integrator** decides how the solution advances from one step to the next — how much
load to add in a static analysis, or how to march through time in a transient one.

## 🔧 Grasshopper component

`Integrator (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

A switcher component. Right-click it to pick the unit.

### Inputs — LoadControl

For **static** analysis. Adds a fixed increment of load factor at each step.

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Lambda | `Lambda` | Number | `1` | Load factor increment per step. |
| NumIter | `NumIter` | Integer | `10` | Iterations the integrator aims for at each step. |
| MinLambda | `MinLambda` | Number | `0.01` | Smallest increment allowed when the step is cut back. |
| MaxLambda | `MaxLambda` | Number | `10` | Largest increment allowed. |

### Inputs — Newmark

For **transient** analysis. The standard implicit time-stepping scheme.

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Gamma | `Gamma` | Number | `0.5` | Newmark γ. |
| Beta | `Beta` | Number | `0.25` | Newmark β. |

`γ = 0.5, β = 0.25` is the average acceleration method: unconditionally stable and free of
numerical damping. `γ > 0.5` introduces numerical damping, which can help a noisy non-linear
run at the cost of some accuracy.

### Inputs — CentralDifference

For **transient** analysis. Explicit, no inputs.

Conditionally stable: the time step must be below the critical step of the smallest, stiffest
element in the model, or the solution diverges. Suits short, sharp events on models where a
small step is wanted anyway.

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Integrator | `Integrator` | Integrator | For [Analysis Settings](analysis-settings.md). |

## 📈 When to use it

| Analysis | Integrator |
| --- | --- |
| Linear static | **LoadControl**, `Lambda = 1`, one step |
| Pushover / non-linear static | **LoadControl** with a small `Lambda` and many steps |
| Seismic or general dynamic | **Newmark** |
| Impact, blast, wave propagation | **CentralDifference**, with a small `Dt` |

{% hint style="warning" %}
The integrator and the [analysis type](analysis-settings.md) have to agree. `LoadControl`
with `Transient`, or `Newmark` with `Static`, will not do what you want.
{% endhint %}

## 🔗 Relation to OpenSees

```tcl
integrator LoadControl       $lambda $numIter $minLambda $maxLambda
integrator Newmark           $gamma $beta
integrator CentralDifference
```
