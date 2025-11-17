# Constant

A **Constant Time Series** defines a time–history where the load factor $$\lambda$$ is **independent of time**:

$$
\lambda(t) = c_\text{factor}
$$

This is the simplest time series in Alpaca4d and is typically used when a load (or a group of loads) is applied with a **constant intensity** for the whole duration of the analysis.

## 🔧 Grasshopper component

The `Constant Time Series (Alpaca4d)` component creates an internal Alpaca4d time series that can be connected to load pattern or excitation components.

- **Input**
  - **LoadFactor**: Constant scale factor $ c_\text{factor} $ applied to the reference loads in the associated load pattern.  
    - Type: Number  
    - Default: `1.0`  
    - Effect: All loads in the pattern are multiplied by this value at every analysis time step.

- **Outputs**
  - **TimeSeries**: Alpaca4d `Constant` time series object, to be plugged into components that require a time series (e.g. load patterns, uniform excitation).
  - **Graph**: A curve/polyline representing the time series, useful for quick visual inspection in Grasshopper (flat line at $ \lambda = c_\text{factor} $).

## 📈 When to use a constant time series

- **Use it when**
  - Loads are **turned on and stay on** for the entire analysis (e.g. dead loads, permanent equipment loads).
  - You want a **constant base excitation scale factor** during a time‐history analysis.
  - You are testing or debugging a model and want to keep the loading simple and time‑independent.

- **Do not use it when**
  - The load needs to **ramp up or down** with time → use a **Linear** time series.
  - The load needs to **follow a recorded signal** or arbitrary function → use a **Path / Time History** time series.
  - The load is **periodic** → use a **Trigonometric** time series.

## 🔗 Relation to OpenSees

Alpaca4d’s constant time series is conceptually equivalent to the OpenSees `Constant` timeSeries:

```tcl
timeSeries Constant $tag -factor $cFactor
```

```python
timeSeries('Constant', tag, '-factor', factor=1.0)
```

where `cFactor` corresponds to the **LoadFactor** input in the Alpaca4d Grasshopper component.
