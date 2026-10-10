# Why World Models Need Memory

A proposal for giving world models persistent memory, from the neuroscience of prediction to episodic buffers, consolidated landmarks, and gated adaptation.

Author: Priyam Ghosh
Published: June 2026
Canonical: https://prigoistic.me/mapa/
Keywords: world models, episodic memory, JEPA, continual adaptation

> "The failure of current world models at long horizons is not the absence of capacity. It is the absence of a persistent memory hierarchy in the predictor."

This piece works through the problem from the ground up. We start with why memory is inseparable from prediction in biological brains, then watch language models rediscover the same lesson, then look at why JEPA, the most promising world-model family, still cannot do it. From there we name the exact bottlenecks, examine the partial solutions that exist and where each one stops, and only then build toward an architecture that closes the gap. Nothing about the solution is introduced before the problem earns it.

---

## 1. The neuroscience case: why prediction requires memory

Walk into your kitchen in the dark and your hand finds the light switch before your eyes find anything at all. You already know where the counter ends, that the floor will hold, that the fridge is humming to your right. None of that is sensation. It is prediction. What you experience as "seeing the room" is mostly your brain rendering its own model of the room, with the actual light arriving a beat late, used only to correct the parts the model got wrong.

This is the core of predictive processing, and Karl Friston gave it its sharpest form in the free energy principle: a brain exists to minimize surprise. Not the jolt of a single startling moment, but the long-run mismatch between what it expects and what the world actually delivers. To pull this off it runs a **generative model** that is always a step ahead, forecasting the next sight, sound, and touch. Perception is not the world flowing in. It is prediction flowing out, met halfway by evidence, and the gap between the two, the prediction error, is the only thing the brain ever really learns from.

Here is the part that matters for us. A prediction is only as good as the history behind it. Strip away memory and every moment arrives naked: no sense of what this place usually looks like, no expectation that the cup you set down is still on the desk. Every glance would carry maximum surprise. A system like that is not perceiving the world. It is transcribing it. A camera, not a mind.

Brains dodge this with not one memory system but two, running at different speeds. The **hippocampus** writes fast: a new experience is laid down in seconds, vivid and specific, which is why you can still picture exactly where you dropped your keys this morning. The **neocortex** writes slow. Over nights of sleep it replays what the hippocampus caught and quietly distills the patterns that repeat, until what remains is no longer "Tuesday's kitchen" but kitchen-ness itself: what is always there, what tends to move, what can safely be ignored.

The trick that makes this work is restraint. If every fleeting experience rewrote long-term memory, one strange afternoon could overwrite years of knowledge. So the brain gates the transfer. Fast memory fills constantly; slow memory updates only when the evidence piles up into something stable and genuinely new. That gate, the judgment of when a passing experience has earned a permanent place, is the quiet hinge the whole system turns on. Lose it in one direction and you forget everything; lose it in the other and you never learn anything new.

What holds that gate is not a single sentinel neuron or a dedicated circuit. It turns out to be a class of cell that neuroscience spent the better part of a century treating as passive scaffolding: astrocytes. The classical picture of a synapse is two neurons exchanging signals across a narrow gap. The actual structure is three. A perisynaptic astrocyte process wraps both terminals, and it is not passive. For a synapse to strengthen in the lasting way that memory consolidation requires — the mechanism is called long-term potentiation — the receiving neuron's NMDA receptors have to open fully. They need two signals at once: glutamate arriving from the sending neuron, and D-serine released by the astrocyte. Without the astrocyte's contribution the receptor stays half-closed, and the synapse does not learn, regardless of how often or how loudly the neuron fires. The astrocyte is not a bystander. It is a required cosignatory: the gate at the level of the individual synapse, deciding whether this particular connection is even permitted to strengthen.

Above that molecular gate sits a second one, systemic and slower. Throughout waking hours, neural activity generates ATP as a metabolic byproduct, and astrocytes convert that ATP into adenosine. Adenosine accumulates as a direct function of how hard the network has been working — it is the brain's usage meter. When it crosses a threshold the brain enters slow-wave sleep: acetylcholine falls, the cortex produces coordinated slow oscillations, and the hippocampus fires sharp-wave ripples, compressed replays of recent experience broadcast to the neocortex in rapid sequential bursts. The neocortex's weights shift a little with each replay. Over many nights the patterns that recur get distilled into something lasting, and the ones that do not quietly fade. Outside that mode — during waking, during REM — the same replay and the same weight changes do not happen. Astrocytes are, in this sense, the metabolic clock that decides when the consolidation window opens at all.

So the quiet hinge is actually two hinges stacked. The first is molecular: the astrocyte active, D-serine present, NMDA open, plasticity chemically permitted at a specific synapse. The second is systemic: adenosine high enough, slow-wave mode engaged, the hippocampus replaying rather than encoding. Both have to be aligned for a memory to cross from the hippocampus's scratchpad to the neocortex's permanent store. The content of an experience — how surprising it was, how often it recurred — is only half the question. The other half is whether the brain is currently in a state that permits consolidation at all.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/1.svg)

Diagram labels: Hippocampus Fast write · High fidelity Episode-specific · Short-lived Rapid encoding of surprise evidence Consolidation Gate Fires when evidence is stable, novel, and geometrically coherent Suppresses noise-driven updates writes to Neocortex Slow consolidation Compressed · Permanent Cross-episode abstract patterns New experiences encode fast. The gate decides when accumulated evidence justifies a slow, permanent update.

Figure 1. The brain's two-timescale memory architecture. Fast hippocampal encoding feeds a consolidation gate that updates the neocortex only when evidence is stable and genuinely novel.

You can watch this play out in a rat. Tucked inside its hippocampus are **place cells**, neurons that each fire for one particular spot in the world, and **grid cells** that tile space into a coordinate system. Drop the rat into a room it knows and these cells light up in their familiar order. It does not re-survey the walls. It remembers them, and that memory steadies its very next move. A world model worth the name should do the same: walk into a region it has seen before, recognize it, pull up what it already learned, and predict from there instead of starting over. Evolution shipped this hundreds of millions of years ago. The open question is whether we can build it.

Which makes the state of machine learning a little strange. Nearly every system we know of that stays competent over a long, shifting life leans on some version of this fast-slow, gated architecture. So why do we keep building world models that throw it away? Before answering that for world models, it helps to see the same problem appear, and get partly solved, in the systems we understand best.

---

## 2. Language models hit this wall first

A language model has no memory in the ordinary sense. Every time it answers, it reads the whole conversation again from the top. Nothing carries over between turns except what gets fed back in as text. For a short exchange this is invisible. But re-reading everything costs attention that grows with the square of the length, so as a conversation stretches into hundreds of turns something has to give. Either the model quietly drops the older parts of the context and loses track of what was decided an hour ago, or it pays a steeply rising bill to keep attending to all of it.

The fixes that actually worked all converge on one idea: give the model a way to write things down. The **KV cache** keeps the computed state of past tokens so they never have to be reprocessed. **Retrieval-augmented generation** pushes knowledge out into a document store and pulls back only the few passages that matter right now. **Learned memory banks** let the model decide for itself which tokens are worth keeping and fetch them later by content. Different mechanisms, one shape: instead of holding everything in mind at once, the model stores what it learned in a durable form and reaches for it on demand.

The payoff is not subtle. A model that can write and retrieve handles long tasks on less compute, because it stops re-deriving what it already worked out. The attention it saves goes to the new problem in front of it rather than the old ones behind it. And it starts to accumulate: the notes it kept about a codebase yesterday make it sharper today, where a memoryless model walks in every morning a stranger.

It is worth being exact about what counts here, because the obvious move, just enlarge the context window, is not the same thing. A bigger context still forgets the instant it overflows. It dilutes, the one fact you need buried under everything you don't. And it forces the model to search the entire haystack on every single step. Real memory is the opposite: selective, structured, and durable. It writes the important things on purpose, in a form built for retrieval, behind a gate that keeps noise from crowding out signal. Those are the same three properties the brain's consolidation gate enforces.

World models face this exact problem one floor up. A language model forgets across turns; a world model forgets across episodes. One loses the thread of a conversation, the other loses the room it mapped an hour ago. The cure has the same skeleton: something fast to catch experience as it happens, something slow to keep what proves durable, and a gate deciding what crosses between them. The hard part is fitting that skeleton into a predictor that works in latent space, without wrecking the representations that cost so much to train in the first place. To see why that is hard, look at how these world models are built.

---

## 3. JEPA and the long-horizon memory gap

JEPA, the Joint-Embedding Predictive Architecture, makes one decisive bet: do not predict what the world looks like, predict what it means. A generative model labors to reconstruct every pixel of the next frame. JEPA refuses to. Its encoder turns each observation into an abstract representation, and its predictor learns to guess the next representation from the current one, training only to close the gap between the two in that abstract space, with a stop-gradient on the target so the whole thing does not collapse into predicting a constant.

This is the right bet, for a good reason. Pixels are full of things no planner should waste a thought on: the grain of a wall, the exact shade of a shadow, the flicker of noise that will never repeat. Predicting them burns compute on the parts of the world that are both unpredictable and irrelevant. Predicting in latent space spends that compute where it counts, on what is where, what follows what, what kind of place this is. The results bear it out: JEPA-family models match or beat generative baselines on action-conditioned prediction, zero-shot robot planning, and video understanding, at a fraction of the cost.

A few systems in this family are worth knowing by name, because the rest of the argument leans on them.

- **V-JEPA 2:** A frozen encoder combined with a learned video predictor. Strong performance on action-conditioned prediction and zero-shot robot planning. Demonstrated that a JEPA encoder pretrained on unlabeled video can generalize to robotics tasks without task-specific fine-tuning.
- **V-JEPA 2.1:** Fixed a specific weakness in V-JEPA 2 where token-level spatial grounding was fragmented; representations were semantically coherent globally but lacked precise local spatial structure needed for fine-grained manipulation tasks.
- **LeWorldModel (LeWM):** The most architecturally clean. A stable end-to-end JEPA trained from raw pixels without pretrained encoders, without stop-gradient heuristics, without exponential moving average encoders. Just two loss terms. 15 million parameters. Trains on a single consumer GPU in a few hours. Keep this one in mind; it matters later.
- **MC-JEPA:** A pyramidal flow predictor, and the first hierarchical JEPA instantiation. Showed that multi-resolution prediction in latent space is architecturally feasible, with predictions at different spatial scales sharing a common embedding space.

Every one of them shares the same blind spot: the predictor is stateless across episodes. LeWM's encoder learns beautiful, general representations of how scenes evolve. V-JEPA 2 plans zero-shot. But the instant an episode ends, none of what just happened survives in the predictor. Its weights froze at the end of training and never move again. Episode one thousand starts from the identical prior as episode one, as if the previous nine hundred and ninety-nine never occurred.

LeCun's 2022 H-JEPA vision explicitly named this as a structural goal: stack JEPA modules at multiple levels of temporal abstraction. Lower-level JEPA handles moment-to-moment dynamics. Higher-level JEPA handles long-horizon, scene-level abstractions. The hierarchy was the proposed solution to the long-horizon planning problem. But the H-JEPA papers also acknowledge what they left open: how many abstraction levels the hierarchy should have, how levels communicate across episode boundaries, and what mechanism governs updating any level's representations when world dynamics change. The two-tier structure was called "arbitrary." The cross-episode update mechanism was left as future work.

That last item is the heart of it. The hierarchy tells the system what to predict at what timescale, but it says nothing about how to carry experience across episodes or when to revise what the predictor knows. Before we can propose a mechanism for that, we need to be precise about what actually breaks when a stateless predictor runs at long horizons. "It forgets" is too vague to build against. There are five distinct failure modes, and each one demands a different response.

---

## 4. Five bottlenecks, five different root causes

Each of these is a distinct failure with a distinct signature. Keeping them separate matters, because any real solution will need a different mechanism for each one. Lump them together as "forgetting" and you end up reaching for a single blunt instrument that fixes none of them cleanly.

### Autoregressive predictive compounding

A predictor that feeds on its own output has a problem built in. It guesses the next representation, then feeds that guess back in to guess the one after, and so on. Each guess carries a small error, and each error becomes part of the input to the next. The mistakes do not average out. They snowball. Researchers at CMU and UCSD have traced exactly this in latent-space rollouts and named it **autoregressive latent drift**: a few steps in, the predicted representation has wandered away from anything the encoder would produce for the real scene. Plan against it and you are planning against a hallucination.

\[\varepsilon_{t+k} \approx \varepsilon_t \cdot L_f^{\,k}\]

Here \(L_f\) is the Lipschitz constant of the predictor \(f_\theta\): if \(f_\theta\) maps two latent states that are \(\delta\) apart to outputs that are at most \(L_f \cdot \delta\) apart, then each autoregressive step can amplify the current error by up to \(L_f\). Writing \(L_f = 1 + \lambda\) makes the per-step growth rate explicit:

 \[\varepsilon_{t+k} \approx \varepsilon_t \cdot (1 + \lambda)^k\]

**Important:** this \(\lambda\) is not a loss hyperparameter. It is a geometric property of the predictor — specifically \(L_f - 1\), the amount by which each forward pass stretches small input errors. A predictor with \(L_f = 1\) is a perfect contraction and errors stay bounded; any \(L_f > 1\) causes geometric blowup over long rollouts. At \(\lambda = 0.02\) the error is 7× larger after 100 steps; at \(\lambda = 0.05\) it is 131× larger. Shaving per-step error helps a little but only changes \(\lambda\) marginally. What actually tames this is re-anchoring the rollout to a real observation periodically, resetting the accumulated drift before it can blow up.

### No write mechanism

Freeze the encoder and predictor at inference, as every JEPA system does, and you cut the only wire by which today's experience could reach tomorrow's prediction. A robot can watch a new kind of object for an hour and retain nothing of it past the episode. This is not a setting you can tune or a dataset you can enlarge. There is simply no channel through which the model can grow once it is deployed. It is, by construction, incapable of learning from what it sees.

### Noise vs. genuine change: the prediction error ambiguity

Suppose the prediction error suddenly spikes. What does it mean? It could mean the world genuinely changed, a wall moved, an object appeared, and the model ought to take note. Or it could be nothing: sensor noise, a stochastic render, the model's own drift catching up with it. The trouble is that these two cases can produce the exact same spike. Judge by magnitude alone and you cannot tell them apart. React to every spike and noise quietly corrupts everything you know. Raise the bar to stay safe and you sleep through the changes that mattered. Every memory system that wants to update itself runs straight into this wall.

### Dynamic drift blindness

Not every change announces itself. A storeroom fills one box at a time over a month. A workspace creeps into a new layout over weeks. At any single visit the scene looks unremarkable, so a stateless model shrugs and moves on, every time. It never sees the trend, because seeing a trend requires comparing now against a remembered then, and it has no remembered then. Ask it how the room has drifted across its last three visits and it has no answer, because as far as it is concerned there were no last three visits.

### Return visit degradation

This is the one that stings in practice. A model can pass through the same environment a hundred times and arrive on the hundredth visit no wiser than on the first, sometimes worse. With nothing consolidated, every return is a first encounter. And the one crutch available, stuffing past observations back into the context, decays on its own: the useful early frames get buried under a hundred recent irrelevant ones. The experience is all there, technically. It is just completely out of reach.

| Failure mode | Root cause | Observable signature | What fixes it |
| --- | --- | --- | --- |
| **Autoregressive compounding** | Errors feed next prediction | Rollout divergence at k > 20 steps | Periodic re-anchoring to real observations |
| **No write mechanism** | Frozen weights at inference | Zero cross-episode transfer | A persistent write pathway |
| **Noise vs. genuine change** | Error magnitude is ambiguous | False update storms on noise | Gating on geometry, not magnitude |
| **Dynamic drift blindness** | No incremental accumulation | Misses gradual scene changes | Incrementally updated representations |
| **Return visit degradation** | No consolidated retrieval | Flat or declining performance | Consolidated, retrievable memory |

Five failures, five root causes, five mechanisms that would have to be built. There is no single lever that throws all of them at once, which already tells you any honest solution has to be modular. The good news is that the field has not been idle. Several systems tackle one or two of these directly, and seeing exactly how far each one gets, and where it stalls, is what points the way to the rest.

---

## 5. The partial solutions, and where each one stalls

Three systems take real runs at the long-horizon problem, each from a different angle. None of them ends up giving the predictor a memory that survives between episodes, but that is precisely what makes them useful to study. The place where each one stops is a clue to what is actually missing.

### Hierarchical World Models (HWM)

HWM splits the problem across two levels. A **high-level planner** thinks in coarse subgoals, the milestones of a task, while a **low-level predictor** handles the frame-by-frame dynamics needed to reach each one. The planner doesn't reason about raw actions at all; an Action Encoder folds whole sequences of primitive actions into single "latent macro-actions," so the top of the hierarchy plans in big strokes and the bottom fills in the detail.

And it works. On Push-T, HWM lands 61 to 70% task success where flat models manage 17%. On hard robotic arm control it reaches 70% zero-shot against a flat baseline stuck near zero. It even runs cheaper, about 3× less compute, because it can stop at a coarse level whenever fine detail is not needed. The interesting question is why dividing the horizon helps this much, and the answer goes straight back to the compounding problem from the last section.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/2.svg)

Diagram labels: High-Level Planner (slow, abstract) Subgoal sequence: g₁ → g₂ → g₃  ·  Action Encoder compresses primitive actions into Latent Macro-Actions Operates on coarse representations across many timesteps g₁ g₂ g₃ Low-level Predictor f_θ · frame-level dynamics z₁ … z_k Low-level Predictor f_θ · frame-level dynamics z_k … z_2k Low-level Predictor f_θ · frame-level dynamics z_2k … z_3k error bounded per interval error bounded per interval error bounded per interval Subgoal boundaries act as re-anchor points · high-level plan persists across low-level noise Error per interval: L_f^(N/K) vs free rollout: L_f^N where L_f = 1+λ is the predictor Lipschitz constant

