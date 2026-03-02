# Abstract

Diet quality is frequently associated with cognitive performance, yet directly testing a full biological mechanism in humans would require simultaneous measurement of diet, gut microbiome composition, metabolite production, and cognition — an approach that is experimentally complex.

This project addresses that limitation using a two-part, transparent framework designed as student research and an educational simulator. First, a de-identified pilot dataset of 66 adolescents was analyzed, including a composite diet quality score and four standardized cognitive assessments (Stroop, memory recall, language, and logical reasoning). Correlation analysis demonstrated a moderate positive association (Pearson r = 0.367) between diet score and overall cognitive performance, with similar positive correlations observed for language and logical reasoning.

Second, a deterministic simulation framework was implemented to represent a plausible biological sequence: Diet (D) → Microbiome Proxies (X) → Metabolite Proxies (M) → Cognition Proxies (Y). The simulator uses predefined, replaceable parameter artifacts and generates a SHA-256 run hash to ensure output reproducibility and auditability. Intermediate biological layers are explicitly labeled as modeled proxies rather than measured biomarkers.

Overall, the primary contribution is a reproducible modeling workflow and teaching tool that demonstrates how this class of multi-layer problems can be approached correctly, distinguishing observed correlations from modeled biological mechanisms and avoiding unsupported causal claims.
