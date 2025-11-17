# Linear

A **Linear Time Series** defines a time–history where the load factor $\lambda$ varies **linearly with time**:

$$
\lambda(t) = c_\text{factor} \, t
$$

where $c_\text{factor}$ is a constant slope. This is useful when you want loads to **ramp up (or down, if negative)** at a constant rate as the analysis time increases.

## 🔧 Grasshopper component

The `Linear Time Series (Alpaca4d)` component creates an Alpaca4d linear time series that can be connected to load pattern or excitation components.

- **Input**
  - **LinearFactor**: Linear scale factor $ c_\text{factor}$ that multiplies time $ t $.  
    - Type: Number  
    - Default: `1.0`  
    - Effect: The load factor increases (or decreases) proportionally to time: doubling the analysis time doubles the load factor.

- **Outputs**
  - **TimeSeries**: Alpaca4d `Linear` time series object, to be plugged into components that require a time series.
  - **Graph**: A list of values representing the time series, typically visualised as a straight line increasing with time.

## 📈 When to use a linear time series

- **Use it when**
  - You want a **ramp load** that grows from zero to a target value over a given duration.
  - You need to **gradually apply loads** to avoid sudden jumps (e.g. quasi‑static ramping in nonlinear analysis).
  - You are modelling a **linearly increasing excitation intensity**.

- **Do not use it when**
  - The load should be **constant in time** → use a **Constant** time series.
  - The load follows a **recorded or arbitrary signal** → use a **Path / Time History** time series.
  - The load is **cyclic or periodic** → use a **Trigonometric** time series.

## 🔗 Relation to OpenSees

Alpaca4d’s linear time series is conceptually equivalent to the OpenSees `Linear` timeSeries:

```tcl
timeSeries Linear $tag -factor $cFactor
```

```python
timeSeries('Linear', tag, '-factor', cFactor)
```

where `cFactor` corresponds to the **LinearFactor** input in the Alpaca4d Grasshopper component.
