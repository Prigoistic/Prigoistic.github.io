# How to Walk Someone Through the MAPA Proposal

A complete narrative guide for explaining MAPA in an interview or panel.

Author: Priyam Ghosh
Published: July 2026
Canonical: https://prigoistic.me/mapa/interview/
Keywords: MAPA, world models, memory hierarchy, research proposal

A complete narrative guide for explaining MAPA in an interview or panel

This page is a single thing: the story you tell when someone says "walk me through your proposal." It is not a summary. It is a map of the conversation you need to lead — from a kitchen in the dark, through what rats taught us about memory, to five structural absences in the best world model family that exists, to the minimal architecture that closes the gap. Every section has the words to say, the questions it generates, and where people typically lose the room.

Read it once end to end. Then read it again speaking out loud.

---

## Start here: the claim

This is the first thing you say. Not the architecture. Not the acronym. The claim. Everything that follows is the argument for why this claim is true.

Open with this. Exactly this.

 "The core claim is that long-horizon failure in JEPA world models is not a representation problem. It is the predictor being *architecturally stateless* across episode boundaries. And a two-timescale memory layer is the minimal sufficient fix."

Three sentences. After you say them, stop. Let the silence do work. They will either nod and wait for you to continue, or they'll pull on one of the three claims. Either way you're in control. Now you earn the claim with the story.

---

## Part 1 — The kitchen in the dark

Before JEPA. Before LoRA. Before any architecture. You need to make the problem felt with something concrete and familiar. This is the only part of the talk where you are not speaking about AI at all.

What to say

"Walk into your kitchen at 2 AM with the lights off. Your hand finds the light switch before your eyes find anything. You already know where the counter ends, that the floor is level, that the fridge is humming three feet to your right. None of that is sensation — your eyes haven't adjusted yet. All of that is **prediction**. Your brain has a model of that kitchen, built from every previous visit, and it is rendering that model ahead of what your senses are actually delivering."

"That is predictive processing. The brain's job is not to receive the world — it is to predict the world and then correct only the parts the prediction got wrong. The gap between what you expected and what actually arrived is the only signal your brain truly learns from."

"Here is the part that matters for us. That prediction only works because of memory. Strip away memory and every moment arrives completely fresh — no sense of what this kitchen usually looks like, no expectation that the chair is still in the same place. The prediction becomes useless. A system without memory isn't perceiving the world. It's transcribing it, frame by frame, with no understanding of what came before."

At this point you have the concept of prediction requiring memory. Now bring in the biology — because the biological solution to this problem is exactly what MAPA is modelled on.

Continue

"Brains solve this with not one memory system but two, running at completely different speeds. The **hippocampus** writes fast — a new experience is encoded in seconds, vivid and specific. The **neocortex** writes slow — over hours and nights of sleep it distills which parts of experience repeat, and those become stable, compressed knowledge. What remains in the neocortex after consolidation is not memory of Tuesday's kitchen. It is *kitchen-ness itself*."

"The trick that makes the whole system work is the gate between them. Fast memory fills constantly. Slow memory updates only when the evidence has stacked up into something stable and genuinely new. Without that gate, one strange afternoon overwrites years of knowledge. That gate, the judgment of what earns a permanent place, is the hinge the whole biological system turns on."

### The rats

Now bring in the experiment. This is where the biology becomes something concrete and falsifiable — not just an analogy, but a demonstrated mechanism.

What to say

"John O'Keefe showed this in 1971 with rats navigating a maze. He found that individual neurons in the hippocampus fire only when the rat is in a specific location — they're called place cells. The hippocampus is literally building a **spatial map** of the environment, one neuron per location. Not a recording of what the rat saw. A compressed, geometric representation of where the rat is and where it has been."

"The more important finding came later. When rats sleep after navigating a new environment, the same sequences of place cells that fired during navigation replay — in compressed, fast bursts called sharp-wave ripples. The hippocampus is broadcasting its recent experience to the neocortex, which integrates it into long-term spatial knowledge. When the rat returns to the same room the next day, it predicts better. Immediately. Not because it relearned — because it consolidated."

"Now ask: what would a rat look like if it had no hippocampus? It would navigate perfectly in a maze it knows well — as long as it stays in a single session. The moment you end the session and start a new one, it has no memory of the maze. Every visit is a first visit. That is exactly what a JEPA world model looks like today."

Questions this generates — and why you've already set them up

- **"So you're implementing a hippocampus?"** — Yes, functionally. The episodic buffer is the hippocampus. The landmarks are the neocortical consolidation output. The gate is the gating mechanism between them. The analogy is exact and intentional.
- **"Isn't this just adding memory to the model?"** — It's adding the right kind of memory at the right level. The distinction matters — come back to it when you reach the mechanism.