Figure 2. HWM architecture. The hierarchy bounds error compounding per subgoal interval rather than across the full rollout.

### How subgoal decomposition counters predictive error compounding

Recall from Section 4 that the predictor's Lipschitz constant \(L_f = 1 + \lambda\) sets the per-step amplification rate of any input error, so over an \(N\)-step free rollout the worst-case drift grows as \(L_f^N = (1+\lambda)^N\). Now cut that rollout into \(K\) subgoals. Inside each interval the predictor only runs free for \(N/K\) steps before the high-level plan pins it back to a known abstract target. The maximum drift is no longer set by the full horizon, only by the length of one segment.

\[\text{Flat rollout: } \varepsilon_{\max} = \varepsilon_0 \cdot (1+\lambda)^N\] \[\text{With } K \text{ subgoals: } \varepsilon_{\max} = \varepsilon_0 \cdot (1+\lambda)^{N/K}\]

(\(\lambda = L_f - 1\) is the predictor's per-step error amplification rate, a geometric property of \(f_\theta\), not a loss weight.) At \(\lambda = 0.02\), \(N = 100\), \(K = 5\): worst-case drift falls from 7.2× to 1.49×. The subgoal boundary is a free anchor — the same re-anchoring the compounding problem was asking for, delivered here by the plan rather than by memory.

That free anchor is the whole story. Because the high-level plan holds steady while the low-level predictor wobbles, the agent always has somewhere to aim. It never gets truly lost the way a flat predictor does when its own noise snowballs into nonsense. Which is why subgoal agents finish long-horizon tasks far more often even when, step for step, their predictions are no more accurate. HWM buys a real reduction in compounding. What it does not buy is memory: when the episode ends, the plan and everything under it evaporate.

### FF-JEPA: the dual-engine approach

FF-JEPA, from June 2026, gets at the same anchoring effect a different way. It pairs a **goal-free latent planner**, which sketches a plausible future trajectory without being handed a target image, with an **action-conditioned model** that executes against that sketch. The move that makes it work is a feedback loop: the planner's high-level expectation is folded back into the encoder, so the representation the predictor sees already carries a sense of where things are headed.

The effect is an attractor. When local noise nudges a prediction off course, the top-down expectation tugs it back. The representation \(z_t\) is built from the bottom-up observation and the planner's expected trajectory \(h_t\) at once, so it is harder to knock loose. Same strength as HWM, then, and the same ceiling: it steadies prediction within an episode, and carries nothing across episode boundaries.

### PAM: Predictive Associative Memory

PAM, Predictive Associative Memory, is the only one of the three that even tries to remember. It keeps a key-value store in the predictor's latent space: see an observation that resembles something filed away, pull the stored version back out, and use it to sharpen the current prediction. That is a genuine write mechanism, and in principle it can hold information across episodes, which already sets PAM apart.

But look at how the memory is used. PAM treats the store as a *destination*: write observations in, retrieve the relevant ones, paste them alongside the current input. That is in-context memory wearing a different hat, and it drags along every in-context flaw. It dilutes as the store fills. It costs more to search as it grows. And, fatally for our list, it has no gate, so it cannot tell a genuine change from noise and it never consolidates anything into the predictor's own weights. The buffer should not be a place you read from. It should be a *signal*, something whose accumulated evidence decides when the predictor itself ought to change. PAM has the wire but not the judgment.

| Failure mode | HWM | FF-JEPA | PAM |
| --- | --- | --- | --- |
| **Autoregressive compounding** | Partial — bounded per interval | Partial — feedback re-anchors | Partial — retrieval can anchor |
| **No write mechanism** | No | No | Partial — retrieval only |
| **Noise vs. genuine change** | No | No | No — no gating |
| **Dynamic drift blindness** | No | No | No — snapshots not accumulation |
| **Return visit degradation** | Partial — subgoal reuse | No | Partial — if retrieved correctly |

Lay the three side by side and a pattern jumps out. Each one solves a failure mode or two and leaves the rest untouched, and the failures they all walk past are the same ones: telling real change from noise, noticing slow drift, and writing what is learned into the predictor itself. Every one of those wants the same missing piece, a gate that judges accumulated evidence by its *geometry* rather than by the size of any single error, and that commits to a permanent update only when the evidence has earned it. That is exactly the piece the brain has and none of these systems do. The next section asks what it would take to build it.

---

## 6. What if the predictor could remember?

Step back and take stock. HWM and FF-JEPA make prediction within an episode markedly steadier. PAM goes further and writes things down, but reads them back the wrong way. And the moment any episode ends, all three snap back to the same frozen prior they began with. For all their differences, the predictor at the center is amnesiac in exactly the same way.

The reflex, when a JEPA system buckles at long horizons, is to reach for more: a longer context window, a bigger model, more frequent fine-tuning. None of these touches the actual problem. A longer context is more to look at, not more structure to remember. A bigger model is more capacity, not more adaptability. Fine-tuning trades the old knowledge for the new instead of holding both. The question was never how to give the predictor more of the present. It is how to give it a past: a memory that gathers experience across episodes and rewrites what the predictor knows only when that experience has genuinely earned it.

We already have a working blueprint for this, and it has been sitting in Section 1 the whole time. The hippocampus writes fast. The neocortex consolidates slow. A gate between them holds the line, committing to a permanent change only when the evidence clusters into something stable, novel, and geometrically coherent, never on the strength of one loud error. So the question almost asks itself: what if we built that gate for a JEPA predictor?

Picture it concretely. A fast buffer catches the surprising moments as they happen, in latent space. An online clustering step groups those moments by where they land, so the geometry becomes visible. A gate watches the clusters and fires only when one settles into stable new structure. And when it fires, a small, reversible adapter nudges the predictor's weights to absorb what was learned, while the encoder, with its hard-won representations, stays frozen and untouched. Fast capture, slow consolidation, a gate in between. The brain's design, ported to a predictor.

That port is faithful in one direction and a deliberate simplification in another. The content filtering — evidence accumulated, geometry tight, genuine novelty confirmed — mirrors what the biological gate cares about, and it handles the most dangerous failure mode: noise triggering false permanent updates. What it does not replicate is the mode question. The biological system uses astrocytic adenosine buildup to separate encoding and consolidation into temporally distinct phases; the consolidation window opens only when the brain's usage meter crosses a threshold, not whenever a content criterion is met. MAPA runs its gate continuously during inference rather than in a dedicated offline window. This is a known simplification, and a justified one: the three-part content gate already blocks the cases the mode separation was evolved to prevent. But the biological system asks two questions before it consolidates — *is this worth keeping?* and *is now a time when keeping things is permitted?* — and MAPA, by design, only asks the first.

Stated plainly, the bet is this: **a two-timescale memory in the predictor, a fast episodic buffer in latent space feeding a consolidation-gated slow weight update, is the minimal sufficient mechanism for continual world-model prediction across long horizons, tracking non-stationary scenes with bounded forgetting, and needing no demonstrations and no replay buffer.** The rest of this piece is what that looks like when you actually build it.

---

## 7. MAPA, end to end

We call it **MAPA**, the Memory-Augmented Predictive Architecture. It is not a new world model. It is a memory layer that wraps an existing JEPA predictor, and in the reference build that predictor is LeWorldModel, the clean 15-million-parameter system from Section 3. One rule sits above all the others: the encoder is never touched. The representations it learned in pretraining are the bedrock everything else stands on, and disturbing them would defeat the purpose. Every adaptation MAPA makes flows through a single LoRA adapter on the predictor, roughly 0.8% extra parameters, and the original weights can always be restored exactly.

It comes apart into seven components, and the seams are deliberate. Each one answers a specific failure mode from Section 4, which means each one can be removed on its own to see what breaks. That ablation table is not an afterthought; it is one of the central results the whole project is built to produce. Here is the system whole, then we will walk it piece by piece.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/3.svg)

Diagram labels: EVERY STEP WHEN PREDICTION ERROR EXCEEDS THRESHOLD WHEN GATE FIRES — RARE s_t Observation raw frame every timestep Encoder φ Frozen — never updated s_t → z_t ∈ ℝ¹⁹² abstract representation SIGReg-trained, metric-preserving z_t and ε_t z_t = φ(s_t) ε_t = ‖ẑ_t − z_t‖² ẑ_t: predicted at t−1 z_t: actual right now Predictor f_θ + LoRA Δθ inputs: z_t + nearest landmark output: ẑ_{t+1} (stored for next step) LoRA adapter Δθ is updated when gate fires runs every step · uses landmark from C7 ε_t if above threshold C2 Threshold τ(t) = μ_W + 2σ_W 100-step rolling window ε_t > τ → write to buffer ε_t ≤ τ → discard adapts as predictor improves C3 Episodic Buffer 2048 entries · ~7.5MB (z_t, a_t, z_{t+1}, ε_t, ep_id) surprise-weighted LRU eviction fast buffer — hippocampus analogue C4 Online K-Means groups z_t by cosine similarity tight cluster → real change scattered → noise EMA centroids track slow drift β=0.95 · ~20 step memory per centroid check gate criteria C5 Consolidation Gate — all three must hold ① support(k) ≥ N_min · enough observations in this cluster, not a one-off fluke ② tightness(k) ≤ σ²_max · cluster is geometrically tight = real change, not scattered noise ③ novelty(k) ≥ δ_novel · centroid is far from existing landmarks = genuinely new gate fires C6 LoRA Update 32 entries · 20 Adam steps · lr=1e-4 nudges predictor to new scene dynamics C7 Landmark Set 192-dim centroid · permanent · kilobytes retrieved every step → anchors predictor retrieved every step

Figure 3. MAPA architecture as three frequency bands. Top (gray): runs every single timestep. Middle (blue): triggered only when the prediction error clears the adaptive threshold. Bottom (green): the gate fires rarely, only when a cluster is tight, novel, and well-evidenced. The dashed green arrow is the landmark feedback — it runs every step, anchoring the predictor to what it has already learned.

One contrast with PAM is worth pausing on, because it is the whole design philosophy in miniature. PAM's buffer was a place to read from. MAPA's buffer is a place to listen to. Nothing is ever retrieved out of the episodic buffer directly; its job is to accumulate evidence and feed the gate, and the gate decides when the predictor should change. What actually persists and gets used at inference are the landmarks and the LoRA adapter, both of them products of consolidation, never the raw buffer itself. The buffer is the signal. The landmarks and the adapter are the memory.

---

## 8. Inside the memory: what gets kept, and how it knows

### Only the surprises get written down

Most of what a model sees is unremarkable, and writing all of it down would drown the signal. So the first gate, the adaptive threshold filter (C2), lets through only the observations that genuinely surprise the predictor, the ones whose error clears a moving bar set from the recent past: \(\tau(t) = \mu_W + \alpha\sigma_W\), where the window \(W\) is the last 100 steps and \(\alpha = 2.0\) picks off roughly the top 2.3% of recent errors.

The bar has to move, and that is the subtle part. As the adapter learns, the predictor gets better and its everyday error shrinks. A fixed threshold would slowly fall silent, nothing ever clearing it again, and the system would stop noticing anything. Tying the threshold to the recent error distribution keeps "surprising" defined relative to how good the predictor currently is, so it stays alert in a new environment instead of going numb.

### What a single memory looks like

Each thing written to the buffer is a small five-part record, \((z_t, a_t, z_{t+1}, \varepsilon_t, \text{episode\_id})\), and every field is there for a reason.

- **\(z_t\)** is where the model was in representation space, the latent address of the moment.
- **\(a_t\)** is the action taken, needed later because the weight update has to predict what follows *given* what the agent did.
- **\(z_{t+1}\)** is where it actually ended up, the target the update is trained toward, with a stop-gradient so it stays a fixed goal.
- **\(\varepsilon_t\)** is how surprised the model was, which doubles as the entry's priority: the more surprising a memory, the longer it survives eviction.
- **\(\text{episode\_id}\)** tags where it came from, so the gate can see whether a pattern recurs across episodes or is just one episode's fluke.

All of it fits in about 7.5MB: 2048 entries of five 192-dim vectors. That smallness is intentional. The buffer is not an archive of everything that happened. It is a compact, self-refreshing scratchpad of recent surprises, just rich enough for the clustering step to find structure in.

### Telling a real change from a passing fluke

This is the heart of it, the failure mode nothing else in Section 5 could handle. The clustering step (C4) takes each surprising \(z_t\) and drops it onto the nearest existing centroid if it is close enough in cosine similarity, past \(\tau_\text{assign} = 0.85\), updating that centroid by EMA with decay \(\beta = 0.95\). If nothing is close enough, it opens a new cluster. So the geometry of recent surprise is always laid out in front of the gate, grouped and visible.

The \(\beta = 0.95\) decay gives each centroid a memory of about 20 steps, which is exactly what lets it follow slow drift: as a scene gradually changes, its centroid slides along with it, and the distance it has traveled, \(\|c_{k,t} - c_{k,0}\|\), is a number you can read off. A sudden change does something different, it opens a fresh cluster rather than smearing an old one, and that is the right instinct, because an abrupt change and a slow drift are genuinely different events and deserve different memories.

Now the discriminator the whole architecture turns on. When surprise spikes, is it real or noise? The answer is in the shape of the cluster, not the size of the error. The gate (C5) measures **tightness**:

\[\text{tightness}(k) = \frac{1}{n_k}\sum_i \|z_i - c_k\|^2\]

Noise scatters. A spike from sensor jitter or drift lands somewhere random, and a cluster of such spikes is loose and diffuse, with high within-cluster variance. A real change does the opposite: several observations of the same new thing pile up in the same region, forming a tight, coherent knot. Same error magnitude, completely different geometry.

This is what lets MAPA separate a true scene change from a compounding-error spike of identical size, the thing a magnitude threshold simply cannot do. It is also exactly the claim the matched-noise experiment is built to test: manufacture noise events with the same error magnitude as real changes, and check that the gate fires on the changes and stays quiet on the noise where an adaptive learning-rate schedule cannot tell the difference.

Tightness alone is not enough, though, and the gate insists on all three of these at once:

\[\text{(1)}\;\; \text{support}(k) \geq N_{\min} \qquad \text{enough evidence, not one stray point}\] \[\text{(2)}\;\; \text{tightness}(k) \leq \sigma^2_{\max} \qquad \text{coherent in shape, not scattered noise}\] \[\text{(3)}\;\; \text{novelty}(k) = \min_j \operatorname{sim}(c_k, L_j) \leq 1 - \delta_{\text{novel}} \qquad \text{genuinely new, not already known}\]

Each guards a different way of being fooled. Drop support and the gate fires on a single lucky point. Drop tightness and it fires on noise. Drop novelty and it keeps re-learning something it already stored. Demanding all three together means a memory becomes permanent only when it is well-evidenced, coherent, and actually new, which is a high bar on purpose.

### Writing it in: a nudge, not an overwrite

When the gate finally fires, the update is small and careful. The system pulls 32 records from a short raw cache and runs 20 Adam steps at \(1\times10^{-4}\), and the only thing that moves is the LoRA adapter:

\[\Delta\theta = B \cdot A, \qquad A \in \mathbb{R}^{r \times d_{\text{in}}},\;\; B \in \mathbb{R}^{d_{\text{out}} \times r},\;\; r = 8\]

That is about 0.8% of the predictor's parameters, and the base weights θ never move. New knowledge lands entirely in the adapter, which means the core representation cannot be catastrophically overwritten: the adapter can overfit and be reset, and the model underneath is still intact.

The two roads not taken are the point. Full fine-tuning would let each update trample the last, exactly the forgetting we set out to avoid. A replay buffer would mean hauling around raw observations at a scale the project deliberately refuses. LoRA is the smallest pathway that still writes: structured, durable, and bounded enough that nothing it does is irreversible.

---

## 9. Architectural choices and pre-training design

Two pre-training choices make everything in Section 8 actually work. They are easy to skip past as implementation detail, but the gating quietly depends on both.

### Why SIGReg and not an EMA encoder

Standard JEPA keeps representations from collapsing by running a second, slowly-updating copy of the encoder as a target, the exponential moving average trick. It works, but it doubles the trainable parameters and bolts on real complexity. LeWorldModel showed you do not need it: a geometric regularization loss prevents collapse just as well, with no shadow network at all. MAPA takes the same route and trains its encoder with SIGReg, which adds that geometric term on top of the usual contrastive loss.

\[\mathcal{L} = \mathcal{L}_{\text{InfoNCE}} + \lambda_{\text{geo}} \cdot \mathcal{L}_{\text{geo}}\] \[\mathcal{L}_{\text{geo}} = \mathbb{E}_{i,j}\!\left[\bigl(\|\varphi(s_i) - \varphi(s_j)\| - d_{\text{obs}}(s_i, s_j)\bigr)^2\right]\]

The geometric term forces distances in latent space to track distances in the real world, which is the same as bounding how fast the encoder can stretch space. This is not housekeeping. The whole gate runs on cosine similarity, and cosine similarity only means "semantically alike" if the latent space is metrically honest. Skip SIGReg and two nearly identical scenes can land far apart, shattering one coherent place into a dozen phantom clusters and making the tightness test meaningless. The gate is only as trustworthy as the geometry underneath it.

### Why LeJEPA with multi-step targets

The predictor is trained to look several steps ahead at once, \(k \in \{1, 2, 4, 8, 16\}\), not just one step like vanilla JEPA. Two things follow, and both feed back into the memory system. First, a predictor that is decent at long horizons has a lower baseline error, which gives the adaptive threshold a quieter background to pick surprises out of. Second, training across timescales forces representations that mean something at every scale, coarse enough for the long view, fine enough for the next frame. That is exactly the split the memory relies on: the buffer works the fine grain, the landmarks hold the coarse.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/4.svg)

