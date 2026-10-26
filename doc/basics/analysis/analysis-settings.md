# Analysis Settings

Collects every object OpenSees needs to define an analysis into one bundle, which
[Run Analysis](run-analysis.md) then executes.

## 🔧 Grasshopper component

`Analysis Settings (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

<figure><img src="../../.gitbook/assets/components/analysis-settings.png" alt="Analysis Settings component" width="453"><figcaption></figcaption></figure>

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Damping | `Damping` | Damping | *(none)* | Rayleigh damping, from [Damping](damping.md). Leave empty for an undamped run. |
| Constraint | `Constraint` | Text | `Transformation` | Constraint handler: `Plain`, `Transformation`. |
| Numberer | `Numberer` | Text | `RCM` | DOF numbering: `RCM`, `AMD`, `Plain`. |
| System | `System` | Text | `Auto` | Linear system solver: `Auto`, `Mumps`, `BandGen`, `BandSPD`, `ProfileSPD`, `SuperLU`, `UmfPack`, `SparseSYM`, `SparseSPD`, `SparseGeneral`, `FullGeneral`. See [Solving on several cores](#solving-on-several-cores). |
| Test | `Test` | Test | — | Convergence test, from [Test](test.md). |
| Algorithm | `Algorithm` | Text | `Newton` | Solution algorithm: `Linear`, `Newton`, `NewtonLineSearch`, `ModifiedNewton`, `KrylovNewton`, `SecantNewton`, `BFGS`, `Broyden`. |
| Integrator | `Integrator` | Integrator | — | From [Integrator](integrator.md). |
| AnalysisType | `AnalysisType` | Text | `Static` | `Static` or `Transient`. |
| AnalysisSteps | `AnalysisSteps` | AnalysisStep | — | From [Analysis Step](analysis-step.md). |

Attach a **Value List** to any of the text inputs and Alpaca4d fills it with the valid
options.

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Settings | `Settings` | Settings | The analysis definition, for [Run Analysis](run-analysis.md). |

### Right-click menu

**Cores for Mumps** sets how many cores `Mumps` solves on: **All**, the default, or a number
from 1 up to the cores of the machine. It applies to System `Mumps`, and to `Auto` on an OpenSees
that has Mumps; every other System solves on one core. The choice is saved with the component, so
it stays with the definition.

## 💡 Choosing the values

**Constraint handler.** Leave it at `Transformation`. `Plain` cannot handle
[rigid diaphragms](../constraints/diaphragm.md) or
[rigid links](../constraints/rigid-link.md), and gives a wrong answer rather than an error
when it meets one.

**Algorithm.** `Newton`, the default, re-forms the tangent every iteration. On an elastic model
it is about 20 % slower than `Linear`, and on a yielding one it is what lets the step converge at
all. `Linear` does one solve with no iteration. On a non-linear model it still reports success,
and returns the unconverged first guess. `ModifiedNewton` re-forms the tangent less often, and
`KrylovNewton` often converges where Newton does not.

**System.** Leave it at `Auto`. It solves with `Mumps` when the OpenSees in use has it, and with
`BandSPD` when it does not. The official OpenSees does not have Mumps, and on it Auto notes the
switch in the log without raising a warning. `Mumps` asks for Mumps outright: on an OpenSees without
it the log carries a warning, and `BandSPD` solves. Both `Auto` and `Mumps` assume a symmetric
matrix, as `BandSPD` does. `UmfPack` and `SparseGeneral` assume nothing about it: reach for them if
a model refuses to solve. `UmfPack` runs out of memory in OpenSees on a frame or a solid of about
100 000 DOF. `FullGeneral` is for small models and debugging only.

**Analysis type.** `Static` for anything where inertia does not matter, including a pushover.
`Transient` whenever time is real: a ground motion, an impact, a machine.

## ⚡ Solving on several cores

`Mumps` is a sparse direct solver that factorises the stiffness matrix on several cores at once.
It runs inside the one OpenSees process Alpaca4d already starts, and needs nothing else installed.
It is only in an OpenSees built with it, which Alpaca4d uses when you point it at one, as
[Setup](../../setup.md#solving-on-several-cores) describes.

On a small model every solver takes a few milliseconds, and Mumps is as quick as `BandSPD`. On a
large one Mumps is 2 to 18 times quicker, and needs less memory. Below is one static step with
`Newton`, as [Run Analysis](run-analysis.md) solves it, on every core:

| Model | DOF | Mac, BandSPD | Mac, Mumps | Windows, BandSPD | Windows, Mumps |
| --- | ---: | ---: | ---: | ---: | ---: |
| Frame 15 × 15 × 15 bays | 23 040 | 0.47 s | 0.20 s | 1.01 s | 0.45 s |
| Brick block 24 × 24 × 24 | 45 000 | 17.0 s | 0.92 s | 30.9 s | 2.4 s |
| Shell 120 × 120 | 84 966 | 4.07 s | 1.89 s | 11.6 s | 4.2 s |
| Frame 25 × 25 × 25 bays | 101 400 | 13.1 s | 3.47 s | — | — |
| Shell 200 × 200 | 237 606 | 49.0 s | 5.40 s | — | — |
| Brick block 36 × 36 × 36 | 147 852 | out of memory (> 6 GB) | 4.71 s | — | — |

*Mac: Apple M2 Pro, 10 cores. Windows: a GitHub Actions runner, 4 virtual cores. Each answer was
checked against another solver's.*

Most of the gain comes from Mumps itself, not from the extra cores. Going from one core to all
of them takes off up to a further quarter. On a tiny model, starting the threads costs a few
milliseconds, more than they save.

## 📈 When to use it

**Use it when** you are running anything through [Run Analysis](run-analysis.md).

**Do not use it when** you only want modes → [Natural Vibration](natural-vibration.md) needs
no settings.

## 🔗 Relation to OpenSees

The component writes the standard analysis block:

```tcl
rayleigh    $alphaM $betaKcurr $betaKinit $betaKcomm
constraints $constraintType
numberer    $numbererType
system      $systemType
test        $testType $tol $iter $flag $norm $maxIncr
algorithm   $algorithmType
integrator  $integratorType ...
analysis    $analysisType
set alpacaAnalyzeOk [analyze $numIncr $dt $dtMin $dtMax $jd]
```

For `Auto` and `Mumps` the `system` line asks for Mumps, and falls back on `BandSPD` if OpenSees
does not know it:

```tcl
if {[catch {system Mumps -matrixType 1 -numThreads 0}]} {
    puts stderr "Alpaca4d: this OpenSees has no Mumps solver, so BandSPD solves, on one core"
    system BandSPD
}
```

`-numThreads 0` takes every core. A number picked in **Cores for Mumps** takes its place.