---

## Part 2 — What is missing in JEPA: five structural absences

Now you move from neuroscience to the architecture. The transition sentence is critical — it connects the biology to the engineering failure without feeling like a pivot.

Transition

"JEPA — Joint Embedding Predictive Architecture — is the most promising world model family we have. It predicts in latent space rather than pixel space, which means it doesn't waste capacity trying to reconstruct every pixel of a video frame. It learns what matters: the structure of the world. The encoder is good. The latent representations are meaningful. But the predictor — the component that actually models what comes next — has no version of that hippocampal-neocortical system. It is stateless. And that statelessness produces five distinct failure modes, each with a different structural cause."

FM — 01

### Autoregressive predictive compounding

The predictor takes a latent state \(z_t\) and produces \(\hat{z}_{t+1}\). In the next step it consumes its own output and produces \(\hat{z}_{t+2}\). Each step introduces a small error. The question is how that error grows.

What a Lipschitz constant actually is

A Lipschitz constant \(L\) is a single number that bounds how much a function can amplify a perturbation. Formally: \(\|f(x) - f(y)\| \leq L \cdot \|x - y\|\). In words — if you nudge the input by some amount, the output cannot move by more than \(L\) times that amount. It's the function's worst-case sensitivity to input error.

**L < 1:** the function shrinks differences (a contraction).
 **L = 1:** the function preserves differences exactly.
 **L > 1:** the function amplifies differences.

Every trained neural network has some Lipschitz constant — bounded by the product of the spectral norms of its weight matrices across layers. For a realistic trained predictor, this constant is slightly above 1. Write it as \(L = (1+\lambda)\), where \(\lambda\) is small and positive.

If the predictor has Lipschitz constant \((1+\lambda)\), meaning every unit of input error becomes at most \((1+\lambda)\) units of output error, then after \(N\) autoregressive steps the accumulated error is bounded by \((1+\lambda)^N\). Not linear. Exponential. A Lipschitz constant of 1.01 — a 1% amplification per step — produces a 2.7× error after 100 steps. After 1000 steps, it is 21,000× the original error.

Memory helps because it provides an anchor. If at each step the predictor is conditioned on a landmark that represents what this scene actually looks like, the effective \(\lambda\) — the local amplification — is smaller. The predictor is constrained toward the correct regime by what it already knows about this place.

If asked: "why (1+λ)^N?"

Each step multiplies error by (1+λ). After N steps: (1+λ) × (1+λ) × ... = (1+λ)^N. It's compound interest on prediction error. The Lipschitz constant is the worst-case per-step amplification factor — it bounds how sensitive the function is to perturbations in its input.

FM — 02

### No write mechanism

The predictor observes every scene it passes through. But it has no mechanism to write anything from those observations back into itself. It can read from weights. It cannot update weights from experience at inference time.

This is not a training failure. The model trains fine. The problem is that the predictor was designed to be frozen after training — a static function approximator. It can generalize across scenes it was trained on, but it cannot adapt to a specific scene it is currently experiencing and will experience again.

A robot that re-enters a warehouse it has visited a hundred times should have a predictor that reflects those hundred visits. Instead, the predictor is identical to what it was during pretraining. Every visit is treated the same as the first.

Fumble zone

"Can't you just fine-tune it?" — Full fine-tuning causes catastrophic forgetting. This is exactly why the LoRA solution is necessary. Have this answer ready: the write mechanism must be bounded and selective, not unrestricted. Full fine-tuning is an unbounded write mechanism and it destroys prior knowledge.

FM — 03

### Noise versus genuine change ambiguity

The predictor produces a prediction error \(\varepsilon_t = \|\hat{z}_t - z_t\|^2\) at every step. When this error is large, two completely different things could have caused it: a genuine scene change (a door opened, a light switched on, the robot entered a new room), or noise (sensor jitter, lighting variation, a random artifact in the encoding).

From error magnitude alone, these are indistinguishable. They produce the same number. A system that fires an update whenever \(\varepsilon_t\) is large will fire on noise events as often as on genuine changes. That corrupts whatever memory it writes.

The correct signal is not the magnitude of the error but the **geometry** of the errors. When a genuine scene is revisited repeatedly, the encoder produces similar latent vectors — the scene is real and consistent. Those vectors cluster tightly. Noise vectors are stochastic — they don't cluster. Same error magnitude, different geometry.

Lock this in — the core insight the whole gate depends on

- Genuine scene change: high εt, **tight cluster** in latent space.
- Noise event: high εt, **dispersed cluster** in latent space.
- Error magnitude cannot tell them apart. Cluster geometry can.

FM — 04

