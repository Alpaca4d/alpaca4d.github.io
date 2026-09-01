# Test

The **convergence test** decides when an iteration within a step is close enough to stop.

## 🔧 Grasshopper component

`Test (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

A switcher component with four units: `EnergyIncr`, `NormUnbalance`, `NormDispIncr` and
`NormDispAndUnbalance`.

### Inputs — EnergyIncr, NormUnbalance, NormDispIncr

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Tolerance | `Tol` | Number | `1e-8` | Convergence tolerance. |
| Iteration | `Iter` | Integer | `10` | Maximum iterations before the step is declared failed. |
| Flag | `Flag` | Integer | `0` | How much the test prints: `0` nothing, `1` each time, `2` on success, `4` each step, `5` error message. |
| Norm | `Norm` | Integer | `2` | Which norm: `0` max, `1` one-norm, `2` two-norm. |
| MaxIncr | `MaxIncr` | Integer | `2` | Maximum times the residual may grow before the test gives up. |

### Inputs — NormDispAndUnbalance

Requires **both** criteria to be satisfied.

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| TolIncr | `TolIncr` | Number | `1e-8` | Tolerance on the displacement increment. |
| TolR | `TolR` | Number | `1e-8` | Tolerance on the residual force. |
| Iteration | `Iter` | Integer | `10` | Maximum iterations. |
| Flag | `Flag` | Integer | `0` | Print level, as above. |
| Norm | `Norm` | Integer | `2` | Norm, as above. |
| MaxIncr | `MaxIncr` | Integer | `2` | Maximum residual growths. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Test | `Test` | Test | For [Analysis Settings](analysis-settings.md). |

## 📈 When to use it

**Use it when** you are running anything through [Run Analysis](run-analysis.md). Every
analysis needs a convergence test, even a linear one.

**Do not use it when** you only want modes → [Natural Vibration](natural-vibration.md) has
nothing to converge.

## 💡 Which test

| Unit | Measures | Use for |
| --- | --- | --- |
| **NormDispIncr** | The size of the displacement increment. | The general default. |
| **NormUnbalance** | The size of the residual force. | When equilibrium is what matters — you care that forces balance, not that the model stopped moving. |
| **EnergyIncr** | The product of the two. | Well-conditioned for problems mixing very stiff and very flexible parts. |
| **NormDispAndUnbalance** | Both displacement and residual. | Strict, when you do not trust either alone. |

{% hint style="info" %}
`1e-8` is tight. A model in kN and metres with a displacement test will usually converge, but
a stiff model, or one with a badly scaled unit system, may need `1e-6` or looser. Raising
**Iteration** to 100 costs little and rescues many runs.

If a run fails to converge, turn **Flag** to `1` and read the [log](run-analysis.md) — it
will show whether the residual is falling slowly or diverging outright, which are different
problems.
{% endhint %}

## 🔗 Relation to OpenSees

```tcl
test $type $tol $iter $flag $norm $maxIncr
test NormDispAndUnbalance $tolIncr $tolR $iter $flag $norm $maxIncr
```
