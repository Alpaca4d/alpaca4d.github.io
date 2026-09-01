# Path

A **path time series** is defined by a list of times and a list of values, with linear
interpolation between them. It reproduces arbitrary signals: recorded ground motions,
measured forces, anything you can express as numbers.

## 🔧 Grasshopper component

`Path Time Series (Alpaca4d)` — **Alpaca4d ▸ 04_Time Series**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Times | `Times` | Number (list) | — | Times $$t_i$$, in `s`. Ascending, and the same count as **Values**. |
| Values | `Values` | Number (list) | — | Load factors $$\lambda_i$$ at those times. |
| LoadFactor | `LoadFactor` | Number | `1.0` | Global scale $$c_\text{factor}$$ applied to all values. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| TimeSeries | `TimeSeries` | TimeSeries | Path series, for a [Load Pattern](../loads/load-pattern.md). |
| Graph | `Graph` | Number (list) | The values, for plotting. |

## 📈 When to use it

**Use it when**

- You need a recorded time history — earthquake acceleration, a measured force or
  displacement.
- The signal is generated in Grasshopper and is not analytic.
- You want full control over the shape of the excitation.

**Do not use it when**

- The signal lives in a file → [Read Time Series](read-time-series.md) parses it for you.
- A constant or a ramp will do → [Constant](constant.md) or [Linear](linear.md).
- The loading is purely harmonic → [Trigonometric](trigonometric.md) is one number instead
  of a list.

## 🔗 Relation to OpenSees

```tcl
timeSeries Path $tag -time {t1 t2 ... tn} -values {v1 v2 ... vn} -factor $cFactor -useLast
```

`-useLast` is always written: past the last time in the list, the factor holds at the final
value rather than dropping to zero. If you want the excitation to stop, end the list with a
zero.