### Dynamic drift blindness

The environment is rarely static. Furniture moves. Lighting shifts over hours. Objects are placed and removed. Each individual change may be small enough to produce a prediction error below any reasonable threshold. The predictor never fires a memory update because no single change was large enough to trigger one.

But the cumulative drift over weeks or months is significant. The predictor's model of the environment becomes stale — it reflects what the environment looked like at training time, not what it looks like now. And because no single change triggered an update, the predictor has no record that the environment changed at all.

The adaptive threshold partially addresses this: \(\tau(t) = \mu_W + \alpha\sigma_W\) adapts to the current noise baseline of the environment. If the environment has been gradually drifting, the baseline shifts with it, and the threshold shifts accordingly. But the deeper fix is landmark staleness detection — if the landmark for a scene consistently produces worse-than-expected predictions, that landmark needs to be updated or replaced.

FM — 05

### Return visit degradation

This is the failure that most directly proves the problem. A robot visits a room today. It visits the same room tomorrow. The prediction error on the second visit is identical to the prediction error on the first visit.

This should not be. The second visit should benefit from everything the predictor observed during the first. The room's layout, its typical lighting, what objects tend to be where — all of this is information the predictor had access to and retained exactly none of. The predictor cannot improve with experience because it has no mechanism to retain experience across episode boundaries.

This is the clearest measurable symptom of the statelessness problem, and it is what the Return Visit Prediction Recovery metric directly captures: the delta between how well the predictor performs on a return visit versus a first visit.

If they ask: "isn't this just a training distribution problem?"

- No. The encoder is fine — it produces meaningful latents for this room. The predictor can model the room within a session. The failure is specifically cross-episodic: when the session ends, everything resets. That is an architectural property of the predictor, not a training data gap.

---

## Part 3 — How we fix it: deriving the mechanism

Don't describe MAPA as a list of components. Derive it. Start from what you need, then show that each component is the necessary answer to a specific constraint. Make the architecture feel inevitable, not designed.

Transition

"So what would the minimal sufficient mechanism look like? We need something that can write scene knowledge into the predictor, distinguish genuine changes from noise, avoid forgetting what was already there, and make that knowledge available at every inference step. Those four requirements, taken in sequence, determine the architecture."

#### Step 1 — Filter by surprise, not by magnitude

First requirement: we need to know when something notable happened. We can't use raw prediction error because noise and genuine change are indistinguishable at the magnitude level. So we use an adaptive threshold:

Adaptive threshold — normalizes to the environment's own noise baseline

 \[\tau(t) = \mu_W + \alpha \cdot \sigma_W\]

where \(W = 100\) is the rolling window, \(\alpha = 2.0\) is the sigma multiplier. Under Gaussian noise, 97.7% of errors fall below this line — the top 2.3% are candidates for memory.

Anything that crosses \(\tau(t)\) is written to the episodic buffer as a 5-tuple: \((z_t, a_t, z_{t+1}, \varepsilon_t, \text{episode\_id})\). The buffer holds up to 2048 entries and evicts the oldest when full.

#### Step 2 — Distinguish real change from noise via geometry

Crossing the threshold is necessary but not sufficient. The buffer now contains a mixture of genuine scene changes and high-magnitude noise events. We need to separate them.

The key insight is tightness. When buffer entries for a scene cluster tightly in latent space, that scene is real and consistent — the encoder produces similar vectors every time. Noise vectors are stochastic; they don't cluster. So we run online clustering over the buffer and compute tightness for each cluster:

\[\text{tightness}(k) = \frac{1}{n_k}\sum_{i \in k}\|z_i - c_k\|^2\]

Mean squared distance of cluster members from the centroid. **Low tightness = tight cluster = real scene. High tightness = dispersed = noise.**

#### Step 3 — Gate the consolidation on three conditions

The consolidation gate fires when a cluster satisfies all three:

- **Support:** enough observations have been assigned to it — it's not a singleton.
- **Tightness:** the cluster is geometrically tight — it's a real scene, not noise.
- **Novelty:** the cluster is sufficiently far from existing landmarks — it's genuinely new information, not a duplicate of something already consolidated.

All three must hold. Support alone can be satisfied by persistent noise. Tightness alone can be satisfied by a consistent measurement artifact. Novelty alone can be satisfied by any distant cluster. The conjunction is what makes the gate selective.

Fumble zone — tightness direction

Low tightness = tight cluster = gate fires. High tightness = dispersed = gate suppresses. Practice saying this both ways before the interview. It is counterintuitive and you will say it backwards under pressure.

#### Step 4 — Update the predictor without forgetting — LoRA