Diagram labels: Multi-episode unlabeled video observation stream Stage 1 · SIGReg Encoder Pre-training L = L_InfoNCE + λ_geo · L_geo  ·  metric-preserving latent space No EMA target network · halves trainable params · bounds encoder Lipschitz constant Stage 2 · LeJEPA Predictor Pre-training Multi-step targets k ∈ {1,2,4,8,16}  ·  L_JEPA = ||f_θ(z_t,k) − sg[φ(s_{t+k})]||² Representations meaningful at multiple timescales · aligns with MAPA fast/slow memory split Frozen φ + initialized f_θ → MAPA runtime

Figure 4. Pre-training pipeline. SIGReg and LeJEPA are designed together to give MAPA's gating a metrically consistent latent space.

### The inference loop, step by step

At runtime the encoder and base predictor are frozen; the only thing that ever moves is the adapter. Each timestep runs the same seven steps:

1. Encode the observation: \(z_t = \varphi(s_t)\).
2. Pull the nearest landmark, \(\hat{L} = \arg\min_j \operatorname{sim}(z_t, L_j)\), to anchor the prediction.
3. Predict the next latent with the current adapter: \(\hat{z}_{t+1} = f_{\theta + \Delta\theta}(z_t, \hat{L})\).
4. Measure how wrong it was: \(\varepsilon_t = \|\hat{z}_t - z_t\|^2\).
5. If the surprise clears the threshold, \(\varepsilon_t > \tau(t)\), write the record to the buffer.
6. Assign it to a cluster and slide that centroid (C4).
7. If all three gate criteria hold, run the small LoRA update and lay down a new landmark.

Notice the asymmetry, because it is the point. Steps 1 through 4, including the landmark lookup, run every single step; the gate in step 7 fires maybe once in a few thousand, only when the world genuinely shifts. Almost all of MAPA's benefit at inference comes from that constant, cheap re-anchoring to what it already knows, not from the rare, expensive moments of learning something new.

---

## 10. MAPA is model-agnostic

Nothing about MAPA is wedded to LeWM. It asks only two things of whatever predictor it wraps: a fixed-dimensional latent space to work in, and a place to inject a LoRA adapter. That is it, and both hold right across the JEPA family. The long-horizon memory result rides on a metrically consistent latent space, which any SIGReg-style encoder supplies, not on any one model's internals.

| Base model | Latent dim | LoRA-injectable | MAPA-compatible | Notes |
| --- | --- | --- | --- | --- |
| LeWM (ViT-S) | 192 | Yes | Yes — reference impl | SIGReg encoder; end-to-end from pixels |
| V-JEPA 2 | 384 / 768 | Yes | Yes | Resize buffer entries to match dim |
| HWM low-level | 256 | Yes | Yes | Attach memory layer to low-level predictor |
| GPT-style LLM | variable | Yes | Partial | Buffer needs tokenization adapter |
| Diffusion model | n/a | No | No | No consistent latent; prediction objective incompatible |

The pairing that writes itself is HWM plus MAPA. Look back at Section 5: HWM steadies prediction *within* an episode by carving the horizon into subgoals, and MAPA carries knowledge *across* episodes by gated memory. They solve different halves of the same problem and never step on each other, so together they cover all five bottlenecks at once. The fit is even physical. MAPA's landmarks can tell HWM's planner what a region usually looks like from past visits, and HWM's subgoal boundaries hand MAPA ready-made anchor points to reset compounding error against. Two systems, different levels, one loop.

---

## 11. How to actually test this

A clean idea is worth little until it survives a fair fight, so the plan is six months built to give MAPA every chance to fail honestly. The protocol is preregistered on OSF before any ablation runs, which locks the metrics and baselines in advance so nothing can be quietly chosen after the fact. Every number comes from 10 independent seeds, varying the model's initialisation, the environment's reset schedule, and the order of change events. Comparisons use paired t-tests with Bonferroni correction, and anything that does not clear that bar is not reported as a result.

### Month 1: prove the disease before prescribing the cure

Before building anything, make the failure undeniable. Take a pretrained, stateless LeWM and walk it through controlled non-stationary video: lights drifting slowly, an object swapped out in an instant, a new room entered cold. Watch the prediction error climb, then send the sequence back to a scene it saw earlier and watch how much it has forgotten. Split the curves by the kind of change, sudden against gradual, reversible against permanent, small against large, so the diagnosis is specific rather than vague.

**Deliverable:** baseline forgetting curves by change type. One diagnostic figure that shows the stationarity problem as a measured fact, not a claim. It is the hook the whole paper hangs on: the failure made visible before anything is offered to fix it.

### Months 2–3: build it, then take it apart

Add components C2 through C7 one at a time, testing each on its own before wiring it into the whole. Then run the ablation that matters: pull each component out and measure what breaks, failure mode by failure mode. This is not table-filling. It is how the modularity claim gets tested for real. If removing the clustering step (C4) leaves return-visit performance untouched, then the story that C4 handles drift is wrong and has to be rewritten.

**Deliverable:** the memory-augmented LeWM module, a full ablation grid of components against failure modes, and the first head-to-head numbers against the stateless baseline.

### Month 4: the four baselines, and the experiment that decides everything

Each baseline exists to kill a specific objection before a reviewer can raise it.

- **Stateless LeWM** is the floor. No memory at all. Any memory mechanism has to clear it, and clear it convincingly.
- **Extended-context LeWM** is the "just give it more context" reflex. Same model, longer buffer. If MAPA wins here, it wins on structure, not on having more to look at.
- **Full fine-tuning with a replay buffer** is the strongest opponent, full weight updates over stored experience. MAPA should reach this without ever storing raw experience to replay.
- **Adaptive learning-rate schedule** is the "you just reinvented warm restarts" charge: a schedule that updates harder when error is high, blind to any cluster geometry. This is the one the central experiment is aimed at.

That central experiment is the matched-noise control, and it is where the whole thesis is won or lost. Build environments where a noise event and a real change produce the *exact same* error magnitude, the same \(\varepsilon_t\). The adaptive-LR baseline, seeing only magnitude, fires on both and corrupts itself on the noise. MAPA, reading the geometry, should fire on the real change, where observations pile into a tight cluster, and stay silent on the noise, which scatters. If that separation holds, the geometric gate is not a relabeled learning rate. It is doing something a learning rate provably cannot.

**Deliverable:** the full baseline table, the matched-noise result establishing gate selectivity, plus compute-matched and memory-matched ablations so neither resource can explain the win.

### Month 5: the long-horizon stress test

Now the hardest version of the claim. Put the agent in a multi-room world where the dynamics inside each room drift on their own, and let it wander out and come back. The question is blunt: can it keep predicting the room it is in without losing the rooms it left?

The contrast should be stark. The stateless model forgets room A while it is busy in room B, its curves sagging on return. The replay baseline holds on, but only by hauling gigabytes of raw frames. MAPA should hold on too, with bounded forgetting, on a landmark set and an adapter that together weigh kilobytes.

**Deliverable:** multi-room navigation results, forgetting curves under revisits, the dynamic-drift protocol, and return-visit performance curves.

### Month 6: a bound, and the paper

Finally, turn the empirical story into a guarantee. Model the predictor's latent dynamics as a perturbed ODE and apply a Gronwall-type inequality to bound how fast the adapted predictor can drift away from the true dynamics, as a function of gate selectivity and buffer size. A theorem to sit beside the curves.

**Deliverable:** an arXiv preprint, an open-source memory module that drops onto LeWM and V-JEPA 2, the forgetting bound in the appendix, and every seed, config, and dataset released.

---

## 12. Knowing whether it actually worked

A single aggregate score would hide more than it reveals. MAPA could lift average prediction while quietly wrecking one failure mode to rescue another, and you would never see it. So each metric below is pinned to a specific bottleneck, and they are read together. Only by watching all of them at once can you tell the difference between "this works" and "this robbed Peter to pay Paul."

### Primary prediction quality metrics

| Metric | What it measures | Target behavior | Why it matters |
| --- | --- | --- | --- |
| **Long-horizon prediction error**<br>`MSE(ẑ_{t+k}, z_{t+k})` at k=20,50,100 | Autoregressive compounding at rollout depth k | Error growth sub-linear in k; no divergence | Core quality metric. Directly measures the compounding bottleneck. |
| **Return-visit prediction error**<br>MSE on revisited scenes | Return visit degradation | Error at visit N+1 ≤ error at visit 1 | Direct measure of whether memory is being used productively. |
| **Forgetting curve AUC**<br>error(scene A) after N steps in scene B | Cross-scene forgetting rate | AUC lower than stateless baseline; bounded by theory | Multi-room test's primary outcome. Shows whether prior rooms are preserved. |

### Gate-specific metrics

| Metric | Definition | Target | What failure looks like |
| --- | --- | --- | --- |
| **Gate precision** | % of gate fires that correspond to genuine scene changes (as labeled in controlled environments) | >90% — gate fires only on real changes | Low precision = gate fires on noise = overwrites good representations |
| **Gate recall** | % of genuine scene changes that trigger a gate fire | >80% — doesn't miss real changes | Low recall = changes go unrecorded = model stays stale in changed environments |
| **Matched-noise precision** | Gate precision specifically on noise events matched in magnitude to real changes | >85% — geometry separates noise from change even when magnitude doesn't | Low = the tightness criterion is not working; the gate is magnitude-dependent not geometry-dependent |
| **Gate latency** | Steps from genuine change to first gate fire | <50 steps — fast detection, not stale adaptation | High latency = model operates with stale representations for too long after a real change |

### Memory efficiency metrics

| Metric | Definition | Target vs. baselines |
| --- | --- | --- |
| **Landmark count** | Number of consolidated landmarks in \(\mathcal{L}\) after N episodes | Sub-linear growth in episode count; each landmark represents a distinct scene region |
| **Memory footprint** | Total bytes: buffer + landmarks + LoRA adapter | <20MB at all times vs. replay buffer baseline (GB-scale) |
| **LoRA adapter drift** | \(\\|\Delta\theta_t - \Delta\theta_0\\|_F\) over time | Bounded, not diverging — confirms adapter isn't overwriting base knowledge |
| **Inference overhead** | Latency increase per step vs. stateless baseline | <5% — memory layer should not be a compute bottleneck |

### Hyperparameter sensitivity checks

Before claiming results, sweep the following and report performance stability:

| Parameter | Default | Sweep range | Instability signal |
| --- | --- | --- | --- |
| `α` (threshold multiplier) | 2.0 | 1.0 – 3.0 | Large perf swing: gate is brittle to threshold |
| `β` (EMA decay) | 0.95 | 0.9 – 0.99 | Centroid instability or slow drift detection |
| `τ_assign` (cluster threshold) | 0.85 | 0.75 – 0.95 | Fragmentation or merging of semantic regions |
| `N_min` (gate support) | 5–10 | 3 – 20 | Gate fires on flukes or misses genuine changes |
| `r` (LoRA rank) | 8 | 4 – 16 | Underfitting new scenes or catastrophic forgetting |

A result that only holds at one carefully chosen threshold is not a result, it is a coincidence. So the sweep over \(\alpha\) has to show MAPA beating the stateless baseline across the whole range, not just at the value that happened to be tuned. And because the protocol is preregistered, any departure from the declared hyperparameters has to be written down and justified, not quietly adopted because it scored well.

---

## Closing

The whole argument collapses to a short chain. Intelligence over long horizons is prediction. Prediction over long horizons needs memory. And memory, the kind that lasts, needs a gate: something that writes fast, consolidates slow, and refuses to let noise become permanent. The brain has run this design for hundreds of millions of years. Language models stumbled into it through the KV cache and retrieval. JEPA world models, for all their elegance, still have not built it.

What it takes to give them one turns out to be small. On top of LeWM: a surprise filter, an episodic buffer, an online clustering step, a three-part consolidation gate, a LoRA adapter, and a landmark set. Seven pieces, each answering one specific failure, adding 0.8% to the parameter count and under 20MB of state. The encoder never moves. The representations that cost so much to learn stay exactly as they were.

The claim is deliberately narrow. Not that this is enough for general intelligence, but that it is the smallest thing sufficient to keep a world model predicting across long horizons without forgetting and without a replay buffer. The six-month program exists to put that claim under real pressure: preregistered, run across many seeds, corrected for multiple comparisons, with ablations sharp enough to falsify any single component on its own.

If it holds, MAPA is a drop-in memory for any JEPA predictor that has to live in a changing world. If it fails, the ablation grid will say exactly which piece gave way and why, and that, too, is worth knowing. Either way, the field learns where the real bottleneck is.

## Architecture Breakdowns

Every design decision, justified from first principles

Fourteen questions that go below the surface of the MAPA architecture. Each answer traces the reasoning from first principles, compares alternatives, states the mathematical grounding, and names where the claim could fail. These are not summaries of the main piece — they are the working that justifies it.

