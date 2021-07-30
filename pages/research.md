---
layout: defaultsam
permalink: /research
title: Research
---

{{ page.title }}
================

## Thesis ##

My thesis research is on interpreting representations learned by machine learning algorithms.
The basic notion of interpretability we use is with respect to a interpretable dictionary.
This is motivated by a broad range of scientific questions.

<figure>
<img alt="" src="assets/img/bcellmodule.png" style="width:50%">
<figcaption>  Inspecting peripheral blood mononuclear cell embedding for B cell markers (K JSM 2017)</figcaption>
</figure>

<figure>
<img alt="" src="assets/img/motivatingfigure2.png" style="width:50%">
<figcaption>  Inspecting ethanol cell embedding for torsions (KZMC Neurips ML4PS 2019) </figcaption>
</figure>


In the above figures, a learned representation is colored by various functions of the data.
Typically, a human expert will scan through suitable functions and decide on those that best parameterize the data manifold.
A good parameterization will consist of a set of functions that are orthogonal and evenly varying.

<figure>
<img alt="" src="assets/img/sw.png" style="width:50%">
<figcaption> Isometric coordinates in the original feature space. </figcaption>
</figure>

My research provides mathematical formalization and computational tools for selecting good parameterizations.

<figure>
<img alt="" src="assets/img/srresults.png" style="width:50%">
<figcaption> Manifold Flasso associates latent space coordinates with interpretable functions of features (KZMC 2021). </figcaption>
</figure>

<figure>
<img alt="" src="assets/img/ethresults.png" style="width:50%">
<figcaption> Manifold Flasso can identify good parameterizing torsions out of hundreds of candidate bonds in Ethanol (KZMC 2021). </figcaption>
</figure>

The summary of this set of ideas is a network of projects based on the fiber bundles, non-linear dimension reduction, isometric parameterizations, automatic differentiation, gradient estimation, and convex optimization (in particular group Lasso).

<figure>
<img alt="" src="assets/img/summary.png" style="width:50%">
<figcaption> Map of projects in overall interpretable parameterization problem. G are 'interpretable' functions of features.</figcaption>
</figure>

## Computational Biology ##

I have worked in several areas of computational biology.
Currently, I work with Stefan Mihalas at the Allen Institute for Brain Science on modelling the cell-type specific murine connectome.
From a statistical standpoint, this work has a novel method for kernel-smoothing combined with shape-constrained inference, and some useful decompositions made using matrix factorization.

<figure>
<img alt="" src="assets/img/ctcon.png" style="width:50%">
<figcaption> Cell-type specific connectivities inferred using our model.</figcaption>
</figure>

<figure>
<img alt="" src="assets/img/nmfstab.png" style="width:50%">
<figcaption> Stabilized matrix factorization of overall connectome.</figcaption>
</figure>

At the beginning of grad school, I worked on single-cell genomics with Raphael Gottardo, and was an intern at Amazon with Kari Torkkola.

<figure>
<img alt="" src="assets/img/merkel.png" style="width:50%">
<figcaption> Merkel-cell carcinoma immune response (Paulson... K ... 2019) </figcaption>
</figure>

I've worked on stem-cell fate tracking experiments in hematopoietic cellular engineering with Cindy Dunbar.  

<figure>
<img alt="" src="assets/img/koelleblood.png" style="width:50%">
<figcaption> Stem cell fate tracking in rhesus macaques. K et al 2017 </figcaption>
</figure>

This work shed light on adaptive properties of NK-cell immune response (Wu... K... 2014), T-cell differentiation (Wu... K... 2017), and hematopoietic dynamics (Xu, K... 2019).

<figure>
<img alt="" src="assets/img/stochastic.png" style="width:50%">
<figcaption> Statistical inference of parameters of stochastic equation model for fate tracking experiments (Xu, K... 2019) </figcaption>
</figure>

## Prospectus ##

Deep learning is an attractive area to synthesize with this research program.
Saliency map and neural tangent kernel approaches utilize geometric information in the form of gradients in a manner similar to the above.
I am currently exploring the role of interpretable represenations in conditional inference and reinforcement learning. 

<figure>
<img alt="" src="assets/img/tslacfig.png" style="width:50%">
<figcaption> Reinforcement learning using tangent spaces and collective variables (BKM ICML 2021 Unsupervised Learning and Reinforcement Learning workshop) </figcaption>
</figure>