When the gate fires, we need to write scene knowledge into the predictor. Full fine-tuning catastrophically forgets — the gradient signal for the new scene overwrites weight configurations for all previous scenes. So we freeze the base weights entirely and adapt only a low-rank delta:

\[\Delta\theta = BA \quad \text{where } A \in \mathbb{R}^{r \times d_{\text{in}}},\ B \in \mathbb{R}^{d_{\text{out}} \times r},\ r = 8\]

Base \(\theta\) never receives a gradient from scene data. Only \(\Delta\theta\) adapts. At rank 8 on a 192-dim model: \(2 \times 192 \times 8 = 3072\) parameters over 15M base weights — under 0.02% overhead.

#### Step 5 — Write a permanent landmark for retrieval at inference

The gate also writes a landmark: a permanent, EMA-averaged centroid vector in latent space.

\[c_k \leftarrow \beta \cdot c_k + (1-\beta) \cdot z_t \quad \beta = 0.95\]

Each new assignment contributes 5% weight. Effective memory window: ~20 timesteps. This produces a stable, noise-smoothed geometric summary of what the scene looks like.

At every inference step, we retrieve the nearest landmark by cosine similarity to the current \(z_t\). That landmark is concatenated with \(z_t\) and fed into the predictor:

\[\hat{z}_{t+1} = f_{\theta + \Delta\theta}(z_t,\ \hat{L}_k)\]

The landmark is not a replacement for the current state. It is context that biases the prediction toward the right regime for this scene. The predictor knows where it is.

The complete inference loop — seven steps in order

- **1.** Encode: \(z_t = \varphi(s_t)\)
- **2.** Retrieve: \(\hat{L}_k = \arg\min_k (1 - \cos(z_t, c_k))\)
- **3.** Predict: \(\hat{z}_{t+1} = f_{\theta + \Delta\theta}(z_t, \hat{L}_k)\)
- **4.** Compute error: \(\varepsilon_t = \|\hat{z}_t - z_t\|^2\)
- **5.** Threshold check: if \(\varepsilon_t > \tau(t)\), write to buffer
- **6.** Cluster: assign to nearest cluster, update EMA centroid
- **7.** Gate: if support ≥ Nmin ∧ tightness ≤ σ²max ∧ novelty ≥ δ → LoRA update + landmark write

---

## Part 4 — The experiment that makes the claim undeniable

The strongest objection to MAPA is: this is just LoRA fine-tuning with a clever buffer, and any adaptive learning rate schedule does the same thing. You need to foreclose this before it is raised. The matched-noise experiment is the tool.

What to say

"The central alternative explanation a skeptic will reach for is that this is sophisticated error-based fine-tuning with a hand-tuned threshold. The claim would be: the gate thresholds were adjusted until the system worked, not derived from first principles, and an adaptive learning rate baseline would perform identically if you tuned it as carefully."

"The matched-noise experiment is specifically designed to make that explanation impossible. We engineer noise events that produce *identical prediction error magnitude* to genuine scene transitions — calibrated, not approximately equal. Then we run both MAPA and an adaptive learning rate baseline on environments containing both genuine changes and these calibrated noise events."

"The adaptive-LR baseline cannot distinguish them. It fires on both. MAPA's consolidation gate operates on cluster geometry. Genuine changes produce tight clusters. Engineered noise produces dispersed clusters, because it's stochastic even when its magnitude is matched. The gate correctly suppresses the noise while firing on genuine changes."

"If the gate can do this — at identical error magnitudes — the geometric mechanism is doing something structurally different from error-based fine-tuning. That is a pass/fail test on the core claim. If the gate cannot separate signal from noise at identical error scales, the structural necessity of the gate is disproven. We don't get to adjust and rerun."

Questions this pre-empts

- **"What's your success criterion?"** — Binary. Gate fires on tight clusters, suppresses dispersed ones, at identical εt. The matched-noise experiment passes or fails. No threshold to debate.
- **"Are your α and Nmin hand-tuned?"** — α=2.0 is the 2-sigma rule, derived from Gaussian statistics. Under Gaussian noise, 97.7% of errors fall within μ ± 2σ. Nmin and σ²max are ablated in the component ablation study — if they're redundant, we say so.
- **"What about real-world sensor noise with partial observability?"** — MAPA is validated under controlled non-stationarity. Real-world generalization is an explicit open question and a stated future direction, not a current claim. The matched-noise experiment is the extent of the robustness claim.

---

## Part 5 — How we measure it

You made both of these mistakes in the interview simulation — read before anything else

**Mistake 1 — You called it BMT, not BWT.** There is no M. It is Backward Transfer. BWT. Two letters. You said BMT twice under pressure. In a panel this signals you memorized the concept but not the name. Lock in: **BWT = Backward Transfer. FWT = Forward Transfer.**