[01How is \(z_t\) produced, and where does \(\hat{z}_t\) come from?](https://prigoistic.me/mapa/#bd-1) [02What is the landmark set actually doing — and how is it different from HWM subgoals?](https://prigoistic.me/mapa/#bd-2) [03How are \(z_t\) and \(\hat{z}_t\) compared — the math, the justification, and what SIGReg actually does](https://prigoistic.me/mapa/#bd-3) [04The adaptive threshold — mechanism, cold start, adaptivity, and validation](https://prigoistic.me/mapa/#bd-4) [05The episodic buffer — write mechanism, storage format, and cross-episode communication](https://prigoistic.me/mapa/#bd-5) [06Online streaming K-means — why K-means, why not better alternatives, the geometry, and the math](https://prigoistic.me/mapa/#bd-6) [07The consolidation gate — where the three criteria come from, their real-world validity](https://prigoistic.me/mapa/#bd-7) [08LoRA adapters — why LoRA and not EWC, GEM, replay, or other continual learning methods](https://prigoistic.me/mapa/#bd-8) [09The permanent landmark set — storage format, real implementation, and cross-episode persistence](https://prigoistic.me/mapa/#bd-9) [10Metrics and evaluation — JEPA benchmarks, MAPA-specific metrics, and why each one](https://prigoistic.me/mapa/#bd-10) [11The 6-month plan — reality-based, month by month](https://prigoistic.me/mapa/#bd-11) [12Why does LeWM use a plain ViT encoder and not a SIGReg-based one like LeJEPA?](https://prigoistic.me/mapa/#bd-12) [13Future optimizations — what changes after the 6-month baseline](https://prigoistic.me/mapa/#bd-13) [14Claims, sources, and mathematical grounding — what is proven, what is precedent, and what is hypothesis](https://prigoistic.me/mapa/#bd-14) [—Glossary](https://prigoistic.me/mapa/#glossary)

---

## 1. How is \(z_t\) produced, and where does \(\hat{z}_t\) come from?

The encoder \(\varphi\) and the predictor \(f_\theta\) are two separate networks running sequentially at every step. They are not parallel. The pipeline for a single timestep is strictly ordered:

1. Frame \(s_t\) arrives. Encoder computes \(z_t = \varphi(s_t)\). This is the current latent, a 192-dim vector.
2. Predictor takes \(z_t\) (plus the nearest retrieved landmark \(\hat{L}_t\)) and produces \(\hat{z}_{t+1} = f_\theta(z_t, \hat{L}_t)\). This is the prediction for the next step.
3. At step \(t+1\), the encoder produces \(z_{t+1}\) and we compare it against \(\hat{z}_{t+1}\) that was just stored.

So \(\hat{z}_t\) — the predicted latent for the current step — was produced one step earlier by the predictor operating on \(z_{t-1}\). You never compute \(\hat{z}_t\) and \(z_t\) at the same time. They come from different sources at different moments, which is why the error measurement makes temporal sense.

### The encoder architecture in LeWM

LeWM's encoder is a Vision Transformer (ViT) trained end-to-end from raw pixels with no external pretraining. It takes 16×16 patches of the input frame and produces a single 192-dim pooled representation. The training objective is:

\[\mathcal{L}_{\text{LeWM}} = \left\|f_\theta\!\left(z_t\right) - \operatorname{sg}\!\left[\varphi(s_{t+1})\right]\right\|^2\]

The stop-gradient \(\operatorname{sg}[\cdot]\) on the right side means the encoder is never directly optimized to move toward the predictor's output — only the predictor is trained to approach the encoder's output on the next frame. This is what prevents representation collapse without needing an EMA target network.

At MAPA inference time, \(\varphi\) is completely frozen. \(z_t\) for any given frame \(s_t\) is always the same value — deterministic, reproducible, never changing. The LoRA adapter only modifies \(f_\theta\), not \(\varphi\). This is what makes cross-episode comparison of \(z\) vectors meaningful: they live in a fixed, stable latent space.

**Takeaway** \(z_t\) comes from the frozen encoder at time \(t\). \(\hat{z}_t\) was produced by the predictor at \(t-1\). They are compared to measure how surprised the system is. The encoder runs once per frame, sequentially before the predictor.

---

## 2. What is the landmark set actually doing — and how is it different from HWM subgoals?

### The fundamental difference

HWM subgoals are *forward-looking*: abstract states the high-level planner wants to reach in the future, used to condition the low-level predictor on where to go next. They are computed fresh from the current state and plan at each episode.

MAPA landmarks are *backward-looking*: consolidated representations of places and scene configurations the model has already been to, retrieved from memory when the current observation resembles something previously consolidated. They tell the predictor not where to go but what it already knows about where it is.

### How a landmark is used at inference

At each step \(t\), the system finds the nearest landmark by cosine similarity:

\[\hat{L}_t = \arg\max_{L_j \in \mathcal{L}}\; \operatorname{sim}(z_t,\, L_j)\]

This retrieved landmark is concatenated with or added to \(z_t\) before it enters the predictor: \(f_\theta(z_t,\, \hat{L}_t) \to \hat{z}_{t+1}\). The predictor's input is augmented with a stable reference point from consolidated memory.

The effect on autoregressive compounding: without landmarks, the predictor is in pure free rollout mode and errors compound geometrically as \((1+\lambda)^N\). With landmark retrieval at every step, the predictor is never more than one step away from a re-anchor. It does not see a real observation, but it sees a geometrically stable reference derived from real observations that were fully consolidated. This reduces the effective drift rate without requiring episode interruption.

### What information the landmark actually carries

A landmark is a 192-dim centroid: the EMA-averaged latent position of a cluster of surprising observations that the gate determined were stable, novel, and coherent. It encodes the "typical" latent position of that scene configuration — a smoothed average of multiple observations of the same new thing. It does not encode pixel colors, specific object positions, or frame-level details. It encodes the semantic structure the encoder has learned: the kind of place this is at the level of abstraction LeWM operates at.

**Takeaway** Landmarks are past-consolidated scene centroids retrieved to anchor current predictions. HWM subgoals are future-planned goal states. The two are orthogonal — MAPA sits below HWM in a combined architecture, providing cross-episode memory while HWM provides within-episode planning.

---

## 3. How are \(z_t\) and \(\hat{z}_t\) compared — the math, the justification, and what SIGReg actually does

### The comparison metric

The error is computed as squared \(\ell^2\) distance in latent space:

\[\varepsilon_t = \left\|\hat{z}_t - z_t\right\|^2\]

This is the same objective as the JEPA training loss. It is not Fourier-based, not contrastive, not any special metric — plain \(\ell^2\). The reason \(\ell^2\) is valid here is not obvious and requires the SIGReg justification below.

### Why \(\ell^2\) in latent space needs SIGReg to be meaningful

In a generic neural network latent space, \(\ell^2\) distance means almost nothing semantically. Two very similar frames could map to latent vectors that are far apart; two very different frames could map to nearby latents. If that were true of \(\varphi\), then a large \(\varepsilon_t\) could mean either genuine scene change or arbitrary geometric distortion from the encoder — you could not tell which.

SIGReg fixes this by adding a geometric regularization term to the encoder training loss:

\[\mathcal{L} = \mathcal{L}_{\text{InfoNCE}} + \lambda_{\text{geo}} \cdot \mathcal{L}_{\text{geo}}\] \[\mathcal{L}_{\text{geo}} = \mathbb{E}_{i,j}\!\left[\bigl(\|\varphi(s_i) - \varphi(s_j)\| - d_{\text{obs}}(s_i, s_j)\bigr)^2\right]\]

The geometric loss penalizes any mismatch between latent distances and observation distances. It forces \(\varphi\) to be approximately isometric — to preserve relative distances between observations in latent space. As a consequence, the encoder's Lipschitz constant is bounded: it cannot stretch distances by more than a bounded factor, and it cannot collapse them to zero either.

Once the encoder is isometric, \(\ell^2\) in latent space is a faithful proxy for semantic distance in observation space. A large \(\varepsilon_t\) genuinely means the predicted scene and the actual scene are semantically far apart. A small \(\varepsilon_t\) means they are semantically similar.

### What the ECF / Fourier approach is for (and what it is not)

ECF (Energy-based Characteristic Functions) and Fourier approaches appear in some formulations of distribution matching for encoder training — they are used to compute \(d_{\text{obs}}(s_i, s_j)\) in the geometric loss, or to enforce distributional alignment of the encoder's output. This is an encoder training detail and does not appear at inference time. The inference comparison is always plain \(\ell^2\), justified by the encoder's trained isometry.

**Takeaway** \(\ell^2\) is used because SIGReg makes the latent space geometrically faithful. Without SIGReg, \(\ell^2\) would be semantically meaningless. The Fourier/ECF aspect of SIGReg is an encoder training detail, not the inference metric.

**Open question** How well \(d_{\text{obs}}\) is approximated matters. If the semantic distance measure used during training is wrong or incomplete, the isometry guarantee becomes noisy. Worth an ablation: train with vs without SIGReg and compare gate precision on the matched-noise experiment.

---

## 4. The adaptive threshold — mechanism, cold start, adaptivity, and validation

### What actually enters the threshold

Only the scalar \(\varepsilon_t\) enters. Not \(z_t\), not \(\hat{z}_t\), not their difference as a vector — just the single number that is their squared \(\ell^2\) distance. The threshold is a scalar comparison:

\[\tau(t) = \mu_W(t) + \alpha \cdot \sigma_W(t), \qquad \alpha = 2.0\]

where \(\mu_W(t)\) and \(\sigma_W(t)\) are the mean and standard deviation of the last \(W = 100\) error values. Any \(\varepsilon_t\) that clears this bar is deemed "surprising enough" and written to the buffer. Everything below is discarded.

Setting \(\alpha = 2.0\) targets the top ~2.3% of recent error values under a normal distribution assumption. This keeps the buffer sparse — most steps produce nothing — which is the intention.

### The cold start problem

For the first \(W = 100\) steps, there is no history window and \(\tau(t)\) cannot be computed. Three strategies:

- **Warmup write-all:** for the first 100 steps, write every observation to the buffer (\(\tau = 0\) effectively). Let the window fill before applying the adaptive rule. Simple but may flood the buffer with irrelevant data on a stable initial scene.
- **Pretraining statistics prior:** run LeWM on a held-out validation set during training and record the distribution of prediction errors. Use \(\mu_{\text{prior}}\) and \(\sigma_{\text{prior}}\) computed on this distribution as the initial window statistics. This starts the threshold at a sensible default before any deployment evidence arrives.
- **Growing window:** start with \(W = 10\), increase to \(W = 100\) as data accumulates. Noisy at first but avoids the warmup flood.

The recommended approach is option 2 combined with a short warmup: use pretraining statistics for the first 50 steps, then transition to the full rolling window.

### Why the threshold must be adaptive

As the LoRA adapter improves the predictor on a new scene, the average prediction error falls. A fixed threshold \(\tau\) would eventually sit above the typical error even for genuinely surprising events, causing the system to stop noticing changes it should notice. The rolling window ensures \(\tau\) tracks the predictor's current quality:

\[\text{As adapter improves:}\quad \mu_W \downarrow \;\Rightarrow\; \tau \downarrow \;\Rightarrow\; \text{sensitivity maintained}\]

The system stays alert to genuine surprise relative to its current competence, not relative to where it started. Without adaptivity, MAPA would gradually go blind in environments it has already learned well.

### Validation

The threshold is validated indirectly by the matched-noise experiment: if the adaptive threshold correctly admits real changes and rejects matched-magnitude noise events at the buffer write stage, the downstream gate has clean input. A miscalibrated threshold (too low: floods buffer with noise; too high: misses changes) shows up immediately in gate precision and recall metrics.

The \(\alpha\) sweep in the ablation tests robustness: if MAPA's advantage over the stateless baseline only holds at exactly \(\alpha = 2.0\), the mechanism is brittle. It should hold across \(\alpha \in [1.5, 3.0]\) if the design is sound.

**Takeaway** Only \(\varepsilon_t\) (a scalar) hits the threshold. Cold start is handled via pretraining statistics as a prior. Adaptivity is necessary because the predictor quality improves after each gate fire. The \(\alpha\) sweep validates that the design is not hand-tuned to one value.

---

## 5. The episodic buffer — write mechanism, storage format, and cross-episode communication

### It is not a key-value store

PAM uses a key-value store: write an observation in, retrieve the most similar stored observation when you see something similar later. The buffer IS the memory being read from.

MAPA's buffer does none of this. Nothing is ever retrieved from the buffer. It is a *signal accumulator* — a collection of recent surprising events whose geometric structure feeds the clustering and gate mechanisms. Once an observation has written in and contributed to a gate fire, its role is complete. The permanent memory lives in the landmarks and the LoRA adapter, not the buffer.

### The physical write mechanism

The buffer is a fixed-capacity ring buffer (circular array) of 2048 slots. Each slot holds one 5-tuple. When the buffer is full and a new surprising observation arrives, the eviction policy removes the entry with the lowest \(\varepsilon_t\) — the least surprising surviving entry. Highly surprising old entries survive longer than mildly surprising recent ones.

Each entry is a 5-tuple:

\[\bigl(z_t,\; a_t,\; z_{t+1},\; \varepsilon_t,\; \text{episode\_id}\bigr)\]

\(z_t\) and \(z_{t+1}\): current and next latent vectors — what the predictor needs for the LoRA update. \(a_t\): the action taken — needed because the predictor is action-conditioned. \(\varepsilon_t\): the surprise score — the eviction weight. \(\text{episode\_id}\): which episode this came from — required for cross-episode gate logic.

### How cross-episode memory works

This is the central structural difference from standard JEPA. The buffer does *not* flush at episode boundaries. Entries from episode 1, episode 5, and episode 23 coexist in the same buffer.

When an agent returns to scene A after visiting scenes B, C, D across episodes 2–4, new \(z_t\) observations of scene A cluster with old entries from episode 1. The clustering step (C4) assigns these new points to centroids that were seeded by the earlier episode. The support criterion in the gate then accumulates evidence across episodes: entries from episode 1 (4 observations) and episode 5 (3 observations) give total support = 7 across two distinct episodes. This cross-episode evidence is what allows the gate to fire on genuine scene structure rather than single-episode flukes.

The \(\text{episode\_id}\) field prevents a related failure: if a random single-episode cluster passes support and tightness, the gate can still reject it if all entries share the same \(\text{episode\_id}\). The implementation decision is whether to require at least 2 distinct episode IDs in a cluster before firing, or to weight support by distinct episodes rather than raw count.

**Takeaway** The buffer is a circular ring, not a KV store. It accumulates evidence for the gate, not memories to retrieve. Cross-episode communication works because the buffer persists across episode boundaries and each entry carries \(\text{episode\_id}\) metadata.

---

## 6. Online streaming K-means — why K-means, why not better alternatives, the geometry, and the math

### Why K-means specifically

The core requirement for MAPA's clustering step: given a stream of 192-dim latent vectors arriving one at a time, maintain a compact representation of their geometric structure in constant time per point. K-means with EMA centroid updates satisfies this exactly:

- **\(\mathcal{O}(K)\) per new point:** compare against \(K\) centroids, assign, update one centroid. With \(K = 8\text{–}16\) this is trivial.
- **The centroid IS the memory:** the centroid is directly usable as a landmark — a 192-dim vector in the same space as \(z_t\). No secondary representation needed.
- **EMA update is noise-robust:** \(\beta = 0.95\) smooths over individual noisy points without requiring batch processing.
- **Works with cosine similarity natively:** normalize centroids after each update, all comparisons become cosine similarity.

### Why not DBSCAN, GMM, spectral, or hierarchical

| Algorithm | Online streaming? | O(1) update? | Natural centroid? | Problem |
| --- | --- | --- | --- | --- |
| DBSCAN | No | No | No | Needs full density estimates, can't stream |
| GMM (EM) | No | No | Partially | EM requires multiple passes, batch E-step |
| Spectral | No | No | No | Requires O(N²) affinity matrix |
| Agglomerative | No | No | No | O(N² log N), purely batch |
| Online K-means | Yes | Yes | Yes | None for this use case |

### The data sparsity concern in SSL

SSL representations in JEPA are high-dimensional (192-dim) and the surprising observations written to the buffer are sparse. The cosine similarity assignment threshold \(\tau_{\text{assign}} = 0.85\) addresses this directly: if an incoming point is not within 0.85 cosine similarity of any existing centroid, it spawns a new cluster rather than being forced into an inappropriate one. This prevents the common K-means failure mode of assigning irrelevant points to the nearest (but semantically wrong) centroid.

### The geometric argument for why clustering detects real changes

This is the core claim, and it rests entirely on SIGReg's metric preservation.

When a real change happens — new object, layout shift, lighting change — \(\varphi\) maps multiple observations of this new configuration to a tight region of latent space. Because SIGReg trained \(\varphi\) to be approximately isometric, similar things in the world map to nearby latent vectors. Multiple views of the same new scene configuration are "similar in the world" by definition, so they map to nearby latent vectors. Their cluster is geometrically coherent.

When noise happens — rendering stochasticity, compounding error spike, sensor jitter — the cause is random perturbation with no consistent semantic content. Different noise events map to random locations in latent space (by SIGReg: random perturbations in observation space produce random displacements in latent space). The cluster is geometrically dispersed.

\[\text{Real change:}\quad \operatorname{tightness}(k) = \frac{1}{n_k}\sum_i \|z_i - c_k\|^2 \;\text{ is \emph{small}}\] \[\text{Noise:}\quad \operatorname{tightness}(k) \;\text{ is \emph{large} (random scatter)}\]

The EMA decay \(\beta = 0.95\) gives each centroid an effective memory of approximately \(1/(1-0.95) = 20\) timesteps. The centroid represents a smoothed average of recent similar events, not a snapshot of one. This is exactly what catches gradual drift: each observation slightly displaces the centroid, and the accumulated displacement \(\|c_{k,t} - c_{k,0}\|\) becomes measurable over time.

**Takeaway** Online K-means streams in \(\mathcal{O}(K)\) time and the centroid is directly the stored landmark. The geometric detection of real changes vs noise depends entirely on SIGReg's metric preservation — without it, the tightness discriminator fails.

---

## 7. The consolidation gate — where the three criteria come from, their real-world validity

### Why three criteria and not one

Each criterion blocks a specific failure mode. Drop any one and a different class of bad update gets through. They are not redundant — they are orthogonal gates blocking orthogonal failure modes.

### Criterion 1: \(\operatorname{support}(k) \geq N_{\min}\) — enough evidence

Origin: hypothesis testing. To distinguish a true cluster from a random coincidence of points, you need sufficient sample size. With too few observations, the tightness estimate is unreliable — 2 or 3 points can appear tight by chance. \(N_{\min} = 5\text{–}10\) is the minimum sample size for the tightness estimate to be statistically reliable.

Biological analogue: hippocampal long-term potentiation requires repeated synaptic activation, not a single event. One stimulus does not create long-term memory.

Validation: in controlled experiments, the gate should have near-zero false positives when \(N_{\min}\) is set correctly. The \(N_{\min}\) sweep in the ablation study tests sensitivity.

### Criterion 2: \(\operatorname{tightness}(k) \leq \sigma^2_{\max}\) — geometrically coherent

Origin: the geometric structure of SIGReg-trained latent spaces. Real changes produce tight clusters; noise produces dispersed ones. This is the central discriminator — the one the matched-noise experiment is specifically designed to test.

\[\operatorname{tightness}(k) = \frac{1}{n_k}\sum_{i=1}^{n_k} \|z_i - c_k\|^2 \leq \sigma^2_{\max}\]

\(\sigma^2_{\max}\) is calibrated from the pretraining data: compute the average within-class variance across semantic categories in the training set. This gives a data-driven estimate of what "tight" means for LeWM's specific latent geometry.

Validation: construct environments where noise events produce the same \(\varepsilon_t\) as real changes. An adaptive learning-rate baseline (no access to cluster geometry) cannot separate them. MAPA's gate should pass real changes (tight clusters) and block noise (dispersed clusters). If this separation holds, criterion 2 is validated. If it does not, SIGReg's metric preservation is insufficient and needs strengthening.

### Criterion 3: \(\operatorname{novelty}(k) \geq \delta_{\text{novel}}\) — genuinely new

Origin: information theory. Consolidating already-known information has zero information gain and wastes a LoRA update. If the new cluster centroid is similar to an existing landmark, the scene it represents is already in memory.

\[\operatorname{novelty}(k) = \min_{j}\; \operatorname{sim}(c_k,\, L_j) \leq 1 - \delta_{\text{novel}}\]

If the minimum similarity to any existing landmark is high, the cluster is not novel — it matches known territory. Only clusters sufficiently far from all existing landmarks trigger an update.

Validation: over many episodes, the landmark set grows until it covers the agent's environment. The novelty criterion should naturally drive the gate-fire rate toward zero as the agent becomes familiar with its world. A healthy system shows declining gate-fire frequency over time in a fixed environment — directly measurable as the "gate fire rate" metric.

**Takeaway** The three criteria are orthogonal: \(\operatorname{support}\) blocks statistical flukes, \(\operatorname{tightness}\) blocks geometric noise, \(\operatorname{novelty}\) blocks redundant updates. Each has an independent experimental validation. Dropping any one degrades a different metric.

---

## 8. LoRA adapters — why LoRA and not EWC, GEM, replay, or other continual learning methods

### What MAPA needs from a weight update mechanism

Three hard requirements:

1. **Base knowledge must be perfectly preserved**, not just approximately. Any degradation of the frozen encoder's semantic structure breaks the entire gating mechanism.
2. **Updates must be reversible**. If a bad gate fire corrupts the adapter, it must be possible to reset without losing the core model.
3. **Memory overhead must be fixed and small** regardless of how many gate fires occur.

### Why every alternative fails at least one requirement

| Method | Base preserved? | Reversible? | Fixed memory? | Why not |
| --- | --- | --- | --- | --- |
| Full fine-tuning | No | No | Yes | Overwrites θ. Next gate fire overwrites previous learning. Catastrophic forgetting by construction. |
| EWC | Penalized | No | Yes | Requires computing Fisher Information Matrix (FIM) — expensive. Still changes base weights, just more slowly. FIM computation needs a dataset pass. |
| GEM / A-GEM | No | No | Grows | Requires exemplar buffer that grows. QP solve per update. Still updates base weights. |
| Progressive Networks | Yes | No | Grows | New columns added per task. Memory grows linearly with gate fires. Cannot bound footprint. |
| PackNet | Pruned | No | Yes | Prunes weights between tasks. Fixed capacity shared between old and new. Reduces expressivity. |
| LoRA | Yes — frozen | Yes — reset BA to 0 | Yes — r(d_in+d_out) | Satisfies all three requirements. |

### The unique advantage of LoRA's structure

\[\Delta\theta = B \cdot A, \qquad A \in \mathbb{R}^{r \times d_{\text{in}}},\; B \in \mathbb{R}^{d_{\text{out}} \times r},\; r = 8\]

The base \(\theta\) is not penalized, not regularized, not slowly decayed — it is completely frozen. The isolation between \(\theta\) and \(\Delta\theta\) is total. Multiple consecutive gate fires accumulate in \(\Delta\theta\) (matrices \(B\) and \(A\) absorb each update additively). If \(\Delta\theta\) becomes corrupted or overfits, it can be zeroed out exactly, restoring the original predictor, with zero effect on \(\theta\).

The parameter count is \(2 \times r \times d\) per adapted layer. At \(r=8\) and \(d \approx 192\): \(2 \times 8 \times 192 = 3072\) parameters per layer, roughly 0.8% of the predictor's total. This is fixed regardless of how many episodes have elapsed or how many gate fires have occurred.

### Is there a better choice?

Hypernetworks for continual learning (generating adapter weights from context) are an interesting alternative but require a separate hypernetwork (significant overhead) and are harder to interpret. AdaLoRA (adaptive rank selection) could improve parameter efficiency by allocating more rank to layers that need it — a valid optimization direction for Month 5.

**Takeaway** LoRA is the correct choice because it provides total base-weight isolation, reversibility, and fixed memory overhead — requirements that EWC, GEM, and full fine-tuning all fail. It is the only standard continual learning method that preserves \(\theta\) completely.

---

## 9. The permanent landmark set — storage format, real implementation, and cross-episode persistence

### What it actually is in memory

The landmark set is a `torch.Tensor` of shape `[N_landmarks, 192]` held in RAM during the MAPA session. It is not written to a database, not stored in a key-value store, not serialized per-step. It lives in working memory alongside the LoRA adapter weights.

Each landmark is \(192 \times 4\) bytes \(= 768\) bytes. Storage scales linearly:

\[10 \text{ landmarks} \approx 7.5\,\text{KB} \qquad 100 \approx 75\,\text{KB} \qquad 1000 \approx 750\,\text{KB}\]

Even 10,000 landmarks = 7.5 MB. The entire MAPA memory system (buffer + landmarks + LoRA adapter) stays under 20 MB.

### How it persists across episodes

The landmark set is initialized *once* when the MAPA wrapper is instantiated, before episode 1 begins. It is never flushed, never reset, never cleared between episodes. When the agent finishes episode 5 and starts episode 6, the landmark set from episodes 1–5 is fully intact and available for retrieval. The gate's novelty criterion (\(\operatorname{novelty}(k) \geq \delta_{\text{novel}}\)) ensures the set does not grow indefinitely with redundant copies — each landmark represents genuinely new territory.

### Retrieval at scale

Retrieval is \(\mathcal{O}(N_{\text{landmarks}} \times 192)\) per step: cosine similarity against all landmarks, argmax. For \(N < 500\) this is negligible. For large \(N\), approximate nearest neighbour search (FAISS IVF-PQ, ScaNN, or HNSW) reduces this to \(\mathcal{O}(\log N)\) with a small accuracy trade-off. FAISS IVF-PQ supports dynamic insertion of new landmarks without full rebuild, making it the recommended choice for long-running deployments.

### In a real LeWM implementation

The MAPA wrapper sits around the LeWM module. Schematically:

`MAPAWrapper(encoder=lewm.encoder [frozen ref], predictor=lewm.predictor, lora=LoRAAdapter(r=8), landmarks=LandmarkSet(), buffer=EpisodicBuffer(cap=2048), kmeans=OnlineKMeans(K=16, τ=0.85, β=0.95), gate=ConsolidationGate(N_min=5, σ²_max=0.1, δ_novel=0.15))`

The encoder is a frozen reference, not a copy. Landmarks are \(N \times 192\) float32 tensors on CPU. The LoRA adapter lives on GPU alongside the predictor. Buffer entries (192 × 5 tuples × float32) total ~7.5 MB on CPU.

### Serialization for persistent deployment

The landmark set and LoRA adapter can be serialized to disk (pickle, safetensors, or HDF5) for deployment scenarios where memory must survive power cycles. Loading them restores the agent's accumulated knowledge exactly. The buffer does not need serialization — it is transient and refills after a few hundred surprising steps.

**Takeaway** The landmark set is a RAM tensor, persisted across episodes by never being flushed. Storage is kilobytes to low megabytes. For large \(N\), FAISS enables sub-millisecond retrieval. Serialization to disk enables persistent memory across deployment sessions.

---

## 10. Metrics and evaluation — JEPA benchmarks, MAPA-specific metrics, and why each one

### What actually exists — corrected picture

Earlier versions of this document claimed no benchmarks existed for world model memory. That was wrong. A set of relevant benchmarks have been published in 2025–2026, and one in particular is directly targeting the problem MAPA addresses.

### MIND — the closest existing benchmark

**MIND: Benchmarking Memory Consistency and Action Control in World Models** (arXiv 2602.08025, February 2026) is the first open-domain closed-loop benchmark specifically measuring memory consistency in world models. It contains 250 high-quality 1080p videos across 8 diverse scenes, covering both first-person and third-person viewpoints under shared and varied action spaces. The two core evaluation axes:

- **Memory consistency:** does the world model remember what it generated in earlier frames when producing new ones? Tests temporal stability and contextual coherence across a single generation rollout.
- **Action control:** does the model generalise correctly across different character movement speeds and camera rotation angles?

MIND is the right benchmark to report MAPA results on. It is, however, testing *within-episode* memory — whether the model stays consistent across frames inside a single generation. This is not the same as what MAPA introduces. MAPA's claim is about *cross-episode* memory — whether knowledge from episode 1 makes predictions in episode 5 more accurate. MIND does not test this. MAPA needs to extend it.

### Other relevant benchmarks (2025–2026)

| Benchmark | What it tests | Relevance to MAPA | Limitation for MAPA |
| --- | --- | --- | --- |
| **MIND** (Feb 2026) | Memory consistency + action control in world models | Direct — memory in world model generation | Within-episode only, not cross-episode |
| **WorldPrediction** | JEPA models identifying actions explaining state transitions | JEPA-native evaluation, VL-JEPA baseline exists | Action understanding, not memory persistence |
| **V-JEPA 2 physical reasoning benchmarks** (June 2025) | Motion understanding (SSv2), action anticipation (Epic-Kitchens), video QA | JEPA-native, strong baselines to compare against | Single-episode, no cross-episode memory |
| **WBench** (May 2026) | Multi-turn interactive video world model evaluation | Tests world model over multiple interactions | Multi-turn within a session, not cross-episode |
| **Out of Sight, Out of Mind** (Mar 2026) | State evolution in video world models — does model track objects that leave frame? | Tests a form of memory: off-screen state persistence | Object-level state, not scene-level cross-episode |
| **LMEB** (Mar 2026) | Long-horizon memory embedding evaluation | Memory retrieval accuracy and latency | Text-based, not latent-space video prediction |
| **AMA-Bench** (Feb 2026) | Long-horizon memory for agentic applications | Agentic memory retention, close in spirit | Agent policy memory, not world model predictor memory |
| **Calvin Kitchen** | 5 consecutive long-horizon robot tasks | Long-horizon task chaining | No explicit episode reset or return-visit test |
| **Push-T** | 2D manipulation success rate | HWM planning baseline | Single episode, no memory |

### The gap that still exists

The benchmarks above — including MIND — test memory *within* a single generation or session. None of them test the specific capability MAPA introduces: whether a world model predictor that has visited a scene in episode 1 is more accurate about that scene in episode 5. This **cross-episode predictor memory** gap is real and still open.

MAPA's Month 5 multi-room return-visit protocol is designed to fill this gap. The correct positioning is: evaluate on MIND as the closest existing standard, then extend with the return-visit protocol to demonstrate the cross-episode capability that MIND cannot test. If this protocol is rigorous enough, it becomes a standalone benchmark contribution of its own.

For LLM memory analogues: LongMemEval and LoCoMo test recall accuracy and latency across conversation sessions. The MAPA equivalent measures prediction accuracy improvement across environment episodes. Same structural idea, different modality.

### Why standard video prediction metrics don't apply to MAPA

The standard video generation metrics — FVD (Fréchet Video Distance), SSIM, PSNR, LPIPS — all operate in pixel space. MAPA operates entirely in latent space. There are no generated pixels to compare against. This is not a limitation to work around; it is a feature. Pixel fidelity is exactly what JEPA's design rejects as a training objective. Using FVD to evaluate MAPA would be like grading a translation on how similar the ink looks rather than whether the meaning was preserved.

Additionally, research published in 2025 found that pixel-prediction quality metrics (PSNR, FVD, LPIPS) are largely orthogonal to action recoverability in world models — high FVD score does not predict whether the representation encodes the scene dynamics that matter for planning. Reporting pixel metrics for MAPA would be not just inapplicable but actively misleading.

### The right framework: continual learning metrics, adapted to prediction

MAPA is a continual learning system for world model predictors. The appropriate metric framework comes from continual learning literature, specifically the BWT/FWT decomposition which separates forgetting from transfer. These metrics were designed exactly for the stability-plasticity tradeoff MAPA is navigating.

#### Backward Transfer (BWT) — the forgetting metric

In standard continual learning, BWT measures how much performance on old tasks degrades after learning new ones. Adapted for MAPA's prediction setting, where lower error is better:

\[\text{BWT}_{\text{MAPA}} = \frac{1}{S-1}\sum_{i=1}^{S-1}\bigl(\varepsilon_{S,i} - \varepsilon_{i,i}\bigr)\]

where \(\varepsilon_{j,i}\) is the prediction error on scene \(i\) after visiting scene \(j\). \(\varepsilon_{i,i}\) is performance immediately after first consolidating scene \(i\). \(\varepsilon_{S,i}\) is performance on scene \(i\) at the very end of training, after visiting all \(S\) scenes.

**BWT > 0**: forgetting — error on old scenes increased after seeing new ones. Bad.
 **BWT ≤ 0**: no forgetting or positive backward transfer — old scenes actually improved. Good.
 **Target for MAPA:** BWT significantly below the stateless baseline (which has BWT ≈ 0 trivially, since it never updates). MAPA's LoRA updates should not increase error on old scenes.

**Why this metric:** BWT is the standard measure of catastrophic forgetting and directly validates MAPA's core claim that LoRA updates do not overwrite prior knowledge. If BWT is positive, the adapter is interfering with previously consolidated scene representations. This would require revisiting the gate's novelty criterion or the contrastive sampling design.

#### Forward Transfer (FWT) — the generalisation metric

FWT measures whether exposure to previous scenes helps on future ones:

\[\text{FWT}_{\text{MAPA}} = \frac{1}{S-1}\sum_{i=2}^{S}\bigl(\varepsilon_{\text{stateless},i} - \varepsilon_{i-1,i}\bigr)\]

\(\varepsilon_{\text{stateless},i}\) is the stateless LeWM's prediction error on scene \(i\) with no prior context. \(\varepsilon_{i-1,i}\) is MAPA's prediction error on scene \(i\) having already visited scenes \(1\) through \(i-1\).

**FWT > 0**: positive transfer — prior scenes helped on the new one. Good.
 **FWT ≤ 0**: no transfer — exposure to prior scenes gave no benefit on a new one.

**Why this metric:** FWT tests whether MAPA's landmarks generalise beyond exact scene matches. If the agent visited ten different office environments, MAPA should perform better on an eleventh office environment than a stateless baseline would — because the adapter and landmarks encode office-type dynamics that transfer. If FWT is near zero, the memory is too specific (overfitting to individual scenes) rather than learning structure that transfers.

#### Latent Prediction MSE at rollout depth — the compounding metric

\[\varepsilon_k = \operatorname{MSE}\!\bigl(\hat{z}_{t+k},\, z_{t+k}\bigr) \quad \text{at } k \in \{1, 5, 20, 50, 100\}\]

Measured on held-out scenes not in the training set. Plot \(\varepsilon_k\) vs \(k\) as a rollout curve. Target: sub-linear growth. Failure: exponential growth past \(k = 20\), indicating autoregressive compounding without landmark anchoring.

**Why this metric:** This is the direct measure of MAPA's solution to bottleneck 1 (autoregressive compounding). The landmark retrieval anchors predictions; this metric shows how far the rollout can go before error diverges. Compare MAPA's rollout curve against stateless LeWM's — the gap is the benefit of landmark anchoring.

#### Return-Visit Performance Ratio (RVPR) — the memory utility metric

\[\text{RVPR}_N = \frac{\varepsilon_{\text{visit }N}}{\varepsilon_{\text{visit }1}}\]

Prediction error on the \(N\)-th visit to a scene, relative to the first visit. Target: RVPR \(< 1.0\) by visit 3 and declining. This is the practical face of BWT — a system with good BWT will show improving RVPR. A system with zero BWT and zero FWT (stateless) has RVPR \(\approx 1.0\) forever.

**Why this metric:** RVPR is what a practitioner cares about. BWT is the mathematical decomposition; RVPR is the intuitive reading of it. "Does the robot get better at predicting room X each time it visits?" If yes, memory is working. This should be the headline figure in the paper.

#### Stability-Plasticity score (SP-score)

The stability-plasticity dilemma is the fundamental tension in continual learning: a system that updates aggressively adapts fast (high plasticity) but forgets quickly (low stability). A system that barely updates forgets nothing (high stability) but can't adapt (low plasticity). MAPA's gate is designed to navigate this. A single number that captures the trade-off:

\[\text{SP-score} = \frac{\text{Plasticity} \times \text{Stability}}{(\text{Plasticity} + \text{Stability})/2}\]

where Plasticity = \((1 - \text{normalized FWT loss})\) and Stability = \((1 - \text{normalized BWT loss})\), each normalised to [0, 1] across all baselines. SP-score is the harmonic mean — it penalises extreme sacrifice of either property. A system that does well on one while failing the other gets a low SP-score even if the average is high.

**Why this metric:** The stateless baseline has perfect stability (BWT ≈ 0, it never forgets because it never updates) but zero plasticity. Full fine-tuning has high plasticity but terrible stability. MAPA's SP-score should be higher than both — moderate-to-high plasticity and maintained stability. If MAPA's SP-score is not above the stateless baseline, its memory mechanism is not helping.

#### Gate Selectivity Score (GSS) — validating the gate's core claim

\[\text{GSS} = \text{Precision}_{\text{gate}} \times \text{Recall}_{\text{gate}}\]

Measured specifically on the matched-noise experiment: environments where noise events produce identical \(\varepsilon_t\) to genuine scene changes. Precision: fraction of gate fires that correspond to genuine changes. Recall: fraction of genuine changes that trigger a gate fire. Target: Precision \(> 0.9\), Recall \(> 0.8\), GSS \(> 0.72\).

**Why this metric:** GSS validates the tightness criterion — the thing that makes MAPA different from an adaptive learning rate. If GSS is near random on the matched-noise experiment, the geometric gate is not working and the entire MAPA architecture needs revision. This is the single metric that most directly tests the central claim.

### Metrics NOT to use and why

| Metric | Why it seems relevant | Why it's wrong for MAPA |
| --- | --- | --- |
| **FVD (Fréchet Video Distance)** | Standard video model benchmark | Pixel-space metric. MAPA produces no pixels. Inapplicable. |
| **SSIM / PSNR** | Video quality measures | Pixel-space. Orthogonal to action recoverability. Misleading for JEPA. |
| **Classification accuracy** | Standard continual learning metric | MAPA is not a classifier. Prediction error is the right analogue. |
| **Perplexity / BLEU** | LLM memory benchmark metrics | Language-domain. Not applicable to latent video prediction. |
| **Reward curves (RL)** | Agent performance over time | MAPA is a world model, not a policy. It predicts, does not act. |

### Memory system health metrics — operational monitoring

| Metric | Formula / measurement | What it tells you | Target |
| --- | --- | --- | --- |
| **Gate fire rate** | Fires per 1000 steps | Should decline over time as environment is explored. High sustained rate = gate is too sensitive or environment is highly non-stationary. | Declining curve; near zero in familiar environments |
| **Landmark growth rate** | \(\Delta N_{\text{landmarks}}\) per episode | Should decelerate as novelty is exhausted. Sustained linear growth means the novelty criterion is too loose. | Sub-linear growth, asymptoting |
| **LoRA adapter Frobenius drift** | \(\\|\Delta\theta_t - \Delta\theta_0\\|_F\) | Should grow then plateau. Unbounded growth means adapter is not converging; the gate is firing on unstable clusters. | Bounded plateau |
| **Memory footprint** | Buffer + landmarks + LoRA in MB | Validates the "no replay buffer" claim. Must be tractable on device. | \(< 20\) MB at all times |
| **Inference latency overhead** | Step latency vs stateless LeWM | Landmark retrieval adds \(\mathcal{O}(N \times 192)\) per step. Must remain deployable. | \(< 5\%\) overhead |

**Takeaway** The five primary metrics are: BWT (forgetting), FWT (generalisation), latent MSE rollout curve (compounding), RVPR (practical memory utility), and GSS (gate validity). These are grounded in the continual learning literature and directly tied to MAPA's five failure modes. Pixel-space metrics (FVD, SSIM, PSNR) are inapplicable. The SP-score summarises the stability-plasticity tradeoff in a single comparable number. Gate health metrics monitor whether the memory system is operating correctly without being the headline result.

---

## 11. The 6-month plan — reality-based, month by month

The honest time budget for this project: roughly 60–80 hours of irreplaceable focused research work over 6 months. That is approximately 10–13 hours per month of high-quality work — not calendar time, not compute time, not read-and-review time. Actual design, implementation, debugging, and analysis. The plan below is calibrated to that reality, not to an imaginary full-time research team.

Compute time (running experiments, waiting for seeds) is separate and can happen in parallel. The constraint is focused human decision-making time, which cannot be parallelised.

### A word on Bonferroni before the plan

Every comparison in MAPA's experiments is a hypothesis test. Run enough tests and one will produce a false positive purely by chance. If you run \(K\) tests each at significance level \(\alpha\):

\[P(\text{at least one false positive}) = 1 - (1-\alpha)^K \approx K\alpha\]

With 20 comparisons at \(\alpha = 0.05\): \(P \approx 64\%\). Bonferroni correction fixes this by testing each comparison at \(\alpha / K\) instead. For 20 tests: threshold = 0.0025. This requires Cohen's \(d > 1.2\) to achieve significance with 10 seeds — a real bar. If MAPA's advantages are real, they clear it. If they only show up at \(\alpha = 0.05\), the effect is too small to claim.

All comparisons in the plan below are preregistered on OSF before the ablation phase begins. Any deviation from the preregistered metrics or analysis plan is documented in an appendix.

---

### Month 1 — Understand the disease before writing the prescription

*~12 hours focused work. Mostly running experiments and reading outputs carefully.*

The only job this month is to make the failure modes concrete and measurable. Every number that comes out of Month 1 becomes the baseline the rest of the paper argues against. If this baseline is sloppy, the entire argument is built on sand.

**What gets done:**

1. **Environment setup (~3h):** Get LeWM running on the target compute. Verify it reproduces published prediction quality numbers. Choose the evaluation environment — MiniHack multi-room is the default; if it doesn't give clean controllable scene transitions, switch to a custom GridWorld wrapper. Don't spend more than one week deciding. Pick and move.
2. **Failure mode protocol design (~2h):** Design 3 controlled change types: (a) gradual illumination drift over 200 steps, (b) sudden object swap at a specific timestep, (c) new room entry. Each at two magnitudes — small and large. This gives 6 conditions total.
3. **Baseline experiments (~4h + compute):** Run stateless LeWM through each condition. 5 seeds minimum. Log \(\varepsilon_t\) at every step. After each change event, run 300 more steps then return to the original scene and measure prediction error on return. This is the return-visit test.
4. **Analysis and documentation (~3h):** Plot forgetting curves for each condition. Compute RVPR (return visit error / first visit error) for each. These numbers are the paper hook — they need to be striking enough to motivate the problem.

**Expected outputs:** Gradual drift → smooth monotonic error rise. Abrupt change → step function spike. Return visit → 3–7× error relative to first visit. If RVPR is less than 2×, either the environment is too simple or LeWM is already partially handling it — investigate before proceeding.

**Biggest risk:** LeWM setup takes longer than expected, eats into experiment time. Mitigation: use the first two weeks purely for environment setup. If still not working by week 2, use a smaller JEPA implementation as a proxy and note it in the paper.

**Month 1 deliverable** Baseline forgetting curves across 6 conditions, RVPR measured for each. One diagnostic figure that makes the failure undeniable. This is the paper's Figure 1.

---

### Month 2 — Build C2, C3, C4 and fix the two correctness issues

*~15 hours focused work. Most technically dense month — implementation with no margin for sloppiness.*

This is the hardest implementation month. Three components get built, unit-tested independently, and then integrated. Two correctness issues identified in Q13 get fixed here rather than deferred — because fixing them later means re-running all experiments.

**What gets built:**

1. **C2 — Adaptive threshold filter (~3h):** rolling window of size \(W=100\), compute \(\mu_W + 2\sigma_W\), filter \(\varepsilon_t\). Handle cold start with pretraining statistics as prior for the first 100 steps. Unit test: verify buffer write rate is ~2–3% of steps on a stable scene, spikes to ~20–30% immediately after a scene change.
2. **C3 — Episodic buffer (~5h):** ring buffer of 2048 slots storing 5-tuples \((z_t, a_t, z_{t+1}, \varepsilon_t, \text{episode\_id})\). Implement cluster-aware eviction (Q13 fix 1): tag each entry with its current cluster assignment; evict from the largest cluster first. Implement running support counter (Q13 fix 2): each centroid tracks total historical observation count and distinct episode IDs seen, persisting even after buffer entries are evicted. Unit test: verify cross-episode entries coexist; verify eviction protects small emerging clusters.
3. **C4 — Online K-means (~5h):** assign incoming \(z_t\) by cosine similarity with threshold \(\tau_{\text{assign}} = 0.85\), EMA update \(\beta = 0.95\), spawn new cluster if no match. Implement with the running counter per centroid from C3. Unit test: verify tight clusters on repeated Room X observations, verify dispersed clusters on noise inputs.
4. **C2+C3+C4 integration (~2h):** wire together, run one full episode, verify the data flow from encoder output to buffer write to cluster assignment is correct end-to-end.

**Biggest risk:** The LoRA injection into LeWM's predictor (coming in Month 3) is architecturally tricky. Spend 1–2 hours this month reading LeWM's predictor code and confirming exactly where the adapter will be inserted. Do not start implementing it yet, just confirm the insertion point exists and is accessible.

**Month 2 deliverable** C2, C3, C4 implemented with unit tests passing. Cluster-aware eviction and running support counter built in. No integration with the full system yet — that's Month 3.

---

### Month 3 — Build C5, C6, C7, first end-to-end run, first ablation table

*~15 hours focused work. First moment the full system is alive.*

**What gets built:**

1. **C5 — Consolidation gate (~4h):** three-criterion check using the running counter from C3 (support), within-cluster variance (tightness), and cosine similarity to existing landmarks (novelty). Calibrate \(\sigma^2_{\max}\) from LeWM's pretraining data — run the pretrained encoder over a validation set and compute average within-class variance across semantic categories. This gives a data-driven threshold rather than a hand-tuned one.
2. **C6 — LoRA adapter (~5h):** wrap LeWM's predictor with a LoRA adapter at rank \(r=8\). This is the highest-risk component. The adapter needs to be injected at the right layer, the base weights must be frozen, and the update step (20 Adam steps on 32 buffer entries) must only modify \(B \cdot A\). Verify by checking that \(\|\theta_{\text{after}} - \theta_{\text{before}}\|_F = 0\) and \(\|\Delta\theta_{\text{after}} - \Delta\theta_{\text{before}}\|_F > 0\) after an update.
3. **C7 — Landmark set (~2h):** torch.Tensor of shape \((N, 192)\) on CPU. Retrieval by argmax cosine similarity. Write one centroid per gate fire.
4. **Full integration (~2h):** wire all 7 components into the MAPA wrapper. Run one full episode through the complete pipeline. Verify gate fires occur, landmarks are written, adapter updates happen correctly.
5. **First ablation results (~2h):** remove one component at a time (\(-C5\), \(-C7\), \(-C4\)), run 3 seeds per condition on the Month 1 environment. Not the full ablation — a quick sanity check that each component is doing something. If removing C5 makes no difference, something is wrong with the gate implementation.

**Biggest risk:** The LoRA adapter update corrupts the predictor instead of improving it — prediction error gets worse after a gate fire. If this happens, check: (1) learning rate too high, (2) 32 entries are not representative (buffer might have class imbalance), (3) stop-gradient missing on \(z_{t+1}\) target. Debug before moving to Month 4.

**Month 3 deliverable** Full MAPA system running end-to-end. Sanity ablation showing each component contributes. First head-to-head numbers against stateless LeWM on Month 1's failure modes.

---

### Month 4 — Full ablation table + baseline comparison + matched-noise control

*~12 hours focused work. Mostly designing experiments and interpreting results. Compute runs in background.*

This is the month where the central claim is tested for real. The matched-noise control is the single most important experiment in the paper — it either validates the geometric gate or exposes that MAPA is just an adaptive learning rate in disguise.

**Full ablation (~4h design + compute):** 7 conditions × 5 failure modes × 10 seeds = 350 conditions. Most of this is compute. The focused work is: setting up the 350 runs correctly, verifying they start without errors, then analyzing the results table. Statistical analysis: paired t-tests per ablation × metric pair, Bonferroni correction across 35 pairs (\(\alpha = 0.05/35 = 0.00143\)).

**4 baselines (~3h design + compute):**

- **Stateless LeWM:** the floor. Every experiment is measured against this.
- **Extended-context LeWM:** longer episode buffer matching MAPA's 20MB budget. Tests whether "just add context" achieves the same result — the expected first rebuttal from a reviewer.
- **Full fine-tuning + replay buffer:** full weight updates using stored \(z_t\) vectors. Same memory budget. The strongest possible baseline — if MAPA doesn't beat this while using less memory, the efficiency claim fails.
- **Adaptive learning-rate schedule:** LR increases when \(\varepsilon_t\) is high, decreases when low. No cluster geometry. The direct test of whether the gate is doing something beyond "update more when error is high."

**Matched-noise control (~3h design + compute):** Build an environment where a calibrated noise source produces prediction errors equal in magnitude to genuine scene changes: \(\|\varepsilon_{\text{noise}}\|^2 \approx \|\varepsilon_{\text{change}}\|^2\). Run both MAPA and the adaptive-LR baseline on this environment. Measure gate precision for each. MAPA's gate should suppress noise (dispersed clusters, tightness fails); adaptive-LR fires on both. If MAPA also fires on noise here, the tightness criterion is not working and needs recalibration — raise \(\sigma^2_{\max}\) or increase \(N_{\min}\).

**Analysis (~2h):** Compile the full results table. Compute compute-matched ablation (MAPA vs a larger stateless LeWM that uses the same inference FLOPs) and memory-matched ablation (MAPA vs replay buffer at the same MB budget). These close the two obvious reviewer objections.

**Month 4 deliverable** Full ablation table across all 7 conditions and 5 metrics. Baseline comparison showing MAPA vs 4 competitors. Matched-noise experiment result. This is the core results section of the paper.

---

### Month 5 — Multi-room stress test + first optimizations

*~13 hours focused work. Half implementation (environment + optimizations), half experiment design and analysis.*

This is the hardest test of the long-horizon claim. The single-room experiments in Months 1–4 show MAPA works in isolation. The multi-room test shows it doesn't break when the agent must maintain models of multiple scenes simultaneously.

**Multi-room environment (~4h):** Build a 5-room navigation world on top of MiniHack or a simple custom GridWorld. Each room has distinct visual dynamics. The agent transitions between rooms by passing through doorways. Room dynamics drift at 1% per 100 episodes — slow enough to be undetectable in a single visit but measurable across 10 visits. If building from scratch takes more than 4 hours, use a simplified 3-room version and note it as a limitation.

**Return-visit experiment (~3h design + compute):** Agent runs 200 steps per room, 10 full rounds (100 room transitions total, each room visited 10× over the full run). Measure: RVPR curve per room across visits 1–10, forgetting rate for room A while agent is in rooms B–E, gate-fire rate per room over time (should approach zero as rooms are consolidated), drift detection when room dynamics have shifted by 10%.

**Expected picture:** Stateless LeWM — RVPR climbs to 3–5× by visit 5, no improvement with return visits. Full fine-tuning + replay — RVPR near 1 but ~1GB memory. MAPA — RVPR below 1.3 at <20MB, gate-fire rate declining toward zero as each room is consolidated.

**Two key optimizations (~4h):** Implement hierarchical LoRA adapters (coarse rank-4 + fine rank-4) as a Month 5 ablation — test whether separated timescales improve RVPR. Implement contrastive buffer sampling for the LoRA update and test whether it reduces gate-fire rate on already-consolidated rooms (fewer spurious re-consolidations).

**Month 5 deliverable** Multi-room return-visit results. RVPR curves across 10 visits per room. Gate-fire rate decay curves. Two optimization ablations. If RVPR doesn't improve with visits 1→10, the landmark retrieval mechanism is not working as expected — investigate before Month 6.

---

### Month 6 — Theoretical bound, paper, and open-source release

*~10 hours focused work. Split evenly between theory derivation and writing.*

The theory bound does two things: it gives the paper a second contribution beyond the empirical results, and it makes the forgetting guarantees precise rather than observational.

**Forgetting-rate bound (~5h):** Model the predictor as a dynamical system with LoRA perturbation. The adapted predictor has effective Lipschitz constant \(L_f + \delta\) where \(\delta\) is the adapter's contribution. With the gate firing every \(T\) steps:

\[\text{Forgetting rate} \leq \frac{(L_f + \delta)^T - 1}{T} \cdot \varepsilon_0 + \mathcal{O}(\delta_{\text{gate}})\]

Gronwall's inequality bounds the divergence between the adapted predictor and the true dynamics as a function of \(L_f + \delta\) and the gate's false-positive rate \(\delta_{\text{gate}}\). The bound is tight when the gate is well-calibrated (low \(\delta_{\text{gate}}\)) and the adapter is small (low \(\delta\)). This is the theoretical guarantee that distinguishes MAPA from "just update more" approaches — the bound depends on gate quality, not just update frequency.

**Paper and release (~5h):** Write the paper with the biological interpretation as a secondary theoretical contribution. Release the MAPA module as open-source, compatible with LeWM and V-JEPA 2. Release all seeds, configs, and dataset generation scripts. Submit to arXiv.

**Month 6 deliverable** arXiv preprint. Open-source MAPA module. Forgetting-rate bound in appendix. All experimental code and seeds released. The paper is done when reviewers can reproduce every number in the results table from the released code without contacting the authors.

---

### The honest risk table — what derails this and what to do

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| LoRA injection into LeWM corrupts predictor | Medium | High — blocks Month 3 | Spend 2h in Month 2 locating exact injection point. Test with rank-1 adapter first before rank-8. |
| Matched-noise experiment: MAPA also fires on noise | Medium | High — invalidates central claim | Recalibrate \(\sigma^2_{\max}\) and \(N_{\min}\). If tightness criterion fundamentally doesn't separate — revisit SIGReg encoder training quality. |
| LeWM environment setup takes 3+ weeks | Low-Medium | Medium — delays Month 1 results | Use a smaller proxy JEPA if LeWM is blocked. Note it as a limitation. |
| RVPR doesn't improve with more visits in Month 5 | Low | High — cross-episode claim fails | Check landmark retrieval: are landmarks actually being fed to predictor? Check if SIGReg training is producing metrically consistent space. |
| 10-seed ablation doesn't pass Bonferroni threshold | Medium | Medium — weakens statistical claims | Accept that effects are smaller than expected. Report means and CIs honestly. Do not inflate claims. |
| Multi-room environment build takes too long | Medium | Low — Month 5 delayed but not blocked | Use 3-room instead of 5-room. Scope down before cutting the experiment entirely. |

**Takeaway** 60–80 hours of focused work over 6 months is the real budget. The matched-noise control in Month 4 is the single experiment that decides whether the paper's central claim holds. Everything else is context for it. Months 2 and 3 are the most technically risky — the LoRA injection and gate calibration are where unknown unknowns hide. Months 4–6 are mostly running the system that was built in 2–3.

---

## 12. Why does LeWM use a plain ViT encoder and not a SIGReg-based one like LeJEPA?

This question exposes a gap the main MAPA document glosses over. The short answer: LeWM does not use SIGReg because LeWM does not need it. MAPA does — and that means MAPA is not using LeWM out of the box. It is proposing a specific modification to LeWM's encoder training that the original paper never required. Unpacking why leads to a clearer understanding of what SIGReg is actually for and why the distinction matters.

### What LeWM's goal is and why SIGReg is irrelevant to it

LeWM's sole job is to learn to predict the next latent representation from the current one, as stably and accurately as possible. The encoder \(\varphi\) needs to produce representations that are *predictable* — that have enough structure for the predictor to learn from. It does not need the latent space to be metrically consistent. It does not care whether cosine similarity between arbitrary latent pairs means anything semantically. The prediction loss does not depend on this.

The collapse problem — the risk that the encoder maps everything to the same point, making prediction trivial but useless — is the one geometric property LeWM does care about. Standard JEPA solves this with an EMA (exponential moving average) target encoder: a slowly updating second copy of the encoder whose outputs serve as the training target, preventing the primary encoder from collapsing toward a constant. LeWM solved this differently: by designing a two-term loss (InfoNCE contrastive term + prediction term) and an asymmetric architecture that prevents collapse without a separate target network. No SIGReg required. The result is a self-contained system that trains stably on a single GPU from raw pixels.

### What SIGReg actually enforces and why LeWM doesn't have it

SIGReg adds a geometric regularization term on top of the contrastive loss during encoder training:

\[\mathcal{L}_{\text{geo}} = \mathbb{E}_{i,j}\!\left[\bigl(\|\varphi(s_i) - \varphi(s_j)\| - d_{\text{obs}}(s_i, s_j)\bigr)^2\right]\]

This loss penalizes any mismatch between distances in latent space and distances in observation space. It enforces \emph{isometry}: the encoder must approximately preserve relative distances from the observation space into the latent space. As a consequence, the encoder's Lipschitz constant is bounded from above and below — it cannot stretch or collapse distances by more than a bounded factor.

LeWM's encoder, trained without this term, may learn representations that are metrically distorted relative to observation space. Two semantically similar scenes could map to distant latent vectors if that happens to make prediction easier; two dissimilar scenes could map to nearby latents if their dynamics happen to be similar. From LeWM's perspective, this is fine — prediction quality is unaffected by this geometric distortion. The loss never penalizes it.

### Why MAPA needs SIGReg but LeWM does not

MAPA's clustering and gating mechanism makes a specific claim that depends entirely on the latent space being metrically consistent: *tight clusters in latent space correspond to semantically coherent scene configurations*. If this is false, the tightness criterion in the gate cannot separate real changes from noise, and the entire MAPA architecture fails at the step it depends on most.

Specifically: at step C4 (K-means clustering), MAPA assigns surprising \(z_t\) vectors to clusters by cosine similarity and uses within-cluster variance (tightness) as the discriminator between real change and noise. This works only if:

- Multiple observations of the same new scene configuration map to *nearby* latent vectors (tight cluster).
- Random noise events — which have no consistent semantic content — map to *dispersed* latent vectors (loose cluster).

The first point is guaranteed by SIGReg: if \(\varphi\) is approximately isometric, then similar observations in the world produce nearby latent vectors. Without SIGReg, this is not guaranteed. LeWM's encoder might happen to satisfy it empirically for most scenes, or it might not. There is no training objective enforcing it. MAPA's gate would be unreliable on a native LeWM encoder in ways that cannot be predicted without running the matched-noise experiment.

### What this means for the MAPA implementation

MAPA as proposed is not a wrapper around LeWM with no changes to the base model. It requires a modified encoder training procedure. The ViT architecture can stay identical; what changes is the training objective:

\[\underbrace{\mathcal{L}_{\text{LeWM}} = \mathcal{L}_{\text{InfoNCE}} + \mathcal{L}_{\text{pred}}}_{\text{no metric preservation}} \quad\longrightarrow\quad \underbrace{\mathcal{L}_{\text{MAPA}} = \mathcal{L}_{\text{InfoNCE}} + \lambda_{\text{geo}}\,\mathcal{L}_{\text{geo}}}_{\text{SIGReg: metric-preserving}}\]

The predictor training (LeJEPA multi-step targets) runs second, on top of the SIGReg-trained encoder. The encoder is then frozen. From this point forward, both LeWM's predictor and MAPA's memory layer operate in a latent space where cosine similarity is semantically meaningful — a property the original LeWM never required or enforced.

### The open empirical question

It is not known in advance how much metric distortion LeWM's native encoder has. If LeWM's representations happen to be approximately metrically consistent — because the combination of InfoNCE contrastive loss and prediction loss implicitly encourages metric structure — then the MAPA gate might work acceptably on a native LeWM encoder without SIGReg. If not, gate precision on the matched-noise experiment will degrade substantially.

This makes the SIGReg ablation a high-priority experiment for Month 2. Two conditions:

- **Condition A:** MAPA with SIGReg encoder. The baseline claimed in the proposal.
- **Condition B:** MAPA with native LeWM encoder (no SIGReg). Tests whether the metric preservation assumption is actually necessary in practice.

If Condition B performs within 5% of Condition A on gate precision and RVPR, the SIGReg modification may not be worth the added training complexity. If Condition B shows substantially worse gate precision — especially on the matched-noise experiment — SIGReg is confirmed as necessary and the modified encoder training is non-optional.

### Why LeJEPA uses SIGReg and LeWM does not

LeJEPA and LeWM are separate research efforts with different design goals. LeJEPA (or the "Le-JEPA" family more broadly) introduced SIGReg as an alternative to EMA target networks, showing that geometric regularization can provide the same collapse-prevention guarantee more efficiently — halving trainable parameter count by removing the shadow encoder. LeWM solved the same collapse problem through its asymmetric two-loss design without needing either EMA or SIGReg. Both solutions work for their stated goals. MAPA borrows LeWM's parameter efficiency and trains-from-scratch simplicity, but needs to add SIGReg from the LeJEPA side to satisfy the metric consistency requirement that MAPA's memory architecture depends on.

**Takeaway** LeWM does not use SIGReg because LeWM has no geometric requirement on its latent space — it only needs to predict, not cluster. MAPA imposes a new requirement (cosine similarity must be semantically meaningful) that LeWM's encoder was never trained to satisfy. MAPA therefore requires a modified encoder training objective. Whether native LeWM representations are "close enough" is an empirical question resolved by the SIGReg ablation in Month 2.

---

## Glossary

Every mechanism in this document rests on a set of ideas that are rarely explained where they appear. Each entry below starts from the problem the idea was designed to solve, traces how it works mechanically, and ends at what it means for MAPA specifically. They are ordered so each one builds on what came before.

### Representations and latent space

Raw sensor data is structured wrong for reasoning. A 224×224 video frame is 150,000 numbers, and most of them are irrelevant to what is actually happening. Two frames of the same kitchen taken from slightly different angles share almost no pixel values but mean the same thing. A system that reasons at the pixel level drowns in coincidental surface differences.

An encoder — a neural network — maps each raw input to a compact vector in ℝd, typically d = 128 to 1024. This vector is the **representation** or **latent code**, and the space those vectors live in is the **latent space**. What makes this useful is the property good encoders learn: semantically similar inputs map to nearby vectors, semantically different inputs map to distant ones. Two frames of the same room at different times land close together. A frame of a car park lands far away — without any labels ever specifying which is which. The geometry is inferred from the statistics of data during training.

Representations are also *abstractions*. The 192 numbers in MAPA's latent code do not store pixel values or positions. They encode learned structure — object-like regions, motion patterns, scene layout — distilled into an address in a space where meaning and distance are the same thing.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/5.svg)

Diagram labels: frame A₁ kitchen · angle 1 frame A₂ kitchen · angle 2 frame B₁ car park · noon Encoder φ s ↦ z ∈ ℝ¹⁹² LATENT SPACE  ℝ¹⁹² A₁ A₂ same place, different view → close together B₁ different scene → far apart large distance

The encoder collapses irrelevant variation — exact pixel values, viewing angle, lighting — and preserves what stays meaningfully the same. Distance in latent space becomes semantic distance.

**In MAPA** Every component — the adaptive threshold, the K-means clustering, cosine similarity checks, the landmark set — operates entirely in the 192-dimensional latent space φ produces. SIGReg pre-training enforces that geometric distances in this space track real-world distances, which is what makes the gate's tightness criterion trustworthy.

### Frozen encoder

Training a good encoder takes enormous compute and data. The result is a function that has learned to organize experience into a coherent geometric structure. The risk in any downstream task: if you let the encoder keep training, the new task's loss will gradually reshape those representations to serve its objective, destroying the geometry that made them useful in the first place.

Freezing the encoder means setting `requires_grad = False` on every encoder parameter. The forward pass is completely unchanged — inputs flow through, representations come out. But during backpropagation, gradients stop at the encoder's boundary. No parameters update. From the optimizer's perspective, the encoder is a fixed lookup table: deterministic, stable, impossible to overwrite. Any two observations of the same scene will always produce the same latent vector, episode after episode, year after year.

In MAPA, this stability is load-bearing. Every comparison the system makes — current z_t versus a landmark, two cluster centroids drifting, predicted versus observed representation — is valid precisely because the coordinate system never shifts underneath the comparison.

### Stop gradient

Self-supervised learning trains a network to learn without labels by making it compare its own outputs. The obvious formulation: encode the same input two ways and minimize the distance between the results. This fails immediately. The network discovers a degenerate solution: map every input to the same single vector. Distance everywhere is zero. Loss is minimal. Nothing was learned. This is **representational collapse**.

Stop gradient, written `sg[·]` or `.detach()` in PyTorch, is a one-way mirror in the computation graph. In the forward pass it is an identity: `sg[x] = x`, the value passes through unchanged. In the backward pass, the gradient is zero — everything behind this point is invisible to backpropagation.

In JEPA the target side of the prediction loss is stopped:

\[\mathcal{L} = \bigl\| f_\theta(z_t) \;-\; \operatorname{sg}\!\left[\varphi(s_{t+1})\right] \bigr\|^2\]

The predictor f_θ receives gradients and trains to chase the target representation. The encoder on the right side produces the target but is completely invisible to this loss — it cannot drift to make the target easier to reach. Collapse is blocked: there is no gradient path that rewards sending everything to one point without the predictor having genuinely solved the prediction problem.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/6.svg)

