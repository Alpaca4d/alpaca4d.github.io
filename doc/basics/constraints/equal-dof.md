# Equal DOF

An **Equal DOF** constraint ties selected degrees of freedom of one node to another node so that they always share the same displacement and rotation values.  
This is useful to model connections that behave as if they were rigid in one or more directions, without merging the nodes into a single point.

In Alpaca4d this behaviour is provided by the `EqualDOF` constraint class and its corresponding Grasshopper component, which creates an `Alpaca4d.Constraints.EqualDOF` object.

## Concept

Given a **master node** and a **slave node**, the Equal DOF constraint enforces:

- \( u_\text{master} = u_\text{slave} \) for selected translational DOFs (X, Y, Z), and/or  
- \( \theta_\text{master} = \theta_\text{slave} \) for selected rotational DOFs (XX, YY, ZZ).

This allows you to:

- Couple two nodes on different elements so they move together in one direction but remain independent in others.  
- Represent rigid links, stiff connections or symmetry conditions with a light constraint instead of extra elements.

## Typical inputs

Although the exact Grasshopper interface may vary, the Equal DOF constraint conceptually requires:

- **Master point**: Reference node that drives the motion.  
- **Slave point**: Node that follows the master in the selected DOFs.  
- **DOF flags**: Boolean options for each degree of freedom  
  - `Dof_x`, `Dof_y`, `Dof_z`: translational DOFs.  
  - `Dof_xx`, `Dof_yy`, `Dof_zz`: rotational DOFs.

## Usage notes

- Use Equal DOF when you need **pairwise coupling** between nodes, e.g. to join beams with offsets or to enforce identical displacements at two locations.  
- For floor‑type constraints involving many nodes, a **rigid diaphragm** is usually more convenient than many individual Equal DOF constraints.  
- Be careful not to over‑constrain the system (e.g. closing rigid loops with conflicting constraints), which can lead to singular matrices.