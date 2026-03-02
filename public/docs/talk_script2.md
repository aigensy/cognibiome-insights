## Yana’s Judge Presentation Script (CogniBiome Insights)

Good morning. My name is Yana Evteeva, and my project is titled **Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance**.

This research asks a simple question that is surprisingly hard to answer:

**How can what we eat influence how we think, through the biology of the gut–brain axis?**

### 1) Background: what is the gut–brain axis?

The **gut–brain axis** is a two-way communication system between the gastrointestinal tract and the brain. It includes:

* **Neural signals** (especially the vagus nerve)
* **Immune signals** (inflammation and immune activation)
* **Chemical and metabolic signals** (small molecules made by our body and by gut microbes)

Over the past decade, research has shown that gut microbes do more than digest food. They can influence:

* **short-chain fatty acids**, or **SCFAs** (like acetate, propionate, butyrate), often produced when microbes ferment dietary fiber
* **inflammation**, which affects overall brain and body function
* neurotransmitter-related pathways, including **serotonin**, **dopamine**, and **GABA** signaling

And cognitive functions like **attention, memory, executive control, and reasoning** are sensitive to inflammation and neurochemical balance.

So biologically, there is a coherent chain:

**Diet shapes the microbiome → the microbiome shapes metabolites → metabolites influence brain-related pathways → cognition can be affected.**

### 2) The research gap

Many studies show that healthier diets are associated with improved cognition, but most of them are still **correlational**.

Measuring **diet, microbiome, metabolites, and cognition** in the same people is expensive and difficult, especially in adolescents. That makes it hard to move from “association” to “mechanism.”

### 3) My research question and hypothesis

My research question is:

**How do diet-induced changes in gut microbiome patterns and neurotransmitter-related metabolite pathways relate to cognitive performance outcomes?**

My hypothesis was that a diet pattern with:

* **higher fiber** and **healthier fats**, and
* **lower added sugar**

would be associated with microbiome patterns linked to **higher SCFA production** and more favorable neurochemical-related signaling, and that those trends would align with improved performance in attention and memory tasks.

### 4) The real human anchor dataset (what was measured)

This project builds on my prior 2025 study involving **66 high school students**.

In that pilot dataset, I measured:

* a **diet quality score** (from a survey), and
* **four cognitive tasks**: Stroop (attention/executive control), memory recall, language/vocabulary, and logical reasoning.

In that pilot, I found a **moderate positive correlation** between diet score and overall cognitive score. I want to be very clear:

* This is **not proof of causation**.
* It is a real pattern in a real sample that motivates deeper mechanistic modeling.

The major limitation of that pilot is that it did not measure biological intermediates like microbiome composition or metabolites. It showed **correlation**, but not a mechanistic pathway.

### 5) What I built: CogniBiome Insights (the mechanistic simulator)

To address that limitation, I built **CogniBiome Insights**, an interactive **deterministic simulator** that models the pathway in transparent stages. It runs fully offline — a reliability requirement for science-fair judging — but the architecture is designed to accept trained model artifacts in a future phase.

I describe it as a pipeline:

**D → X → M → Y**

* **D** = Diet inputs (fiber, added sugar, saturated fat, omega-3 proxy)
* **X** = Microbiome proxy layer (simplified microbial balance indicators)
* **M** = Metabolite proxy layer (SCFAs + serotonin-precursor proxy)
* **Y** = Cognitive proxy outputs (attention, memory, and a composite score)

**Two key integrity rules are built into the app:**

1. The pilot results are clearly labeled as **REAL DATA**.
2. The microbiome and metabolite layers are clearly labeled as **MODELED PROXIES**, because they are not measured in the teen pilot.

This is important because many microbiome references are knowledge maps like “this microbe can produce this metabolite,” but they are not paired measurements in the same people. So I treat them as **reference evidence**, not as proof.

### 6) Why deterministic matters, and what offline-first means here

My simulator is **deterministic**, meaning:

**The same inputs produce the same outputs every time.**

Each run generates a **run hash**, like a digital fingerprint, so results are reproducible and auditable.

The app also works fully without internet during judging — **offline-first is a presentation reliability constraint**, not a research objective. It includes small offline reference snapshots to support explanations without relying on live websites. The same architecture is designed to accept trained model artifacts in a future backend phase.

### 7) What the judge sees in the demo (walkthrough)

Here is the short demo flow:

* On the **Dashboard**, I explain what is measured vs modeled and the purpose of the tool.
* On **Pilot Results**, I show the real correlation results from the n=66 dataset.
* On the **Simulator**, I adjust diet inputs, and the app shows modeled/simulated directional proxy shifts in microbiome proxies, metabolite proxies, and a cognitive proxy score.
* On **Compare**, I can compare two diet scenarios side-by-side.
* On **Export**, I generate a reproducible report with the run hash and settings.
* In **Methods & Rigor**, I explain limitations, confounders, and why this is a hypothesis generator rather than a clinical predictor.

### 8) Results and interpretation (judge-safe)

The simulator shows consistent, biologically plausible trends:

* Increasing fiber tends to increase the proxy SCFA signal.
* Reducing added sugar tends to shift the proxy profile toward a less inflammatory pattern.
* These proxy changes align with improved cognitive proxy outputs, in the direction consistent with the pilot association.

Again, the correct interpretation is:

* **The pilot provides real correlational evidence**, and
* **the simulator provides a mechanistic, explainable hypothesis framework** that helps visualize the pathway and test “what-if” scenarios.

### 9) Limitations and future work

There are limitations:

* This is **illustrative and explanatory (proxy-based)**, not causal proof.
* Microbiome composition is highly individualized.
* Confounders like sleep, stress, and socioeconomic factors can influence cognition.

Future work includes:

* adding real microbiome and metabolomics measurements for validation,
* expanding training on paired public datasets where allowed,
* and testing the model with intervention-style scenarios and stronger validation.

### 10) Closing

In summary, this project advances the conversation from “diet and cognition are correlated” to an explicit, transparent **mechanistic simulation pathway**.

It is a reproducible educational model that helps students and judges understand **how diet could influence cognition through the gut–brain axis**, while clearly separating what is measured from what is modeled.

Thank you.

---

## Optional 20-second fallback (if a judge interrupts)

“My pilot dataset of 66 teens shows a positive association between diet score and cognitive performance. The limitation is we didn’t measure biology in the middle. So I built an offline deterministic simulator that models Diet → Microbiome proxies → Metabolite proxies → Cognitive proxies, with clear ‘measured vs modeled’ labeling and reproducible run hashes, to explore mechanistic hypotheses safely.”

---

## Judge Q&A cheat sheet (short answers)

**Q: Did you measure microbiome or metabolites in the teens?**
A: No. Only diet score and cognitive tests were measured. Microbiome and metabolite layers are modeled proxies to explore mechanism.

**Q: Does this prove diet causes cognition?**
A: No. The pilot is correlational. The simulator is a hypothesis generator and teaching tool.

**Q: Why should we trust the simulator?**
A: It is deterministic, transparent about assumptions, labels proxies clearly, and is consistent with known biology trends and the pilot direction.

**Q: What’s the main novelty?**
A: A judge-ready, offline, reproducible simulator that connects diet to cognition through mechanistic proxy layers, with run hashes and exportable reports.