Diagram labels: FORWARD PASS s_t Encoder φ 🔒 FROZEN z_t Predictor f_θ trainable ẑ_{t+1} Loss ‖ẑ − sg[z]‖² s_{t+1} Encoder φ 🔒 FROZEN sg[ · ] stop gradient z_{t+1} BACKWARD PASS  (gradients) ∇ flows through predictor ✕ gradient stops at sg[ · ] — and frozen encoder sees nothing

Top path: the trainable predictor forward and backward. Bottom (target) path: same frozen encoder, but stop-gradient erases the backward signal before it can reach anything. Gradients only touch the predictor.

**In MAPA** The encoder is frozen *and* the JEPA training target uses stop gradient — a double lock. No training signal from any loss can modify the latent space that MAPA's gate logic depends on.

### Teacher–student networks

The general paradigm that stop gradient and EMA both belong to. One network — the **teacher** — provides training targets; the other — the **student** — is trained to match them. The loss trains only the student. Gradients never reach the teacher. This asymmetry is the whole point: targets the gradient cannot reach cannot be trivially gamed.

The teacher can take many forms. In **knowledge distillation** it is a large pretrained model, completely frozen, whose soft output distributions the student is trained to replicate — compressing a bigger model's knowledge into fewer parameters. In **EMA architectures** (below) the teacher is a slowly-updated shadow copy of the student itself. In JEPA, the frozen encoder acting as target-provider is effectively the teacher; the predictor is the student. The design principle is the same across all three: separate the target-provider from the learner so that learning has something stable to aim at.