**Mistake 2 — You said FWT should be greater than one, not greater than zero.** FWT is a raw error difference — stateless error minus MAPA error. Both are squared distances, both positive. If MAPA's error is lower, the difference is positive, meaning greater than zero. It is not a ratio. It does not need to cross one to mean anything. Lock in: **FWT > 0 means positive transfer. The threshold is zero, not one.**

Five metrics. Each one exists because one of the five failure modes needs its own measuring stick. Two are definitionally grounded — the zero crossing is the definition, not a choice you make. Three are experimentally determined — you don't pre-promise a number, you report what the experiment produces and compare it against baselines.

### BWT — Backward Transfer: did we forget?

One-sentence definition — say this the moment they ask

**BWT measures whether learning new things makes you worse at old things.** If you visit five rooms in sequence and then go back to Room 1, are you predicting it worse than when you first learned it? That degradation is positive BWT — forgetting. No degradation is zero BWT. Actually getting better at Room 1 just by having visited rooms 2 through 5 is negative BWT — the best possible outcome.

Here is the scenario. You have five scenes — five rooms the robot visits in sequence. You visit Room 1, the predictor consolidates knowledge of it, it predicts well. Then you visit Room 2, then 3, then 4, then 5. Now you go back and test the predictor on Room 1.

The question BWT asks is: **are you still as good at Room 1 as you were right after you first learned it?** Or did learning Rooms 2 through 5 overwrite what you knew about Room 1?

How to explain it out loud

"BWT compares your prediction error on a scene right after you consolidated it, versus your prediction error on that same scene at the very end, after you've visited everything else. If the error went up — you got worse on the old scene — that's forgetting. BWT is positive. If the error stayed the same or went down, BWT is zero or negative. That's the target. Zero is the definitional boundary from the continual learning literature — it's not a bar we chose, it's the line between forgetting and not forgetting."

BWT formula — the forgetting score

 \[\text{BWT} = \frac{1}{S-1}\sum_{i=1}^{S-1}\bigl(\varepsilon_{S,i} - \varepsilon_{i,i}\bigr)\]

\(\varepsilon_{i,i}\) = error on scene \(i\) right after first learning it. \(\varepsilon_{S,i}\) = error on scene \(i\) after seeing all \(S\) scenes. The difference is how much you forgot. Averaged across all scenes except the last.

**BWT ≤ 0:** no forgetting. The LoRA adapter is working. **BWT > 0:** the adapter overwrote old knowledge. The gate's novelty criterion needs tightening.

Note that the stateless baseline has BWT ≈ 0 trivially — it never updates, so it never forgets. That sounds good until you realize it also never learns anything. BWT alone doesn't tell the full story. That's why you need FWT alongside it.

### FWT — Forward Transfer: does memory help?

One-sentence definition — say this the moment they ask

**FWT measures whether remembering older things makes you better at new things.** You've visited four rooms. Now you walk into Room 5 for the first time. Does having consolidated knowledge from those four rooms make you predict better in Room 5 than a system that has never seen any room? If yes — FWT is positive. Prior memory transferred forward and helped. If no — the memory is too scene-specific, it didn't generalize.

Same five-room scenario. You've visited Rooms 1 through 4. Now you're about to walk into Room 5 for the first time.

FWT asks: **does having already visited four rooms make you better at Room 5 than a system that has never seen any room before?** A stateless predictor walks into Room 5 with zero prior knowledge. MAPA walks in having consolidated knowledge from four rooms. If MAPA predicts better on that first visit to Room 5, the memory is generalizing. FWT is positive. If MAPA is no better than the stateless baseline on a scene it has never visited, FWT is zero or negative — the memory is too scene-specific to transfer.

How to explain it out loud

"FWT compares MAPA's error on a new scene against what a stateless baseline would have gotten on that same scene. The baseline has never seen any prior scenes — it's starting fresh. MAPA has already consolidated knowledge from the scenes it visited before. If MAPA does better, the prior knowledge transferred. That's the actual test of whether the memory is learning generalizable structure or just memorizing specific scenes. If you visited ten offices and the eleventh office immediately benefits from that — FWT is positive. If each office feels like a first visit despite all the prior offices — FWT is near zero, and the memory is too specific to be useful."

FWT formula — the transfer score

 \[\text{FWT} = \frac{1}{S-1}\sum_{i=2}^{S}\bigl(\varepsilon_{\text{stateless},i} - \varepsilon_{i-1,i}\bigr)\]

\(\varepsilon_{\text{stateless},i}\) = error a fresh stateless LeWM would have on scene \(i\). \(\varepsilon_{i-1,i}\) = MAPA's error on scene \(i\) after visiting scenes 1 through \(i-1\). Positive difference means MAPA was better. Averaged across all scenes except the first.

