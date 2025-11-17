# Trigonometric

A **Trigonometric Time Series** defines a time–history where the load factor $ \lambda $ varies **sinusoidally** in time. In Alpaca4d (following OpenSees) it is typically defined as:

$$
\lambda(t) = c_\text{factor} \, \sin\!\Big( \tfrac{2\pi}{T} (t - t_\text{shift}) \Big)
$$

over a specified active interval $ t_\text{start} \le t \le t_\text{end} $, where:

- $ c_\text{factor} $ is the amplitude,
- $ T $ is the period,
- $ t_\text{shift} $ is a phase shift in time.

This is useful for modelling **harmonic / cyclic loading** such as machine vibrations or idealised base excitations.

## 🔧 Grasshopper component

The `Trigonometric Time Series (Alpaca4d)` component constructs a periodic (sine) time series with user‑controlled time window, period and amplitude.

- **Inputs**
  - **TStart**: Start time $ t_\text{start} $ $[s]$.  
    - Type: Number  
    - Default: `0.0`  
    - Effect: For $ t < t_\text{start} $ the load factor is zero.
  - **TEnd**: End time $ t_\text{end} $ $[s]$.  
    - Type: Number  
    - Requirement: $ t_\text{end} > t_\text{start} $. For $ t > t_\text{end} $ the load factor is usually zero.
  - **Period**: Period $ T $ of the sinusoidal function $[s]$.  
    - Type: Number  
    - Effect: Controls the **frequency** of oscillation.
  - **Shift**: Time shift $ t_\text{shift} $ $[s]$.  
    - Type: Number  
    - Default: `0.0`  
    - Effect: Moves the sine wave left/right in time (phase shift).
  - **LoadFactor**: Amplitude $ c_\text{factor} $ of the sine wave.  
    - Type: Number  
    - Default: `1.0`.

- **Outputs**
  - **TimeSeries**: Alpaca4d `Trigonometric` time series object.
  - **Graph**: A list of values representing the sinusoidal time–history between **TStart** and **TEnd**.

## 📈 When to use a trigonometric time series

- **Use it when**
  - You need **harmonic / cyclic loading** with a well‑defined frequency (e.g. machine vibration, idealised sinusoidal base motion).
  - You want to **control the number of cycles** in a given time window via `TStart`, `TEnd` and `Period`.
  - You are performing parametric studies on **frequency–dependent response**.

- **Do not use it when**
  - The excitation is **non‑periodic or irregular** (e.g. real earthquake records) → use a **Path** time series.
  - The loading is simply **constant** or **linearly varying** → use **Constant** or **Linear** time series.

## 🔗 Relation to OpenSees

Alpaca4d’s trigonometric time series corresponds to the OpenSees `Trig` timeSeries:

```tcl
timeSeries Trig $tag $tStart $tEnd $period -shift $shift -factor $cFactor
```

```python
timeSeries('Trig', tag, tStart, tEnd, period,
           '-shift',  shift,
           '-factor', cFactor)
```

where:

- **TStart**, **TEnd**, **Period**, **Shift**, **LoadFactor** in the Grasshopper component map directly to  
  `tStart`, `tEnd`, `period`, `shift`, `cFactor` in the OpenSees commands.