### EMA target network

Stop gradient blocks collapse but leaves a stability problem. The target is produced by the same encoder the student is updating. Each gradient step shifts the online encoder, which shifts the targets it produces, which shifts the loss landscape again. The student is chasing a goalpost that moves every batch.

The EMA fix maintains two encoder copies. The **online encoder** is updated by gradient descent every batch. The **target encoder** never receives a gradient — it is updated only by an exponential moving average of the online encoder's weights:

\[\theta_{\text{target}} \;\leftarrow\; m\,\theta_{\text{target}} \;+\; (1-m)\,\theta_{\text{online}}\]

With m ≈ 0.996–0.999 the target network moves roughly 0.4% toward the online network each step. It embodies the online encoder's state over the last ~250 steps rather than its current state — a slow, temporally smoothed ghost that provides stable targets. Used in BYOL, MoCo v3, and early JEPA variants.

The cost is real: double the encoder's parameter count and forward-pass memory, plus a sensitive momentum hyperparameter. LeWorldModel — and therefore MAPA — replaces this entirely with SIGReg, a geometric regularization loss that prevents collapse structurally by constraining the encoder's latent space to preserve real-world distances. A space that preserves distances cannot collapse. No shadow network needed.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/7.svg)

Diagram labels: Online Encoder θ_online · updated every step by ∇ Target Encoder θ_target · no gradient ever EMA update each step θ_t ← m·θ_t + (1–m)·θ_online ∇ gradient ✕ no gradient Loss predictor vs. target encoder slow ghost of the online network — stable targets, smooth loss