**FWT > 0:** memory transfers. Landmarks are encoding generalizable structure. **FWT ≤ 0:** memory is not transferring — too scene-specific, or not consolidating anything useful.

BWT and FWT together tell the complete story

- Stateless baseline: BWT ≈ 0 (never forgets), FWT ≈ 0 (never learns). Good stability, zero plasticity.
- Full fine-tuning: FWT potentially high (learns fast), BWT positive (forgets old scenes badly). High plasticity, terrible stability.
- MAPA target: BWT ≤ 0 (gate prevents forgetting), FWT > 0 (landmarks transfer). Both.

### RVPR — Return Visit Prediction Recovery: the practical headline

BWT and FWT are rigorous but abstract. RVPR is what a practitioner actually cares about. The question is simply: **does the robot predict better in Room X the second time it visits than the first? And the third time than the second?**

How to explain it out loud

"RVPR is the ratio of prediction error on the N-th visit to a scene, divided by prediction error on the first visit. If RVPR drops below 1.0 by the third visit, the predictor is genuinely improving with experience. If RVPR stays at 1.0 forever, the robot treats every visit to the same room as if it's a first visit — memory is doing nothing. BWT is the mathematical decomposition of forgetting. RVPR is the intuitive face of the same thing. It's the headline figure in the paper because it's the one you can explain to anyone."

\[\text{RVPR}_N = \frac{\varepsilon_{\text{visit }N}}{\varepsilon_{\text{visit }1}}\]

Prediction error on the N-th visit, normalized to the first visit. Target: below 1.0 by visit 3, declining. Stateless predictor: stays at ~1.0 forever, because nothing carries over.

### GSS — Gate Selectivity Score: does the gate actually work?

This is the gate's report card, specifically on the matched-noise experiment. You've engineered noise events that produce identical prediction error to genuine scene changes. The gate has to tell them apart using only cluster geometry. GSS measures how well it does.

How to explain it out loud

"GSS is precision times recall on the gate, measured specifically in the matched-noise experiment. Precision: of all the times the gate fired, what fraction were genuine scene changes and not engineered noise? Recall: of all the genuine scene changes that happened, what fraction did the gate actually catch? You want both high. A gate that fires on everything has perfect recall but terrible precision — it's useless. A gate that almost never fires has perfect precision but terrible recall — it misses most real events. GSS is the product, which penalizes both failure modes. If GSS is near random on the matched-noise experiment, the geometric mechanism is not working. That's the single metric that most directly tests the central claim of the whole architecture."

\[\text{GSS} = \text{Precision}_{\text{gate}} \times \text{Recall}_{\text{gate}}\]

Measured on matched-noise environments where εt is identical for genuine changes and engineered noise. The gate must separate them on cluster geometry alone. This is pass/fail on the core claim — not a number to optimize, a binary on whether the mechanism works.

### SP-score — Stability-Plasticity: the summary number

The fundamental tension in any memory system: a system that never updates is perfectly stable (it never forgets) but completely rigid (it never learns anything new). A system that always updates is maximally plastic (it learns everything immediately) but unstable (it forgets everything it previously knew). This is the stability-plasticity dilemma.

SP-score captures both in a single number using the harmonic mean — which specifically punishes systems that are great at one property while sacrificing the other.

How to explain it out loud

"The stateless baseline has a perfect stability score — it never forgets because it never updates. But its plasticity score is zero because it never learns anything new either. Full fine-tuning has high plasticity but terrible stability — it learns the new scene and forgets every scene before it. MAPA should score higher than both because it has both: the gate prevents forgetting while the LoRA update enables learning. SP-score is the harmonic mean of stability and plasticity — it's the same formula as F1 score in classification, which means a system that sacrifices either property completely gets a low overall score even if the arithmetic average looks okay."

\[\text{SP-score} = \frac{2 \times \text{Stability} \times \text{Plasticity}}{\text{Stability} + \text{Plasticity}}\]

Stability = (1 − normalized BWT loss). Plasticity = (1 − normalized FWT loss). Each normalized to [0,1] across all baselines. Harmonic mean: being terrible at one property tanks the whole score even if the other is great. MAPA's target: higher SP-score than both the stateless baseline and full fine-tuning.

### The metrics you do not use — and why

If they ask why you're not using FVD, SSIM, or PSNR, the answer is two sentences: MAPA operates entirely in latent space and produces no pixels, so pixel-space metrics are inapplicable. And research in 2025 found that pixel-prediction quality metrics are largely orthogonal to whether the representations encode the dynamics that matter for planning — high FVD score does not predict whether the world model is actually useful.

