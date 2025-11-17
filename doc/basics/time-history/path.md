# Path

A **Path Time Series** defines the relationship between time $ t $ and load factor $ \lambda $ using **user‑specified discrete points**:

$$
\lambda(t_i) = \lambda_i \quad \text{for} \quad i=1,\dots,n
$$

Values between the specified times are typically obtained by **linear interpolation**. This allows you to reproduce **arbitrary time histories**, such as recorded ground motions or experimental signals.

## 🔧 Grasshopper component

The `Path Time Series (Alpaca4d)` component creates an Alpaca4d path time series from lists of times and values.

- **Inputs**
  - **Times**: List of time values $ t_i $ $[s]$.  
    - Type: List of numbers  
    - Requirement: Must be in ascending order and have the same length as **Values**.
  - **Values**: List of corresponding load factors \( \lambda_i \).  
    - Type: List of numbers  
    - Requirement: Same count as **Times**; defines the raw shape of the time series.
  - **LoadFactor**: Global scale factor $ c_\text{factor} $ applied to all **Values**.  
    - Type: Number  
    - Default: `1.0`  
    - Effect: The effective load factor is $ \lambda(t) = c_\text{factor} \cdot \lambda_\text{path}(t) $.

- **Outputs**
  - **TimeSeries**: Alpaca4d `PathTimeSeries` object, to be used wherever a time series is required.
  - **Graph**: A list of values describing the time–history, useful for plotting or checking the input signal in Grasshopper.

## 📈 When to use a path time series

- **Use it when**
  - You need to apply **recorded time histories** (e.g. earthquake acceleration, measured force or displacement).
  - The load pattern is **non‑standard** and cannot be described by simple analytical functions.
  - You want full control over the **shape of the excitation** in time.

- **Do not use it when**
  - A **simple constant or linear ramp** is sufficient → use **Constant** or **Linear** time series.
  - The loading is **purely harmonic or periodic** → use a **Trigonometric** time series.

## 🔗 Relation to OpenSees

Alpaca4d’s path time series corresponds to the OpenSees `Path` timeSeries:

```tcl
timeSeries Path $tag -time {t1 t2 ... tn} -values {v1 v2 ... vn} -factor $cFactor
```

```python
timeSeries('Path', tag,
           '-time',  [t1, t2, ..., tn],
           '-values',[v1, v2, ..., vn],
           '-factor', cFactor)
```

where:

- the **Times** input maps to the `-time` list,
- the **Values** input maps to the `-values` list,
- the **LoadFactor** input corresponds to `cFactor`.