The target encoder is a temporally smoothed copy of the online network, updated by EMA and never by gradients. It provides stable prediction targets while the online encoder trains freely.

### Linear probe

After training an encoder without labels, you want to know if it learned anything semantically meaningful. Fine-tuning the whole network would answer the wrong question — it would measure trainability, not the quality of the representations before any supervised signal was applied.

A linear probe answers the right question. Freeze the encoder entirely. Attach a single linear layer — one weight matrix, one bias, no hidden layers, no nonlinearities:

\[\hat{y} = W \cdot z + b \qquad z = \varphi(x) \;\text{frozen}\]

Train only W and b on a labeled dataset. A linear layer cannot manufacture information that isn't already in z — it can only re-weight and linearly recombine what the encoder placed there. If it correctly classifies, the answer was already present in z in a linearly accessible form. The encoder solved the hard part before any label was introduced.

High linear probe accuracy is the benchmark for self-supervised representation quality. It means the latent space has the *linear separability property*: geometric structure in the space directly reflects semantic structure in the world. That is the same property MAPA's cosine similarity and tightness criterion depend on.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/8.svg)

Diagram labels: Input x (image/video) Encoder φ 🔒 FROZEN requires_grad = False z 192-dim Linear  W only this layer trains ŷ ∇ gradient flows through linear W only ✕ frozen encoder sees no gradient at all

The frozen encoder maps inputs to representations. The linear layer — the only part that trains — can only re-weight what the encoder already placed in z. If it succeeds, the structure was already there.

### Contrastive learning and InfoNCE

Without labels, what should the encoder learn to put close together? Contrastive learning defines similarity structurally. Two augmented views of the same input — different random crops, colour jitter, brightness shifts — form a **positive pair**. Every other sample in the batch is a **negative**. The loss pushes positives together and negatives apart.

Because positives are different-looking versions of the same underlying input, the encoder is forced to discard whatever changes between augmentations — exact pixel values, minor colour, precise crop position — and keep only what stays invariant: object identity, scene layout, semantic structure. The geometric organization of latent space is shaped entirely by invariance, without any labels.

\[\mathcal{L}_{\text{InfoNCE}} = -\log \frac{\exp\!\left(\operatorname{sim}(z_i,\, z_j)/\tau\right)}{\displaystyle\sum_{k=1}^{N} \exp\!\left(\operatorname{sim}(z_i,\, z_k)/\tau\right)}\]

z_i and z_j are the two views of the same input (the positive pair). The sum runs over all N samples — the other N−1 are negatives. The loss is minimised when the positive pair's similarity is high relative to all negatives. Temperature τ controls sharpness: lower τ forces harder separation between positives and negatives.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/9.svg)

Diagram labels: input x (same image) aug 1 aug 2 Encoder φ shared weights Encoder φ shared weights z_i z_j positive pair — pulled together z_k negative z_k negative pushed apart pushed apart

Two augmented views of the same image form a positive pair and are trained to converge in latent space. Other samples in the batch are negatives and are pushed away. The encoder learns structure through contrast, no labels required.

**In MAPA** The encoder is pre-trained with *L = L_InfoNCE + λ_geo · L_geo*. InfoNCE shapes the semantic clustering; the SIGReg geometric term additionally forces that structure to respect real-world distances — the property the consolidation gate depends on.

### LoRA — Low-Rank Adaptation

Adapting a pretrained model to new data via full fine-tuning risks catastrophic forgetting: the gradient signal for the new task overwrites parameters that encoded the base model's prior knowledge. It is also expensive — updating every parameter for every gate fire at inference time is not viable.

The key observation is that most meaningful adaptations live in a low-dimensional subspace of the full weight space. You rarely need every weight to change independently; you need a structured update along a small number of directions. Instead of modifying W ∈ ℝd × d directly, freeze W and learn two smaller matrices whose product becomes the update:

\[\Delta W = B \cdot A \qquad B \in \mathbb{R}^{d_{\text{out}} \times r},\;\; A \in \mathbb{R}^{r \times d_{\text{in}}},\;\; r \ll d\]

The effective weight at inference is W + BA. Base weights never change. With d = 192 and r = 8, each layer's update has 2 × 192 × 8 = 3,072 free parameters instead of 192 × 192 = 36,864 — a 12× reduction in the size of the update. B is initialised to zero, so ΔW starts at zero and the model begins from exact base weights, deviating only as the adapter is trained.

Because W is untouched, it is recoverable at any point: discard B and A and the original model is exactly intact. The adaptation is isolated, inspectable, and fully reversible.

