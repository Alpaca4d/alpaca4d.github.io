# 🧩 Load Pattern

A **load pattern** groups loads and attaches a [time series](../time-history/README.md) that
says how the group varies with time. It is the object the analysis actually applies — loose
loads never reach [Assemble](../assemble.md) on their own.

## 🔧 Grasshopper component

`Load Pattern (Alpaca4d)` — **Alpaca4d ▸ 05_Load**

A switcher component. Right-click it to pick the unit:

- **PlainPattern** — static and quasi-static load cases.
- **UniformExcitation** — base acceleration applied to every support.

### Inputs — PlainPattern

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| TimeSeries | `TimeSeries` | TimeSeries | [Constant](../time-history/constant.md), factor 1 | How the pattern factor evolves with analysis time. |
| Loads | `Loads` | Load (list) | — | The loads in this pattern: point, line, surface, gravity. |
| Factor | `Factor` | Number | `1` | Constant scale applied to the whole pattern, on top of the time series. |

### Inputs — UniformExcitation

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Dof | `Dof` | Text | `X` | Direction the ground motion acts in. Attach a **Value List** for the options: `x`, `y`, `z` (translation along the global axes), `xx`, `yy`, `zz` (rotation about them). |
| TimeSeries | `TimeSeries` | TimeSeries | — | The ground motion, normally **acceleration** against time. |
| Velocity | `Velocity` | Number | `0` | Initial ground velocity, in `m/s`. |
| Factor | `Factor` | Number | `1` | Constant scale on the excitation — where a record in *g* gets its 9.81. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| LoadPattern | `LoadPattern` | LoadPattern | Pattern object, for the `LoadPatterns` input of [Assemble](../assemble.md). |

## 📈 When to use it

**PlainPattern** for everything static: dead, live, snow, wind, imposed. One pattern per load
case, so you can scale and combine them independently.

**UniformExcitation** for a seismic time-history run. It shakes the whole base at once, in
one direction, and needs a [Transient](../analysis/analysis-settings.md) analysis type with a
suitable [Integrator](../analysis/integrator.md) — `Newmark` or `CentralDifference`.

**Do not use UniformExcitation when** different supports see different motions — that needs
multiple-support excitation, which Alpaca4d does not expose.

## 💡 Workflow

1. Build the individual **loads**.
2. Group them into one or more **Load Pattern** components, each with its own time series.
3. Connect the patterns to [Assemble](../assemble.md).

Keeping loads and patterns separate is what lets the same physical load appear in several
cases at different factors.

## 🔗 Relation to OpenSees

```tcl
# PlainPattern
timeSeries ...
pattern Plain $tag $tsTag -fact $factor {
    load    $nodeTag ...
    eleLoad -ele $eleTag ...
}

# UniformExcitation
pattern UniformExcitation $tag $dir -accel $tsTag -vel0 $velocity -fact $factor
```

`$dir` is the integer the **Dof** text maps to: `X`=1, `Y`=2, `Z`=3, `XX`=4, `YY`=5, `ZZ`=6.