Never say a specific percentage target without a derivation

If asked "what's your target for gate selectivity?", say: "GSS is measured on the matched-noise experiment. We don't pre-specify a number — we report what the experiment produces and whether the gate separates signal from noise at identical error magnitudes. That's pass/fail on the mechanism, not a number to optimize." Claiming 85% before running the experiment is claiming a result.

---

## Cold questions — 30-second answers, no thinking

These arrive without warning. You need each one locked in well enough to answer mid-sentence without reconstructing anything from scratch.

What is εt exactly — be precise about what ẑt is

εt = ‖ẑt − zt‖². ẑt is the prediction *made at timestep t−1* for what the latent at t would be. zt is the actual encoding φ(st) at timestep t. So εt is the error of yesterday's prediction, evaluated against today's observation. It is never the distance between two encodings of the same frame.

Tightness — which direction means real change and which means noise?

**Low tightness = tight cluster = real scene change = gate fires.** High tightness = dispersed cluster = noise = gate suppresses. Tightness measures the spread of cluster members — low spread means the observations are consistently similar to each other, which is what a real scene produces. Noise scatters.

Why LoRA instead of full fine-tuning?

Full fine-tuning catastrophically forgets. The gradient signal for the new scene propagates through all weights, overwriting configurations that encode prior scenes. LoRA keeps base θ completely frozen — it never receives a gradient from scene data. Only Δθ = BA adapts, at rank 8. Everything in θ is untouched. That is the forgetting guarantee.

Where does sub-1% overhead come from? Derive it.

LoRA at rank 8 on a 192-dim model adds A ∈ ℝ8×192 and B ∈ ℝ192×8 per adapted layer. That is 2 × 192 × 8 = 3,072 parameters per layer. LeWM has 15M parameters. Even adapting all attention projection layers, the ratio stays well under 0.1%. Sub-1% is conservative by roughly an order of magnitude.

What does a landmark do at inference — precisely?

We retrieve the nearest landmark L̂k by cosine similarity to zt. It is concatenated with zt and fed into the predictor: ẑt+1 = fθ+Δθ(zt, L̂k). The landmark does not replace the current state — it is a context vector that biases the prediction toward the correct regime for this known scene. It reduces the effective Lipschitz amplification locally by constraining where the predictor's output can go.

BWT ≥ 0: why is that the threshold? Where does it come from?

Zero is the definitional boundary, not a chosen target. BWT = 0 means the predictor on scene i after all subsequent training is exactly as good as right after it learned scene i — no forgetting, no improvement. BWT < 0 means the predictor got worse on old scenes. The definition and the zero-crossing come from Lopez-Paz and Ranzato's 2017 GEM paper. We measure where we land.

Why does MAPA need SIGReg on the encoder?

The consolidation gate retrieves landmarks by cosine similarity. Cosine similarity is only a reliable semantic proxy when the latent space is isotropic — equal variance in all directions. Without isotropy, some dimensions dominate cosine computation regardless of semantic content. SIGReg regularizes the encoder toward an isotropic Gaussian, making cosine similarity meaningful. Without it, landmark retrieval is unreliable and the clustering geometry is corrupted.

What does the stop-gradient do in LeWM's training objective?

The loss is ‖fθ(zt) − sg[φ(st+1)]‖². The stop-gradient detaches φ(st+1) from the computation graph — the encoder receives no gradient through the target side. The only path for gradients to reach the encoder is through zt. This asymmetry prevents representational collapse: without it, the trivial solution — map everything to the same constant — minimizes the loss while learning nothing.

How is MAPA different from PAM?

PAM is a retrieval destination — memory is read at inference to construct the prediction. MAPA is a signal source — the buffer feeds the gate, the gate decides whether to update the predictor and write a landmark. The buffer is never read directly at inference. What is read is the landmark, which is the output of the gate after consolidation. PAM: read from memory. MAPA: update the predictor based on what memory tells you has changed.

Why not just extend context or add recurrence to LeWM?

Context extension keeps more history within a session but still resets at every episode boundary — it doesn't cross episodes. Adding recurrence changes LeWM's training objective: it's no longer the same model, and you lose the pretraining. MAPA wraps the existing predictor without modifying the base architecture or retraining. It operates on top of what LeWM already learned, adding cross-episode memory without touching the model it applies to.

Why LeWM at 15M parameters and not V-JEPA 2 at 1.2B?

Two reasons, and the second one is more important than the first.

The obvious reason: LeWM runs on a single consumer GPU, which makes the research accessible to groups like Lossfunk and academic robotics labs without frontier-lab compute. That matters for adoption.

