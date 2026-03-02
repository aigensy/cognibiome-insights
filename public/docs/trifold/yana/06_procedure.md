# Procedure

1. **Pilot Data Analysis (n = 66)**
   De-identified adolescent dataset was analyzed using a composite diet quality score and standardized cognitive test scores.

1. **Statistical Analysis**
   Pearson correlation was computed between diet score and each cognitive measure (overall, Stroop, memory, language, logical reasoning). Linear regression trend lines were plotted for visualization.

1. **Deterministic Modeling Framework**
   A deterministic simulator was implemented to represent a plausible biological sequence: Diet (D) → Microbiome Proxies (X) → Metabolite Proxies (M) → Cognition Proxies (Y). Modeled intermediate layers are labeled as proxies.

1. **Reproducibility Mechanism**
   Simulator outputs are deterministic (same inputs → same outputs). Each run generates a SHA-256 run hash for auditability.

1. **Interpretation Guardrails**
   Correlation results are observational; simulator outputs are presented as plausible mechanism-linked hypotheses, not causal or diagnostic claims.
