# Procedure

1. **Pilot Data Analysis (n = 66)**
   De-identified adolescent dataset was analyzed using a composite diet quality score and standardized cognitive test scores.

1. **Statistical Analysis**
   Pearson correlation was computed between diet score and each cognitive measure (overall, Stroop, memory, language, logical reasoning). Linear regression trend lines were plotted for visualization.

1. **Deterministic Modeling Framework**
   Diet (D) → Microbiome Proxies (X) → Metabolite Proxies (M) → Cognition Proxies (Y).
   Deterministic (runs without internet during judging for reliability).

   *Note: The simulator in this version uses replaceable demo parameter artifacts (not trained inside the app) to demonstrate the workflow; future versions can swap in trained artifacts built offline from paired datasets.*

1. **Reproducibility Mechanism**
   Simulator outputs are deterministic (same inputs → same outputs). Each run generates a SHA-256 run hash for auditability.

1. **Interpretation Guardrails**
   Pilot results are association-only; simulation outputs are presented as hypothesis generation, not causal or diagnostic claims.