![Diagram](https://prigoistic.me/assets/diagrams/mapa/10.svg)

Diagram labels: W d × d matrix (192 × 192) 🔒 FROZEN never updated + B  (d × r) d×r × A  (r × d) r × d ΔW = BA · rank r=8 3,072 params per layer · LEARNED = W + BA effective weight at inference base knowledge + new dynamics drop BA → original W recovered

LoRA decomposes the weight update into two thin matrices whose product has rank r. The base weights W are never touched. The adaptation is fully reversible — discard B and A and the original model is exactly intact.

**In MAPA** C6 applies LoRA with rank r = 8 to the predictor. The ~120,000 parameters in B and A across all layers (~0.8% of the predictor) absorb every weight change from a gate fire. The base predictor's 15M parameters — its understanding of general scene dynamics from pre-training — are preserved exactly regardless of what the adapter accumulates over the system's lifetime.

### Cosine similarity

In high-dimensional spaces, Euclidean distance is unreliable as a measure of semantic closeness. Two vectors can be far apart in Euclidean terms simply because one has larger magnitude — longer, but pointing in exactly the same direction. For representations, magnitude is usually an artifact of normalization rather than meaningful signal. What matters is direction.

\[\operatorname{sim}(a, b) = \frac{a \cdot b}{\|a\| \cdot \|b\|}\]

Dividing out both magnitudes makes the measure scale-invariant — only the angle between the vectors matters. The result runs from −1 (opposite directions) through 0 (orthogonal, unrelated) to 1 (identical direction). Two representations pointing the same way score near 1 regardless of how far from the origin either vector happens to sit.

**In MAPA** C4 assigns each incoming z_t to the nearest cluster centroid using cosine similarity with threshold τ_assign = 0.85. A score of 0.85 corresponds to an angle of roughly 32° — in 192 dimensions, a tight constraint meaning the representations are pointing in nearly the same semantic direction. Below 0.85, the observation is different enough to spawn a new cluster rather than update an existing one.

### Lipschitz continuity

Autoregressive prediction feeds the model's output back as its next input. Any error in step t becomes part of the input to step t+1, so errors can amplify. To characterize exactly how fast, you need a bound on how much the predictor can stretch small input differences into larger output differences. That bound is the Lipschitz constant.

A function f is L-Lipschitz if for any two inputs x and y:

\[\|f(x) - f(y)\| \;\leq\; L \cdot \|x - y\|\]

L is the maximum stretch factor across all input pairs. L = 1 preserves distances — errors neither grow nor shrink. L < 1 contracts them. L > 1 means errors can grow by up to L per step; over k autoregressive steps the worst-case error compounds as ε_0 · L^k. Writing L_f = 1 + λ makes the per-step growth explicit: at λ = 0.02 the error after 100 steps is 7× the original; at λ = 0.05 it is 131×. These are not edge cases — they describe the regime real JEPA predictors operate in.

**In MAPA** SIGReg training bounds the encoder's Lipschitz constant as a structural consequence of the metric-preservation loss — an encoder constrained to preserve real-world distances cannot have an arbitrarily large L_f. MAPA's landmark re-anchoring at every inference step is mechanically a periodic reset of the predictor's input to a known-good representation, which prevents accumulated drift ε_0 from ever growing large enough for (1+λ)^k to matter.

---

## 13. Future optimizations — what changes after the 6-month baseline

The 6-month plan delivers a working, principled baseline. It is not the final architecture. Several components have known limitations that become engineering priorities after the baseline is validated. Here is what changes, why, and when it matters.

### Cluster-aware buffer eviction — the most important near-term fix

The current buffer uses surprise-weighted LRU: the least surprising entry gets evicted first. This has a structural flaw. The gate's support criterion needs a cluster to accumulate enough members before firing. But outlier entries — the most surprising — are by definition geometrically isolated. They are the entries that survive longest under surprise-weighted eviction, even though they contribute the least to cluster formation. The entries that matter most for the gate (those forming tight emerging clusters) can get evicted early if their surprise score is moderate.

The fix: **cluster-aware eviction**. Instead of evicting by surprise score alone, evict by cluster membership:

- Evict entries from the *largest* clusters first. Those clusters already have enough support — losing a few members doesn't hurt the gate.
- Protect entries from *small emerging clusters*. Those are the ones that haven't yet reached \(N_{\min}\) and need every member to survive to pass support.

This requires the buffer to know which cluster each entry belongs to at eviction time — meaning the clustering step must tag each buffer entry with its current cluster assignment. Small implementation cost, meaningful improvement to gate sensitivity on low-frequency events. This is a Month 2–3 implementation decision during the ablation phase.

### Running centroid support counter — fixing cross-episode support tracking

The current support criterion counts buffer entries currently assigned to a cluster. If old entries from episode 1 were evicted when the buffer filled in episodes 2–4, the cluster appears to have low support when the agent returns in episode 5, even though it was well-evidenced in episode 1. The gate fails to fire on a genuine return visit because it cannot see the historical evidence.

The fix: each cluster centroid maintains a persistent running counter of total observations ever assigned to it, plus a set of distinct episode IDs that contributed:

\[\text{support}(k) = \text{historical\_count}(k), \quad \text{episodes}(k) = \{\text{ep\_id}_1, \text{ep\_id}_2, \ldots\}\]

Gate support criterion becomes: \(\text{historical\_count}(k) \geq N_{\min}\) AND \(|\text{episodes}(k)| \geq 2\). This fires on genuine cross-episode evidence and stays silent on single-episode flukes, even after the original buffer entries have been evicted. The counter persists as long as the centroid exists — trivial memory overhead (two integers per cluster).

### Hierarchical LoRA adapters — separating timescales of adaptation

The current single rank-8 adapter absorbs all adaptations — both environment-level changes (new room type, new object density) and scene-level changes (specific object positions, current layout). These operate at different timescales and updating one can degrade the other.

The fix: two stacked adapters with different ranks:

- **Coarse adapter (rank 4):** updates slowly, only on gate fires with high support and strong novelty. Captures environment-level dynamics — room type, lighting regime, object density class.
- **Fine adapter (rank 4):** updates on every gate fire. Captures scene-level dynamics — specific positions, current layout, transient configurations.

Total parameters stay the same (2 × rank-4 = same as rank-8) but the two timescales are now architecturally separated. An abrupt scene change fires the fine adapter immediately without disturbing the coarse representation of environment type. This mirrors HWM's two-level hierarchy applied to the adapter rather than the planner.

### Contrastive buffer sampling for LoRA updates

The current LoRA update pulls 32 random entries from the raw cache of the triggering cluster. All 32 entries are positive examples — observations of the same new thing. This risks the adapter collapsing toward a mode that fits only the trigger cluster, reducing its generalization to the broader scene.

The fix: contrastive sampling. When collecting the 32 entries for an update, include:

- **Positive pairs (20 entries):** observations from the triggering cluster — what the adapter is learning about.
- **Hard negatives (12 entries):** observations from other clusters in the same environment — semantically related but distinct. These prevent the adapter from overfitting to the trigger cluster at the expense of nearby scene structure.

The LoRA update objective becomes contrastive: minimize prediction error on positives, maintain prediction quality on hard negatives. This is a direct analogue of hard-negative mining in metric learning, applied to the adapter update step.

### Landmark graph — enabling relational queries

The current landmark set is an unstructured flat array. Retrieval is argmax cosine similarity — "which landmark is most similar to my current \(z_t\)?" This answers "where am I?" but not "how did I get here?" or "which landmarks are nearby in semantic space?"

The fix: at consolidation time, when a new landmark \(L_{\text{new}}\) is written, compute its cosine similarity against all existing landmarks and add edges to the top-\(k\) most similar ones above a connectivity threshold. The result is a sparse proximity graph:

\[\mathcal{G} = (V, E), \quad E = \{(L_i, L_j) : \operatorname{sim}(L_i, L_j) > \theta_{\text{graph}}\}\]

Retrieval becomes graph traversal: find the nearest landmark, then traverse edges to semantically adjacent landmarks. This enables multi-hop relational queries — "what do I know about regions adjacent to where I am?" — and supports the kind of spatial reasoning that hippocampal grid cells enable: not just place recognition but relational navigation.

This is a Month 5+ optimization. The flat array suffices for the baseline, but the graph becomes necessary as \(N_{\text{landmarks}}\) grows into the hundreds.

### Drift velocity estimation — proactive re-consolidation

The current system is purely reactive: it consolidates when surprised. It has no mechanism for predicting when an existing landmark is about to become stale.

The fix: track the rate of centroid movement per episode for each cluster. Define drift velocity as the distance the centroid moves per episode visit:

\[v_k = \|c_{k,\text{episode }n} - c_{k,\text{episode }n-1}\|\]

High \(v_k\) means this scene is changing quickly — the landmark will go stale soon. The system can proactively lower the gate's novelty threshold for this cluster, making it easier to trigger a re-consolidation update before the prediction error has time to grow. This converts MAPA from purely reactive (update when surprised) to partially predictive (update when drift predicts upcoming staleness).

### AdaLoRA — adaptive rank allocation

The current adapter uses fixed rank \(r = 8\) across all adapted layers. Some layers of the predictor carry more of the dynamic scene information than others — spending the same rank budget on every layer is inefficient.

AdaLoRA (adaptive LoRA) redistributes rank budget dynamically based on the importance of each layer's singular values during training. Less important layers get lower rank; more important layers get higher rank. The total parameter count stays fixed. For MAPA this would allocate more adapter capacity to the layers of the predictor most responsible for scene dynamics, improving adaptation quality per parameter without increasing memory overhead.

### Summary — what changes and when

| Optimization | When to implement | Why it matters | Complexity |
| --- | --- | --- | --- |
| Running centroid support counter | Month 2 — during implementation | Fixes cross-episode support tracking, core correctness issue | Low — 2 integers per cluster |
| Cluster-aware buffer eviction | Month 2–3 — ablation phase | Protects emerging clusters from premature eviction | Low — tag entries with cluster id |
| Contrastive buffer sampling | Month 3 — after basic update works | Prevents adapter overfitting to trigger cluster | Medium — sampling strategy change |
| Hierarchical LoRA adapters | Month 4–5 — after baseline validated | Separates timescales of adaptation | Medium — two adapters instead of one |
| Drift velocity estimation | Month 5 — stress test phase | Proactive re-consolidation before staleness | Medium — per-cluster velocity tracking |
| Landmark graph | Month 5+ — when \(N > 200\) | Enables relational queries, spatial reasoning | Medium — graph build at consolidation |
| AdaLoRA | Month 5–6 — theory phase | Better parameter efficiency per layer | High — requires importance scoring |

**Takeaway** The two most important fixes — running support counter and cluster-aware eviction — should go into the Month 2 implementation, not be deferred. They address correctness issues in cross-episode evidence accumulation, not just performance improvements. Everything else is a Month 4+ optimization once the baseline is proven to work.

---

## 14. Claims, sources, and mathematical grounding — what is proven, what is precedent, and what is hypothesis

Every non-trivial claim in this document falls into exactly one of three categories: a mathematical fact that follows from definitions, an empirical principle already established in adjacent literature and applied here to a new domain, or a hypothesis specific to MAPA that has not yet been tested. Conflating these categories is the single easiest way to lose credibility in front of a panel. This section separates them explicitly, maps each claim to its formal statement, and cites the literature that grounds it — with links to read the primary sources directly.

### Claim 1 — Autoregressive error compounds as \((1+\lambda)^N\)

**Category: mathematical fact, follows directly from the definition of a Lipschitz constant.**

Definition: \(f\) is \(L\)-Lipschitz if \(\|f(x) - f(y)\| \leq L\|x-y\|\) for all \(x, y\).

 \[\varepsilon_0 = \|\hat{z}_0 - z_0\| \quad\Longrightarrow\quad \varepsilon_k \leq L^k \cdot \varepsilon_0 = (1+\lambda)^k \varepsilon_0\]

Proof by induction: \(\varepsilon_{k+1} = \|f(\hat{z}_k) - f(z_k)\| \leq L\|\hat{z}_k - z_k\| = L\varepsilon_k\). Apply \(k\) times.

This requires no citation beyond the definition of Lipschitz continuity itself — a standard object in real analysis, formalized by Rudolf Lipschitz in the 1860s. What is *not* a mathematical fact is the specific value of \(\lambda\) for a trained predictor — that is an empirical property, measured from the rollout curve, not derived.

**Status** Proven, unconditionally, given that \(f_\theta\) has some finite Lipschitz constant — which any network with bounded weights and Lipschitz activations (ReLU, GELU) always has. The only open question is the numerical value of \(\lambda\), not whether the exponential form holds.

### Claim 2 — Metric-preserving encoders make cosine similarity a valid semantic proxy

**Category: mathematical fact, conditional on an empirical premise (approximate isometry).**

If \(\varphi\) is \(c\)-isometric — \(c^{-1}\|x-y\|_{\text{obs}} \leq \|\varphi(x)-\varphi(y)\|_{\text{lat}} \leq c\|x-y\|_{\text{obs}}\) — then latent distance is sandwiched by observation distance up to a bounded factor \(c\).

 \[\cos(\varphi(x), \varphi(y)) \to 1 \iff \|x - y\|_{\text{obs}} \to 0 \quad \text{(as } c \to 1\text{)}\]

The implication itself is a straightforward consequence of the sandwich bound. What SIGReg provides is the empirical premise: a training-time regularizer that pushes \(\varphi\) toward approximate isometry by penalizing mismatch between latent and observation distances. This is the mechanism introduced in the LeJEPA / SIGReg line of work.

**Status** The logical implication is proven. The premise (SIGReg achieves approximate isometry in practice) is empirically supported by the original SIGReg training curves, but the degree of isometry achieved for any specific trained encoder is a measured quantity, not a guarantee.

### Claim 3 — Tight clusters indicate structural repetition; dispersed clusters indicate unstructured noise

**Category: established empirical principle from a different field, applied here to a new domain.**

This is the core discriminator behind the consolidation gate's tightness criterion, and it did not originate with MAPA. It is the foundational assumption of an entire subfield of unsupervised anomaly detection, formalized two decades before this proposal:

\[\text{tightness}(k) = \frac{1}{n_k}\sum_{i \in k} \|z_i - c_k\|^2\]

He, Xu & Deng's Cluster-Based Local Outlier Factor (CBLOF, 2002) formalizes the same discriminator: normal data belongs to large, dense clusters; outliers belong to small, sparse clusters, or to none at all. MAPA's tightness criterion is this principle applied to JEPA latent space with EMA-updated online centroids in place of CBLOF's batch clustering.

Independent confirmation of the same pattern in a different generative model: [Conditioning Latent-Space Clusters for Real-World Anomaly Classification](https://arxiv.org/pdf/2309.09676) (arXiv 2309.09676) demonstrates that conditioning a VAE's latent space produces exactly this separation — normal samples cluster tightly, anomalous samples disperse — and that k-means-style clustering on the resulting space performs the anomaly detection directly. This is the same mechanism, in a VAE rather than a JEPA predictor.

**Status** The general principle is established, empirically validated, and roughly 20 years old in the anomaly detection literature. What is *not* established is whether this specific discriminator holds for JEPA world model prediction errors at matched error magnitude — that is MAPA's actual novel claim, and it remains untested until the matched-noise experiment runs.

### Claim 4 — Surprise (prediction error) is a valid signal for selective memory formation

**Category: established empirical principle, with a directly adjacent recent implementation.**

[Worth Remembering: Surprise-Gated Robot Episodic Memory](https://arxiv.org/pdf/2606.03787) (arXiv 2606.03787, Gorlo, Wise, Speranzon & Carlone, MIT + Lockheed Martin) computes Bayesian surprise directly in V-JEPA-2's latent space to gate what enters a robot's episodic memory, and shows a 12%+ improvement over prior robot memory methods on temporal, spatial, and binary QA benchmarks.

Their gate: Bayesian surprise \(S(z_t) = D_{\text{KL}}(P(\cdot \mid z_{1:t}) \,\|\, P(\cdot \mid z_{1:t-1}))\) — a magnitude-based, probabilistic surprise signal.

MAPA's gate: \(\varepsilon_t = \|\hat{z}_t - z_t\|^2\) crossing an adaptive threshold \(\tau(t)\) — also magnitude-based at the filtering stage, but the consolidation decision downstream uses cluster geometry, not magnitude, as the second-stage discriminator.

The overlap: both use a JEPA-family latent space, both use a surprise-style signal to decide what's worth remembering. The distinction that must be explicit: their contribution is the surprise signal itself deciding memory formation. MAPA's contribution is a second-stage geometric filter that operates *after* a similar magnitude-based trigger, specifically to solve the noise/signal ambiguity their approach does not address (their surprise score, like error magnitude, cannot by itself distinguish a structured change from noise of equal surprise).

**Status** Surprise-gated memory in JEPA latent space is established and published, six months before this proposal. MAPA must be positioned explicitly as an extension — geometric consolidation on top of surprise-gated filtering — not as introducing the base idea of surprise gating itself.

### Claim 5 — Gradual drift is invisible to instantaneous thresholding (Failure Mode 4)

**Category: established, formalized, and named in directly adjacent literature.**

[The Boiling Frog Threshold: Criticality and Blindness in World Model-Based Anomaly Detection Under Gradual Drift](https://arxiv.org/pdf/2603.08455) (arXiv 2603.08455) formalizes exactly this failure mode for world model anomaly detection: systems using instantaneous thresholds become blind to slowly accumulating drift that individually never crosses the threshold, but which crosses a critical boundary in aggregate.

\[\sum_{i=1}^{N} \delta_i < \tau \;\;\forall i, \quad\text{but}\quad \sum_{i=1}^{N}\delta_i \gg \tau\]

Each individual drift increment \(\delta_i\) stays under threshold, so no single step ever triggers detection — yet the cumulative drift eventually represents a completely different environment than the one originally consolidated.

**Status** This failure mode is independently named and formalized in prior work, published before this proposal. Cite it directly rather than presenting FM-04 as an original observation — doing so strengthens the proposal by showing awareness of the field rather than reinventing a known problem.

### Summary table — every claim, its category, and its citation

| Claim | Category | Grounding | What remains open |
| --- | --- | --- | --- |
| Error compounds as \((1+\lambda)^N\) | Mathematical fact | Definition of Lipschitz continuity | Measured value of \(\lambda\) for the trained predictor |
| Metric preservation → valid cosine similarity | Mathematical fact (conditional) | Isometry sandwich bound; SIGReg / LeJEPA | Degree of isometry achieved empirically |
| Tight clusters = structure, dispersed = noise | Established principle, new domain | CBLOF (He, Xu & Deng 2002); VAE latent conditioning (2309.09676) | Whether it holds for JEPA prediction error at matched magnitude |
| Surprise gates memory formation | Established, directly adjacent | Worth Remembering (2606.03787) | MAPA's geometric second stage is the delta, must be argued explicitly |
| Gradual drift evades instantaneous thresholds | Established, named prior art | Boiling Frog Threshold (2603.08455) | MAPA's specific mitigation (drift velocity estimation) is untested |

### Further reading

- [Clustering-Based Outlier Detection Method](https://www.researchgate.net/publication/224346278_Clustering-Based_Outlier_Detection_Method) — the CBLOF lineage, foundational anomaly detection assumption.
- [Worth Remembering: Surprise-Gated Robot Episodic Memory](https://arxiv.org/pdf/2606.03787) — closest prior art, read in full before citing.
- [The Boiling Frog Threshold](https://arxiv.org/pdf/2603.08455) — formalizes Failure Mode 4 independently.
- [Conditioning Latent-Space Clusters for Real-World Anomaly Classification](https://arxiv.org/pdf/2309.09676) — same clustering mechanism, VAE domain.
- [Bounding Distributional Shifts in World Modeling through Novelty Detection](https://arxiv.org/html/2508.06096) — general background on novelty detection for world models.
- [Novelty Detection in Reinforcement Learning with World Models](https://arxiv.org/html/2310.08731v4) — magnitude-based novelty baseline to contrast against.

**How to use this section in a panel** When a claim is challenged, identify its category before answering. Mathematical facts can be derived on the spot. Established principles should be cited by name and source. Hypotheses must be named as hypotheses, with the specific experiment that will test them. Never answer a hypothesis question as if it were a proven fact — that is the single fastest way to lose credibility once a panelist finds the gap.