The more important reason: **it's about whether you can isolate what MAPA is actually contributing.** If you test MAPA on V-JEPA 2's 1.2B parameters, any improvement in long-horizon prediction could be explained by the model's inherent scale — a 1.2B parameter predictor has far more capacity to handle non-stationarity just by being bigger. You cannot cleanly attribute the improvement to the memory mechanism versus to the model's raw capability.

With LeWM at 15M parameters, the baseline failure is clear and unambiguous — the model provably cannot handle long-horizon prediction without memory. So when MAPA improves it, that improvement is attributable to the memory mechanism, not to scale. The 15M constraint is what makes the causal claim clean.

V-JEPA 2 is the right destination for the model-agnostic demonstration once the mechanism is validated on LeWM. But you validate the mechanism where the signal is unconfounded, then show it generalizes to the larger model.

What breaks first if SIGReg's metric preservation is imperfect?

Retrieval quality degrades first. If the latent space is anisotropic, cosine similarity no longer reliably identifies the semantically nearest landmark — you retrieve a geometrically close vector that doesn't correspond to the correct scene. The gate itself is more robust because it uses Euclidean tightness in the buffer, not cosine similarity. So the architecture degrades gracefully: imperfect SIGReg means weaker landmark conditioning, not actively wrong updates. Forgetting protection remains intact because LoRA still constrains what the write mechanism can touch.

What would you cut if you had to deliver a minimal version in one month?

Cut LoRA, keep landmarks. Landmark retrieval conditions the predictor on known-scene context without any weight update — zero forgetting risk, zero training overhead. The gate still fires, landmarks still get written, inference still retrieves and conditions. What you lose is the update to the predictor's weights that makes it genuinely better on return visits. You get scene-conditioned prediction without cross-episode learning. It's weaker but it's honest and shippable.

---

## When it goes off-script

### If they say: "write the architecture on the whiteboard"

Write the 7-step inference loop in a column. Then draw a bracket around steps 1–4 and label it *fast timescale*. Draw a bracket around steps 5–7 and label it *slow timescale*. Label the slow timescale's inputs: buffer, cluster geometry, gate conditions. Label its outputs: LoRA update, landmark write. That is the entire architecture readable in 90 seconds.

### If they ask about the biological grounding

"The architecture operationalizes Complementary Learning Systems theory directly. The episodic buffer is the hippocampus — fast, temporary binding of individual events. The landmark centroids in permanent memory are the neocortex — slow, stable, generalized representations. The gate is the consolidation mechanism that decides what transfers from episodic to semantic memory. The difference from the biological system is that in MAPA, every stage of this process is a measurable, observable parameter. We can track exactly when the gate fires, what gets consolidated, and whether it produces better predictions. The biology is not a metaphor here — it is the design specification."

### If they ask whether this generalizes beyond LeWM

"MAPA has one constraint on the backbone it wraps: the latent space must be approximately metric-preserving so that cosine similarity is a reliable semantic proxy. Any JEPA predictor that satisfies this — through SIGReg or equivalent regularization — is a valid backbone. LeWM is the demonstration platform because it is accessible, single-GPU, and well-understood. The architecture is not LeWM-specific."

### If they ask about something you genuinely don't know

Say exactly this: *"I haven't worked through that — my best guess from the architecture is X, but I'd want to verify before claiming it."* That answer is more credible than a confident wrong answer in every interview, every time. The interviewer is not trying to catch you out. They are checking whether you own what you built or memorized it.

---

## Every claim and its source

| Claim | Source / Derivation | What to say if challenged |
| --- | --- | --- |
| BWT ≥ 0 | Lopez-Paz & Ranzato, 2017 | "Zero is the definitional forgetting boundary. Not our target — the definition." |
| FWT > 0 | Same paper | "Definitional boundary for positive transfer." |
| α = 2.0 → ~2.3% fire rate | 2-sigma Gaussian rule | "97.7% of Gaussian noise falls within μ ± 2σ. Standard sigma convention." |
| Sub-1% overhead | 2 × 192 × 8 = 3072 / 15M | "Do the math. Two LoRA matrices at rank 8 on a 192-dim model." |
| Gate fires on tight clusters | Validated by matched-noise experiment | "This is exactly what the matched-noise experiment tests. Pass/fail." |
| β = 0.95 → ~20 step window | Geometric series: 1/(1−β) = 20 | "Standard EMA effective window calculation." |
| RVPR and GSS targets | No pre-specified target | "Experimentally determined. We compare against baseline, not against a pre-promised number." |
| Isotropy needed for cosine | Property of cosine similarity | "Cosine measures angular distance. Anisotropic spaces corrupt the angular geometry — dimensional dominance, not semantic similarity." |

MAPA Interview Reference · Priyam Ghosh · July 2026
