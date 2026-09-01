# Constant

A **constant time series** holds the load factor fixed for the whole analysis:

$$
\lambda(t) = c_\text{factor}
$$

## 🔧 Grasshopper component

`Constant Time Series (Alpaca4d)` — **Alpaca4d ▸ 04_Time Series**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| LoadFactor | `LoadFactor` | Number | `1.0` | The constant factor $$c_\text{factor}$$. Every load in the pattern is multiplied by it at every step. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| TimeSeries | `TimeSeries` | TimeSeries | Constant series, for a [Load Pattern](../loads/load-pattern.md). |
| Graph | `Graph` | Number (list) | The values, for plotting — a flat line at $$c_\text{factor}$$. |

This is the default series: a **PlainPattern** with nothing on its `TimeSeries` input uses a
constant series with a factor of 1.

## 📈 When to use it

**Use it when**

- Loads are on for the whole analysis — dead load, permanent equipment, superimposed
  finishes.
- You are running a plain static analysis and the time is only a pseudo-time.
- You want a fixed scale on a base excitation.

**Do not use it when**

- The load needs to ramp → [Linear](linear.md).
- The load follows a recorded signal → [Path](path.md) or
  [Read Time Series](read-time-series.md).
- The load is periodic → [Trigonometric](trigonometric.md).

## 🔗 Relation to OpenSees

```tcl
timeSeries Constant $tag -factor $cFactor
```
