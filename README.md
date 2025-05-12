
# DataCurator Core

This repository contains the core code for DataCurator.  It enables using the
DataCurator database via the Supabase API to access the data like world components
contained in knowledge views, transform those data for use in simulations
run in the [SimulationJS engine](https://github.com/scottfr/simulation), and to
derive values from the data like rendering titles and descriptions containing
links to other components and views, and the values of state components at
different time points.

## Data Access and Integration:

* Code for accessing data from Supabase.
* Parsing and transforming the raw DB data into structured TypeScript interfaces / classes.

## Modeling and Representation:

* Defining TypeScript classes and interfaces to represent the data (e.g., WComponent, StateValueAndPredictionsSet).

## Derived State and Computation:

* Functions for handling relationships between data entities and computing
derived data (e.g. get_title and get_composed_wcomponents_by_id).

## Utilities:

* Helper functions for sorting, filtering, and partitioning data.
* Utilities for working with dates, states, and other common operations.


# History

These code files were copied in full or in part from: https://github.com/AJamesPhillips/DataCurator/blob/main/app/frontend and have now been moved into this shared repo.
