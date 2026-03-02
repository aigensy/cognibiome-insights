# Abstract (≈180 words)

Diet quality is frequently associated with cognitive performance, but testing a full mechanism in humans is difficult because it would require measuring diet, microbiome composition, metabolites, and cognition in the same individuals. This project addresses that gap with a transparent, judge-ready approach: **(1) analyze a de-identified teen pilot dataset (n=66) for correlation signals**, and **(2) implement an offline-first, deterministic simulator that makes the proposed biological pathway explicit**.

In the pilot dataset (diet score + four cognitive tests), higher diet scores show moderate positive correlations with **overall score** and with **language** and **logical reasoning**. To explore a plausible mechanism (without overclaiming), CogniBiome implements a three-stage pipeline: **Diet inputs (D)** → **Modeled microbiome proxies (X)** → **Modeled metabolite proxies (M)** → **Modeled cognition outputs (Y)**. In the current build, the simulator uses **frozen, replaceable parameter artifacts** (no training occurs inside the app) and generates a **run hash** so outputs are reproducible.

This work is presented as an **educational hypothesis generator**. It does not diagnose, does not provide medical advice, and does not claim causality.

---

# Research Question (1 sentence)

How can diet-associated cognition signals be explored using an explicit, reproducible diet→microbiome→metabolite→cognition pathway model while clearly separating real measurements from modeled proxy layers?

---

# Hypothesis (2–3 sentences)

Teens with higher diet quality scores will show higher cognitive performance, especially in domains sensitive to attention and reasoning. A biologically plausible explanation is that higher-fiber/omega-3 dietary patterns can shift gut microbial metabolism toward short-chain fatty acid (SCFA) production and toward neuroactive precursor pathways, which may influence inflammation and signaling relevant to cognition. This project tests correlation in the pilot dataset and uses a deterministic simulator to represent the proposed mechanism transparently (not to claim causality).

---

# Background Research

- The **gut–brain axis** links gut and brain through immune, endocrine, neural (including vagal), and metabolic signaling.
- Gut microbes can produce **SCFAs** (acetate, propionate, butyrate) from dietary fiber, which are plausible mediators via inflammation and barrier-related signaling.
- Microbial metabolism can also influence pathways connected to neurotransmitter-related chemistry (e.g., tryptophan-related routes and GABA in specific strains).
- Critical constraint: most datasets do not measure all layers together in the same people; therefore, this build separates **measured pilot correlations** from **modeled proxy layers**.
