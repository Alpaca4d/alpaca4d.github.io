# Analysis Step

Says how many steps the analysis takes and how long each one is — the arguments of the
OpenSees `analyze` command.

## 🔧 Grasshopper component

`Analysis Step (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| NumIncr | `NumIncr` | Integer | `1` | Number of steps to run. |
| Dt | `Dt` | Number | *(none)* | Time step, in `s`. Transient analysis only. |
| DtMin | `DtMin` | Number | *(none)* | Smallest step the solver may fall back to when a step fails. |
| DtMax | `DtMax` | Number | *(none)* | Largest step it may grow to. |
| Jd | `Jd` | Integer | *(none)* | Iterations aimed for at each step, used to decide whether to grow or shrink `Dt`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| AnalysisStep | `AnalysisStep` | AnalysisStep | For [Analysis Settings](analysis-settings.md). |

## 📈 When to use it

**Use it when** you are running anything through [Run Analysis](run-analysis.md). Every
analysis needs one.

**Do not use it when** you only want modes → [Natural Vibration](natural-vibration.md) runs
its own eigenvalue problem and takes no steps.

## 💡 Choosing the values

**Static, linear.** `NumIncr = 1` and nothing else. One step applies the whole load.

**Static, non-linear.** Raise `NumIncr` and lower the [Integrator](integrator.md)'s `Lambda`
so their product reaches the load factor you want. Twenty to a hundred steps is normal for a
pushover; more steps mean a smoother capacity curve and a better chance of converging.

**Transient.** `NumIncr × Dt` is the duration of the analysis. `Dt` must resolve both the
excitation and the response:

- Small enough to sample the highest mode you care about — twenty points per period.
- Small enough to sample the input signal. A ground motion recorded at 0.005 s should not be
  run at 0.05 s.
- For [CentralDifference](integrator.md), small enough to stay stable, which is usually much
  smaller than either of the above.

**Adaptive stepping.** Setting `DtMin`, `DtMax` and `Jd` lets the solver shrink the step when
it struggles and grow it again afterwards. Worth it for long non-linear runs; leave them
empty otherwise.

## 🔗 Relation to OpenSees

```tcl
set alpacaAnalyzeOk [analyze $numIncr $dt $dtMin $dtMax $jd]
```

The result is captured so that [Run Analysis](run-analysis.md) can tell a non-convergence
from a successful run — `analyze` returns a negative number on failure but does not raise a
Tcl error.
