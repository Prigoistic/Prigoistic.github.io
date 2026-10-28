# Intelligence between things

How do many locally operating units become part of something that can act as one?

Author: Priyam Ghosh
Published: October 28, 2026
Canonical: https://prigoistic.me/blog/intelligence-between-things.html
Keywords: distributed cognition, bioelectricity, associative memory, hypergraphs, sparse inference

## Before the brain

For a long time, we humans as a species have tried to understand what intelligence fundamentally means. We started by thinking that intelligence was something only we humans possessed, and somehow this turned into a mass hysteria that caused us to neglect the purest forms of cognitive behaviour in species other than *Homo sapiens*.

In the book *Sapiens* by Yuval Noah Harari, the descriptions of how humans evolved into social animals, lived in communities, and developed collective cognitive behaviour are fascinating when you think about them. We started thinking about collective betterment rather than individual gains. But if you dig deeper into evolution and read the holy book, ***On the Origin of Species***, Darwin's evolutionary landscape already shows that this sense of collective betterment is not something we see just in mammals. Fundamentally, at the very core, living organisms have been coordinating with one another for much longer.

In the age of artificial intelligence, we often try to mimic the ability to think and intelligence itself by understanding how things operate inside the brain. Hence, neurons become the fundamental building block of how we define cognition. Lemme take you into the world of neuroscience to help you understand how this collective betterment is baked into us through evolution.

One of the interesting examples of this comes from something called [**cell competition**](https://www.nature.com/articles/s41586-019-1199-y). The phenomenon was first observed in *Drosophila* in the 1970s, when researchers found that cells perfectly capable of surviving on their own could be eliminated when surrounded by fitter neighbouring cells. Later work showed similar mechanisms across developing and adult tissues, where cells compare relative fitness and weaker or abnormal cells can be removed to preserve the integrity of the tissue as a whole.

A much more direct example of this was shown in mammalian skin development. In 2019, researchers studying mouse epidermis found that during tissue formation some progenitor cells act as “winners”, killing and clearing neighbouring “loser” cells, and that this competition helps shape and maintain the architecture of the developing tissue.

Now obviously the cells are not sitting there consciously deciding that the body matters more than they do. That would be a stupid way to interpret it, right? But the interesting part is that nature has forged us in such a way that our body has built systems where the local behaviour of individual cells can preserve something at a larger scale than the individual cell itself.

And this is not limited to competition either. **In [1998, Michael Levin and Mark Mercola](https://www.sciencedirect.com/science/article/pii/S0012160698990248) at Harvard Medical School**, while studying *Xenopus* embryos, showed that communication between cells through **gap junctions** was involved very early in establishing the left-right organisation of the developing body. This was before you even had anything resembling a nervous system making these decisions. The cells were already sharing signals across the embryo in a way that affected the final large-scale anatomy.

Then, in **[2005, Taisaku Nogi and Michael Levin](https://www.sciencedirect.com/science/article/pii/S0012160605005956) at the Forsyth Institute in Boston** studied regeneration in planarian flatworms. Planaria are interesting because if you cut one into pieces, the remaining tissue can figure out which side needs to become a head and which side needs to become a tail. Their experiments showed that **gap-junctional communication between cells was involved in coordinating this regeneration**, again suggesting that information about what the larger body should become was being handled collectively across tissue rather than sitting inside one commanding cell.

Normal regeneration

[![A planarian trunk fragment, with its head and tail removed, regenerates a complete worm with one head and one tail.](https://prigoistic.me/assets/essays/intelligence-between-things/planarian-regeneration-normal.png)](https://prigoistic.me/assets/essays/intelligence-between-things/planarian-experiments-full.png)

Gap-junction communication blocked

[![A trunk fragment treated with octanol, which blocks gap-junction communication, regenerates with a head at each end.](https://prigoistic.me/assets/essays/intelligence-between-things/planarian-regeneration-altered.png)](https://prigoistic.me/assets/essays/intelligence-between-things/planarian-experiments-full.png)

A fragment can rebuild a whole animal. Change the communication between its cells, and the anatomy it rebuilds can change too. Published schematics from panels A and D of [Figure 2, Lobo, Beane and Levin (2012)](https://doi.org/10.1371/journal.pcbi.1002481.g002), *PLOS Computational Biology*, [CC BY](https://journals.plos.org/ploscompbiol/s/licenses-and-copyright). [Open the complete figure ↗](https://prigoistic.me/assets/essays/intelligence-between-things/planarian-experiments-full.png).

And one of the experiments that makes this even more interesting came in [**2012 at Tufts University**](https://pmc.ncbi.nlm.nih.gov/articles/PMC3243095/). The team was studying eye development in *Xenopus laevis* embryos and found that particular patterns of membrane voltage acted as instructive signals during development. When they artificially manipulated the membrane voltage of cells that normally had nothing to do with making an eye, they could trigger the formation of **ectopic eye tissue**, aka eye tissue growing in an area where an eye would not normally be present. Some of these eyes appeared far outside the normal location of the eye, including around the gut and tail. So the genome of those cells obviously already contained the machinery required to make an eye; what changed was the higher-level electrical state telling those cells which developmental programme to participate in.

This is very similar to how, in large language models, we try to nudge particular neurons to see a change in the collective behaviour of the model. Mechanistic interpretability (Aban in our team is the guy for this, from whom I keep learning new stuff).

Levin's group at Tufts has since developed this into a much broader area of **developmental bioelectricity**: studying how ordinary non-neural cells use ion channels, membrane voltages and gap junctions to communicate across tissues and coordinate things such as growth, regeneration and anatomical patterning. The important thing here is that these electrical mechanisms are not exclusive to neurons. Neurons specialised and massively accelerated this kind of electrical communication, but cells were using bioelectric states to coordinate collective behaviour long before nervous systems existed. Think of it like a shared memory across the whole body, existing at global and local scales for different specialised cells.

This actually shifts the narrative in which we think of the brain as the single source of decision-making and our sense of self. Rather, intelligence, or at least some of the basic properties we associate with cognition, seems to be baked way deeper into biology. The neuron might be one very specialised and extremely powerful unit for doing this, but collective problem-solving itself seems to have existed long before neurons.

In biology, we see cells coordinate at different scales of governance and take decisions that preserve larger-scale structures. Some goal-directed-looking behaviour appears well before the involvement of the nervous system. The simplest example is how the liver operates. Imagine you had to remove part of your liver (maybe you drink too much). The liver goes through a series of changes to keep functioning. Hepatocytes and other types of cells respond to changes in blood flow, cytokines, metabolic demands, etc., and collectively restore liver mass towards the level required by the body. The interesting thing is that there is no single controller cell directing this whole process. It emerges from many local signals and components of the tissue.

The elephant in the room is: **how does a collection of cells, each reacting only to relatively local biochemical and mechanical signals, end up restoring something that only makes sense at the level of the whole organ?** Where does this sense of coordination come from, then?

## Small rules, larger behaviour

Recently I saw this video on YouTube by Kurzgesagt (my fav science channel since childhood), which discussed emergence: how a collective of stupid things can evolve into something smart. I think this is even the whole essence of how life evolved on the planet. Like, imagine how a collection of hydrogen and helium atoms can eventually give rise to something as complex as humans? Here we touch the concept of **cellular automata**: thinking of the body as a cellular automaton.

[Emergence: How Stupid Things Become Smart Together, by Kurzgesagt](https://www.youtube-nocookie.com/embed/16W7c0mb-rE?autoplay=0&playsinline=1)

The video that prompted this part of the essay: [Emergence: How Stupid Things Become Smart Together](https://www.youtube.com/watch?v=16W7c0mb-rE), by Kurzgesagt – In a Nutshell. Watch here, or open it on YouTube.

Take **Conway's Game of Life**, for example. It is basically a grid of cells where every cell can only be in one of two states, alive or dead. There is no central controller, no cell that knows what the final pattern should look like, and no global instruction being passed around. Every cell just looks at the few cells around it and follows a very small set of rules about whether it should stay alive, die, or become alive in the next step. And somehow, from these extremely simple local rules, you start getting structures that move across the grid, structures that oscillate, structures that remain stable, and even configurations capable of universal computation.

Local rules, shared behaviour

 ![A mixed field of live cells in Conway's Game of Life, each governed by the same neighbour rule.](https://prigoistic.me/assets/essays/intelligence-between-things/local-rules.svg?v=2)

A cell is born with three live neighbours; a live cell survives with two or three. All other cells die or stay empty. Cells stay in place; births and deaths make the patterns appear to move. Cells outside this grid count as empty. This is a cellular automaton, not a simulation of tissue.

Now obviously I'm not saying that a human body or a brain is just a huge Game of Life simulation (that would be pretty boring). The point is that you don't necessarily need a central thing that understands the entire system for complex behaviours to appear at the level of the whole. Individual units can operate using only local information while the collective ends up doing something none of these units can fathom doing alone.

I mean, this can happen the other way around too. Imagine your college group project: a different combination of people assigned to a single goal, complete the project and submit it to the prof. Well, if you have been through that phase, you know that sometimes collective betterment is a myth and doing stuff individually brings way better outcomes (ik your pain reader, it's ok).

Now this is where the idea of [*Cognition all the way down*](https://aeon.co/essays/how-to-understand-cells-tissues-and-organisms-as-agents-with-agendas), something Michael Levin and Daniel Dennett wrote about, becomes kinda interesting. Their argument is not that every cell is secretly sitting there thinking like us (coz that would be scary). Imagine every cell in your body plotting revenge for all the suffering you have put your body through. Anyways, the point is more about whether the things we usually associate with cognition, solving problems, maintaining goals, remembering states and adapting when something goes wrong, really begin only once a nervous system appears. Biology seems to show versions of these behaviours at much lower levels as well.

Michael Levin takes this even further through the idea of **basal cognition**. A multicellular organism is made up of huge numbers of individual cells, each with its own local machinery and limited access to what is happening around it. Yet these cells somehow become part of a larger system whose goals and memories exist at a completely different scale. The individual cells in your liver do not understand that they are maintaining a liver. The cells in an embryo do not individually contain the final anatomy of the animal. Still, through signalling and coordination, the collective behaves as if it is working towards states that only make sense at the level of the whole organism. And I think this is where neurons start looking slightly different.

We usually talk about neurons as if evolution invented them and only then intelligence began. This is a myth. One of my favourite books, which is also liked at MetaCognition, is *A Brief History of Intelligence* by Max Bennett. It shows how early animals such as nematodes already had abilities like steering and the basic recipes for survival. But cells had already been communicating electrically, maintaining internal states and coordinating behaviour across groups long before nervous systems appeared.

![A large flock of starlings forms a dense, sweeping ribbon above silhouetted trees against a warm evening sky.](https://prigoistic.me/assets/essays/intelligence-between-things/starling-murmuration.jpg)

The birds remain individuals; the moving outline belongs to the flock. A murmuration at Gretna, photographed by [Walter Baxter](https://www.geograph.org.uk/photo/2687912), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Starling_murmuration.jpg), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).

Neurons seem to take this basic ability and push it to another scale, like a more advanced version of it (Evo Cells): faster communication over much longer distances, much more complicated state changes, and eventually the ability to coordinate perception, movement, memory and behaviour in real time. The stack for cognition.

So instead of intelligence suddenly appearing once you have enough neurons, it starts looking more like a continuation of an older biological problem: how do many locally operating units become part of something that can act as one? And once you look at the brain from that perspective, the idea that each process belongs to one specific part of the brain starts to fade. Even something as simple as recognising an object is not a one-neuron thing. It's a collective state emerging from many different processes interacting at once.

## A memory without one address

Which brings us to the thing I originally found quite interesting, and which sparked my interest in writing this whole thing: [*The empty brain*](https://aeon.co/essays/your-brain-does-not-process-information-and-it-is-not-a-computer) by Robert Epstein. As I read it, the essay argues that there is nothing inside the brain that does computation. But I think Robert missed an insight. Rather than framing it as “there is nothing in the brain, it's just hallucination”, I think the discussion should have focused on this: **cognition is a distributed mechanism that takes place because of a beautiful symphony between multiple specialised local cell groups.**

Now, if this idea of distributed behaviour actually carries into the brain, one of the easiest ways to test it is pretty straightforward: disturb one part of the system and see what changes. This is basically what a large part of causal neuroscience does. Techniques like TMS, electrical stimulation, optogenetics and lesion studies let researchers interfere with particular regions or populations of neurons, then check what happens to perception, memory, movement or decision-making. But something interesting starts showing up when you do this. The effect of stimulating one region is often not limited to that region itself. It depends on what the rest of the network is doing at that moment, what task the person is performing, and what state the brain is already in. Even the same stimulation can produce different behavioural effects depending on the current state of the system.

Working memory is a pretty good example of this. For a long time, the prefrontal cortex was treated almost like the place where working memory was being held. But over time that picture became much more distributed. [Recent work](https://doi.org/10.1016/j.neuron.2015.07.013) makes it clear that information being kept in working memory can be found across sensory regions, parietal cortex and prefrontal cortex, with [different parts of this network](https://www.nature.com/articles/s41593-018-0094-4) seemingly doing different jobs depending on what is being remembered and what the person needs to do with it.

And in [2025, researchers at NYU](https://www.nature.com/articles/s41467-025-57882-8) actually perturbed the primary visual cortex, V1, using TMS while people were holding visual information in working memory. Disrupting the part of V1 corresponding to the remembered location made those memories less precise. The interesting thing here is that V1 is usually introduced as one of the earliest stages of visual perception. Yet interfering with it also interfered with something we would normally call memory. That starts making these clean divisions slightly harder to maintain. The part of the brain that helps you see something can also participate in keeping that thing available after it is gone. The prefrontal cortex can help maintain current goals, but the way it does that is already shaped by long-term learning and previous experience. Even the distinction between working memory and long-term memory starts becoming less clean once you look at how the systems actually interact.

[![The study maps the stimulated region of visual cortex, then diagrams a task in which participants remember a dot’s location during a four-second delay. Magnetic pulses are delivered during that delay.](https://prigoistic.me/assets/essays/intelligence-between-things/visual-memory-experiment.png)](https://prigoistic.me/assets/essays/intelligence-between-things/visual-memory-experiment.png)

Follow panels E–F: a dot appears, disappears for four seconds, and the participant looks towards its remembered location. TMS targets visual cortex during the delay. [Figure 1, Dake and Curtis (2025)](https://www.nature.com/articles/s41467-025-57882-8/figures/1), *Nature Communications*, [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/). [Open at full resolution ↗](https://prigoistic.me/assets/essays/intelligence-between-things/visual-memory-experiment.png).

Long-term memory itself doesn't seem to solve the problem by simply putting every memory somewhere else. The [current engram picture](https://www.nature.com/articles/s41467-022-29384-4) suggests that a particular memory can involve sparse populations of cells spread across multiple connected brain regions rather than sitting inside one fixed location. And even these engrams [don't appear to be perfectly static](https://doi.org/10.1126/science.aam6808) if you look at the full picture.

Memories can be updated, linked with other memories, forgotten, reactivated on the basis of relevance, and reorganised over time. Our work on [*The Dynamics of Memory*](https://ieeexplore.ieee.org/document/11677899) tries to give a mathematical structure to the different behaviours that power long-term memory. This is where we talk about attractor models, something I also discussed in a [previous blog on astrocytes](https://prigoistic.me/blog/astrocytes-tripartite-synapse.html#the-neuron-doctrine-and-the-century-of-incomplete-maps). The basic idea is that neural activity can have certain states towards which it naturally moves. You don't need to specify every detail of the final state. Think of it like gradient descent: give the network enough of a cue, and the interactions inside it can pull activity towards one of those stable patterns. Attractor models have been used to explain things like working memory, the integration of noisy information, and error correction in neural systems.

And even here the picture is not completely static. Recent work on working memory suggests that simple fixed attractors are sometimes not enough. Adding [activity-dependent plasticity](https://www.nature.com/articles/s44271-023-00027-8), where the landscape itself changes as the system operates, can better explain memory across different timescales.

This is the part I find more interesting than trying to locate where one particular cognitive function “lives”. Maybe perception, memory, reasoning and action are not separate programmes running one after another. Maybe they are different descriptions we give to different behaviours of the same distributed system. Previous activity changes the system, the current state determines what gets activated next, and the thing we experience as cognition comes from all these processes continuously affecting each other.

Which then brings up the question I actually care about for artificial intelligence: **if cognition can emerge from a system working like this, why do we assume that building intelligence has to begin with recreating the neuron?**

## The tree that didn't work

This is actually the funniest part to me. We skipped a lot of neuroscience because we started developing artificial intelligence by thinking of neurons as the building block. We developed rules and designed the perceptron. Over time, those perceptrons became layers and turned into deep neural networks, and eventually transformers, which turned the whole thing into something that could scale almost ridiculously well. Thanks to the neural scaling laws.

And somehow the maths works. Shoutout to Shannon for this.

But you can see where my argument is coming from. Modern language models can write code, translate language, generate essays, recognise people and objects across huge amounts of data, and perform reasoning. Recently I have been working on [Byte Latent Transformers](https://arxiv.org/abs/2412.09871) (more on this in some other blog). I was working on a very different problem statement, but what sparked this thought was the way information flows.

BLT doesn't treat every part of a byte sequence as equally informative. Some parts of language are extremely predictable, while others contain much more uncertainty. If you look at modern language-model inference, every time the model has to produce something, a huge amount of numerical computation has to happen through this massive learned network. GPUs make that practical because they are insanely good at parallel matrix operations, but the dependency is still there. The intelligence is distributed across billions of parameters, and accessing that intelligence means repeatedly running computation through that learned structure.

This is where I started wondering whether this was a limitation of intelligence itself or just a limitation of the way we have chosen to represent intelligence. The brain doesn't seem to work by activating every part of itself every time it has to think about something. Yes, MoE models exist, which activate only a certain part of their parameters, but they are still primitive compared to how things occur biologically.

If I ask you about your first school, your brain does not seem to scan every memory you have ever formed. A few cues are enough to bring a very particular set of things into relevance. If I say “dog”, you do not simultaneously activate every concept you know with equal strength. A small related region of cognition becomes relevant, and then that region can pull other things into it. So the question comes down to: **what if inference could work the same way computationally?** What if we did it by activating a very small part of a much larger persistent structure, only computing over what is currently relevant rather than running through one giant dense function?

Welcome to the world of neuro-symbolic AI. And to be honest, this isn't the first time we've thought about something like this. If you are someone who has been following our work at [MetaCognition](https://www.getmetacognition.com) (if you are, I love you very much), back in late 2025 we played around with a more primitive version of this idea. Don't get me wrong, neuro-symbolic AI already existed before we started working on it, but we were still trying to establish how to bring out proper relationships between the symbols. The thought at that point was whether we could remove the neural network completely and organise knowledge inside a hierarchical data structure, something closer to a B+ tree, then let inference happen by traversing that structure sequentially.

I remember the cold nights of December in Bangalore when Krish (my other co-founder) and I used to discuss its structure. Naive us thought this was some breakthrough stuff, and if you think about it, it kinda should have worked, because computers are extremely good at searching trees, indexing things, following pointers and retrieving structured data. That's the core of computing algorithms. So if language and concepts could somehow be organised hierarchically, maybe we wouldn't need a gigantic neural network for every inference step at all, right? Another reason we thought B+ trees were a viable option was that our graph traversals were slow and broken. Retrieval in our Neo4j setup was terribly slow (later we did move towards LMDB-based archs tho).

Well, bummer for you, it didn't. If you look at [Memora's code](https://github.com/venkat1701/memora-sdk-core), you will get the gist of it. Let me try to explain the issue with an example. Let's assume you have a dog. Now, a dog can appear in many different contexts, leading to thousands of other connections, and a tree data structure is not a good fit for all of them.

![A single DOG concept connected to six different contexts, rather than copied into six branches of a tree.](https://prigoistic.me/assets/essays/intelligence-between-things/overlapping-contexts.svg)

One concept, several contexts. The useful structure is in the overlapping relationships, rather than a single assigned parent.

And once you start duplicating it across many branches, the same concept exists in multiple places, relations start exploding, and retrieval becomes a nightmare. Well, that failure was useful, because later it showed us that fast storage and cognition in general are not the same thing. They are fundamentally different.

Von Neumann-based architectures access memory through addresses, as with ordinary RAM. But if you look at how the brain works, access is closer to what we call content-addressable memory: there are overlaps between memories, and a cue can bring several of them into relevance. That is different from simply looking up a dedicated memory allocation marked by a pointer.

## Symbols we don't have to hand-design

Well, it brought me back to the era when symbolic AI dominated. Symbolic systems had something very attractive about them.

In the 1970s, researchers at Carnegie Mellon were already trying to solve problems like continuous speech understanding without having one giant model do everything. HARPY, developed by Bruce Lowerre under Raj Reddy, represented acoustic and linguistic possibilities inside a finite-state network and searched only a small number of promising paths through it. [By 1976, it could recognise continuous speech](https://www.cs.cmu.edu/afs/cs/user/msiegler/www/ASR/futureofcmu-final.html) with a vocabulary of roughly a thousand words under restricted syntax and semantics, which was a serious result for the time.

Watch this cool video from Welch Labs (I love the channel so much). He talks about HARPY right at the start, and the visual explanation makes this part much easier to follow.

[Can humans make AI any better? by Welch Labs, opening with HARPY](https://www.youtube-nocookie.com/embed/2hcsmtkSzIw?autoplay=0&playsinline=1)

[Can humans make AI any better?](https://www.youtube.com/watch?v=2hcsmtkSzIw), by Welch Labs. The opening 4 minutes 39 seconds cover HARPY.

[HEARSAY-II](https://mas.cs.umass.edu/pub/paper_detail.php/229) took a different approach, which I find even more interesting for this discussion. Instead of one monolithic procedure, it had several specialised sources of knowledge, acoustic, phonetic, lexical, syntactic and others, contributing partial hypotheses to a common structure known as a **blackboard**. One process might recognise a possible sound, another might suggest a word that fits it, and another could use syntax to strengthen or reject that interpretation. No single component had to solve the whole problem by itself. The answer emerged from several kinds of knowledge interacting over a shared state.

So in some sense they were already playing with an idea that looks surprisingly familiar now: intelligence as structured information, specialised processes and selective search rather than one homogeneous computation. And some of it worked remarkably well. HARPY actually performed better than several of the more explicitly AI-oriented speech systems around it, enough that Allen Newell later used it as the basis for asking whether its mechanisms could tell us anything useful about human speech cognition.

But these systems also show where the older approach started hitting a wall. Their worlds had to be carefully constructed, and the main issue was that the vocabulary, syntax and semantics were restricted. The representations, knowledge sources and ways in which they interacted were largely engineered beforehand. As CMU researchers later reflected, there were simply too many ways of saying and meaning things for people to keep manually designing enough structure. Eventually the field needed systems that could learn much more of that structure from data.

And I think that is a more useful way of thinking about why symbolic AI struggled. The problem was not simply that symbols or explicit relations were bad ideas. We had to decide what the useful units were, what counted as a relation, which abstractions mattered, and how the different pieces should fit together. The machine could search through that world, reason over it and manipulate it, but a huge part of the intelligence had already gone into constructing the world on its behalf.

Which brings me back to the problem we had with the B+ tree. Maybe trying to design the correct structure beforehand is itself the wrong approach. The few fundamental questions we must ask are: **what if the structure had to emerge from the information the system was exposed to?** **What if the machine had to discover not just the answer, but the symbols, abstractions and relations it would later use to find answers?**

This is where I think starting from language itself becomes interesting. Let's start by removing the assumption that the machine already knows what a word is or what the structure of language is. The most primitive thing that really gives us information here is **bytes**. There are only sequences that occur more or less often around other sequences. But certain byte sequences keep appearing together. Some of them appear in similar surroundings.

One of the most interesting papers I read recently, [*Language Modeling Is Compression*](https://arxiv.org/abs/2309.10668), shows it so clearly. Prediction and compression are opposite sides of the same coin. As a byte sequence keeps repeating because a pattern is emerging, representing it every single time as a completely independent series of bytes starts becoming wasteful. And here, my friends, compression kicks in.

If the sequence corresponding to the word “dog” keeps appearing, then eventually treating that sequence as one reusable structure is simply more intuitive than having different representations every time. The same happens at larger scales. Common fragments become reusable, and combinations of these fragments become reusable too. Gradually, the system can build a hierarchy out of the regularities it keeps encountering.

None of these structures needs to begin with human meaning attached to it. The machine doesn't know that DOG means an animal. At first it only has to know that this particular pattern keeps occurring, and this leads to another kind of information: **context**. Suppose the structures corresponding to “dog”, “cat” and “horse” repeatedly show up in similar places.

“The dog runs.”
“The cat runs.”
“The horse runs.”

“The dog eats.”
“The cat eats.”
“The horse eats.”

The actual byte sequences are different, but their behaviour inside the larger stream starts looking similar. That similarity itself is information. At some point, the system can stop treating these patterns as completely unrelated things and start grouping them as members of some larger contextual class. If you have read about group theory, this might click for you.

It doesn't need to call that class ANIMAL tho. In fact, initially it can simply know that these structures seem to be interchangeable in a particular family of contexts. And this is the point where something resembling abstraction can begin without us explicitly defining the abstraction beforehand. The machine can create its own symbols by turning repeated observations into one reusable structure, making the information easier to organise and predict.

The same idea can also continue upwards. Repeated sequences create chunks, then classes, relationships and rules. If you take a bird's-eye view of this, it looks similar to how Game of Life works: a primitive kind of learning-system-like behaviour.

![Recurring bytes become reusable chunks, contextual classes, then relations and rules.](https://prigoistic.me/assets/essays/intelligence-between-things/emergence-path.svg)

A proposed learning path: recurring bytes become reusable chunks, contextual classes, relations and rules.

## When a relation becomes a thing

By now you can probably see why the tree became uncomfortable. The pattern corresponding to DOG can belong to a class because of how it behaves in a sentence, while also participating in a sound, an ownership relation, a particular event and an old memory. Those overlaps are useful information. And relationships themselves can become something you refer to. In the sentence *Alice gave Bob a book*, you already have several roles: a giver, a recipient and an object. A plain link between Alice and Bob does not tell you which person gave what to whom. You can model the event as something with its own identity, with links to its participants and their roles.

Now suppose *Carol remembers Alice giving Bob the book.* The giving event has become the content of another relation. You can go a step further: *Dave believes Carol remembers Alice giving Bob the book.* You now need to preserve who believes what, whose memory it is, and which event is being remembered. Notice also that Dave's belief does not establish that Carol really remembers it. Nesting has to preserve the scope of a claim as well as its participants.

[A giving event becomes a memory, then the content of a belief](https://prigoistic.me/assets/essays/intelligence-between-things/nested-events.mp4)

Follow the 12-second loop: first the giving event, then Carol’s memory of it, then Dave’s belief about that memory. Each layer retains its own participants and scope.

This is where hypergraphs became useful to us. A hyperedge can relate several members at once. A role-labelled representation can distinguish what each member contributes. If the representation also allows an event or relation to have an identity that another relation can reference, you can express the nesting above. Ordinary hypergraph notation alone does not automatically supply all those semantics; the representation has to support them. The appeal is that you no longer need to give each concept one correct place. It can participate in several structures, and the same event can be referred to from several perspectives.

![Seven vertices belong to four overlapping hyperedges, shown as coloured regions.](https://prigoistic.me/assets/essays/intelligence-between-things/external-hypergraph.svg)

### Read the relationship as a group

Each numbered point is a vertex. Each coloured region is one hyperedge, even when it contains more than two vertices. A shared vertex can participate in several groups at once.

The extra meaning in our example comes from assigning roles such as giver and recipient, then giving the event an identity another relation can refer to.

[Hypergraph](https://commons.wikimedia.org/wiki/File:Hypergraph.svg) by Kilom691, via Wikimedia Commons. [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

At this point we already had [HStore](https://github.com/metacoglabs/hypergraph), a persistent hypergraph database. We originally built it to store and query higher-order relationships. It supports role-labelled membership, reverse incidence, and relationships that can themselves be referenced. Those are useful properties for this experiment. There is a useful distinction here: HStore itself uses B+ trees as part of its storage machinery. Our failed idea was to force the meaning of every concept into one hierarchy. The storage index and the organisation of the knowledge are different choices. What HStore gives us is somewhere to persist a changing relational world. It does not decide which symbols should exist, which abstractions are useful, or what counts as a good explanation. A database cannot settle those questions by being given a more ambitious name.

Before the architecture can claim anything interesting, a learning process still has to answer some difficult questions. **When should a recurring sequence become a chunk? When is a contextual overlap strong enough to justify an abstraction? Should a new observation strengthen an existing relation or create a different one? When should several experiences support a rule? And when should the system let something go?** Keep every observation forever and the structure can drown in its own history. Merge observations too aggressively and you erase exceptions that matter. A useful memory needs ways to retain specifics, consolidate regularities, revise relations and remove structures whose value no longer justifies their cost.

Learning would therefore involve continuously reorganising what is kept. Some observations remain specific because their details matter. Others can contribute to a more general pattern. Some relations grow stronger, while others weaken or become redundant. The organisation is part of what experience changes. Suppose, for the moment, that we can make some of that work. We have a growing relational structure containing symbols, events and abstractions. The next question is the one a storage system cannot answer alone: what happens when a cue arrives?

## What becomes relevant

Imagine a store containing millions of relations. If every question forces us to traverse all of them, we have already lost the main advantage we were looking for. Ask the system: ***Why did the dog bark when Alice entered the room?*** Most of what it knows should be irrelevant. You would hope it can leave its facts about distant planets, car engines and Shakespeare alone while it works out which events and relationships might explain this dog, this person and this room.

The cue gives us several starting points. HStore's reverse incidence index lets a query find relations involving a given member. From DOG, we can ask **which relations contain DOG**. We do not have to discover every occurrence through a scan of the whole store. That is only a beginning. A common concept may participate in many relations. The work is to combine cues, roles, temporal context and other constraints so that retrieval stays selective. DOG together with BARK narrows one kind of search; ALICE and the room may narrow it further. Some queries need intersections. Others need joins, weighted expansion or a route through intermediate concepts. Relevance is not always a literal set intersection.

Try a small memory store. Two events involve a dog barking with Alice in the hall; other events involve different animals, actions, people and places. Combining cues brings fewer events into the workspace.

- E01: The dog barked in the hall; Alice was there.
- E02: The dog barked in the hall; Alice was there.
- E09: The dog barked in the garden; Alice was there.

Explore selective retrieval with a small fictional event store. Combine cues to narrow the matches, then choose what belongs in your workspace. [Explore HStore ↗](https://github.com/metacoglabs/hypergraph)

As a thought experiment, suppose DOG participates in 50,000 relations. A second cue might leave a few hundred candidates, and further context might reduce that number to a few dozen. Those numbers are illustrative. An index still has to do work to find the candidates, and high-degree concepts, ambiguous cues or poor abstractions can make that work expensive. The proposal depends on measuring that cost, rather than assuming a small final answer means retrieval was cheap. I keep coming back to a simple description of the intended organisation: **store globally, activate sparsely, reason locally.** HStore maintains the persistent world. A query retrieves candidate structures into a much smaller workspace in RAM. The workspace carries the current active state: which hypotheses are being considered, what evidence supports them, what is still uncertain, and which next lookup might be worth making.

A relation may bring another relation into consideration. A learned rule may match the current state and contribute a new possibility. That possibility may require another small retrieval. The process continues until it reaches an adequate answer, runs out of useful evidence, or hits a budget. That last possibility matters. A system needs a way to stop without pretending it has found an explanation. A cue that activates no useful structure should be allowed to produce uncertainty. Otherwise, we have built an expensive mechanism for making things up.

With the barking example, an event in which an unfamiliar person entered might be relevant. Repeated observations might suggest that unexpected entry sometimes precedes barking. But temporal association would not by itself prove a cause. The dog might have heard another sound, reacted to a different event, or barked for a reason the system has never observed. The result should preserve that uncertainty. If a system has learned a useful regularity, it can offer a possible explanation and identify the evidence it used. It should not turn a frequently observed sequence into an unconditional law. The hope is that these relations and regularities emerge from experience, rather than arriving as a complete hand-written ontology. After many examples of visitors entering and dogs reacting, the system might consolidate a reusable relation while retaining the contexts and exceptions that determine when it applies.

Now the CPU has a different workload: selective lookups, traversal, set operations, branching and rule matching over a relatively small active structure. CPUs can be well suited to irregular control flow. GPUs are particularly effective when a task offers large amounts of parallel numerical work, and graph workloads can also benefit from GPU implementations. Hardware performance depends on the actual workload, data layout and memory access. So I am not proposing a contest in which one processor is universally smarter. I am asking whether changing the representation can change how much work inference needs, and whether that work can be organised effectively on a CPU. If a system repeatedly needs to evaluate a large numerical network, dense accelerators are an obvious fit. If it can answer a class of queries by accessing a small relevant structure, a different balance may become practical. Both the useful query class and the cost of learning that structure belong in the comparison.

[A persistent network retrieves relevant evidence into a small active workspace; only checked updates return to storage.](https://prigoistic.me/assets/essays/intelligence-between-things/memory-flow.mp4?v=1)

[Portrait version: relevant evidence moves into a temporary workspace, while the larger stored network remains quiet.](https://prigoistic.me/assets/essays/intelligence-between-things/memory-flow-mobile.mp4?v=1)

 Read the example

### Persistent store

HStore · survives the query

- **Observed event:** Alice entered the room; the dog barked.
- **Learned relation:** Unexpected entry may precede barking.
- **What must stay attached:** Evidence, context, exceptions and dependencies.

### Active workspace

RAM · changes during the query

- **Current cue:** Why did the dog bark when Alice entered?
- **Working hypothesis:** The entry may explain the reaction.
- **Still unresolved:** Was Alice unfamiliar? Was there another stimulus?

Retrieve candidate events and relations →

← Persist only accepted learning changes

Follow one query through the proposed system: retrieve relevant evidence, explore a possible explanation, then retain only checked changes. The larger network persists while working activation fades. A hypothesis does not automatically become a fact.

There is another practical consequence. Not every flicker of relevance should become a database write. DOG becoming temporarily more active, CAT entering consideration, and DOG becoming less active are workspace events. Persisting each one would burden the store with the entire intermediate trace of a thought. Durable observations and accepted learning changes belong in persistent storage. Fast-changing activations and hypotheses can remain in RAM. Only changes that pass the learning process's criteria should cross that boundary. The biological comparison with working memory is useful at this level of organisation. It does not mean we have recreated the mechanism of biological working memory. It gives us a reason to separate what needs to survive between thoughts from what is only useful during the current one.

## Thinking before speaking

Once you have a workspace, **reasoning and verbalisation can be separated more explicitly.** A language model's output is generated through a next-token distribution, although the internal computation supporting it can be complex. In the proposed system, the result of reasoning could remain a relational state until a language layer is asked to express it. For the dog example, that state might connect a barking event to a possible explanation involving an entry event, together with evidence and uncertainty. It need not first become an English sentence. A language component could turn that structured result into a response for the reader.

That creates another obligation. The language layer has to stay faithful to the internal result. If the relational system says “possible cause”, the final sentence cannot quietly upgrade it to certainty. If the answer needs details the workspace never established, fluent wording should not supply them. It also leaves a major engineering question open: how capable does this language component need to be? It may turn out that a dense neural model is the best way to realise complex language. If so, its cost has to be included. Moving reasoning elsewhere does not make the cost of communication disappear.

The main hypothesis is still about scale. Can the system keep learning while the work needed for a particular class of thoughts remains tied mostly to relevant information? Can abstractions help it skip work? Can repeated successful reasoning become reusable structure? Imagine a question initially requiring a chain of twenty steps. After encountering similar cases, perhaps the system can learn a shorter route. You do something like this when a familiar problem begins to feel immediate. An explicit system could attempt a related kind of compilation: record a useful derived relation or rule, along with the conditions under which it remains valid.

![A cue reaches an answer through several reasoning steps; a learned conditional shortcut offers a shorter route.](https://prigoistic.me/assets/essays/intelligence-between-things/compilation.svg)

A learned shortcut could reduce repeated work. Its supporting conditions and dependencies must remain available for revision.

The shortcut must retain its dependencies. If a premise changes or an exception appears, the system needs to revise or withdraw the derived result. Otherwise, making inference cheaper just gives us a faster way to repeat an old mistake. HStore gives us a place to investigate the persistent side of this. We can grow the structure, run comparable queries, and measure what enters the workspace. **We can see whether retrieval cost follows the total store size or remains more closely tied to the relevant region.** The interesting result would be a demonstration that useful organisation lets a system avoid work while preserving the quality of its answers. Simply making an AI programme run on a CPU would tell us very little. Plenty already do.

## A system with a history

Now follow the proposal for a little longer. The persistent structure changes as experience accumulates. The current workspace changes as a question develops. Repeatedly useful patterns may become abstractions or rules. What would you call the model in a system like that? In a familiar training setup, it is convenient to think of a model as one learned object: choose an architecture, optimise its parameters, and run inference using the resulting state. Contemporary systems can of course add retrieval, tools, online updates and other forms of memory around that object. **I am interested in making the changing persistent organisation central to the design.** Part of the learned state would live in relations that have accumulated over time. Part would live in abstractions supported by repeated observations. The temporary workspace would hold what the current cue has made relevant. The mechanisms deciding how these parts interact would matter as much as the stored records.

That gives you several timescales. An active hypothesis may change in milliseconds. A recent association may survive for a while before it is confirmed, merged or discarded. A concept supported by many experiences may change slowly, while still remaining open to revision. Experience would affect the structures used for later inference; the outcomes of inference could themselves become evidence for future learning. That is the loop we want to make work. It is an architectural intention, not a result we get for free by putting a database in the middle. Stability becomes as important as speed. Keep adding structure without restraint and the store becomes harder to search and harder to trust. Remove information carelessly and you may destroy the evidence supporting a useful abstraction. Merge two concepts too eagerly and distinctions that matter can disappear.

Forgetting belongs inside this problem. Some observations should remain specific. Some can be consolidated after their useful regularity has been captured. Some relations should weaken when they stop helping prediction or when newer evidence contradicts them. A persistent system has to decide what deserves to remain available. Biological memory makes this familiar, although it does not hand us an implementation. You forget constantly. Most daily details never become durable memories, while a small number of experiences change how you interpret what happens later. A system that preserves every event perfectly may be a good archive without being a good model of adaptive cognition. The difficult trade-off is between plasticity and stability. A system needs to keep changing while retaining enough reliable organisation to make its accumulated experience useful. That problem appears again when we approach memory from a different mathematical direction.

## When memory is a landscape

Alongside explicit relational memory, we have been exploring associative memory at MetaCognition. In the work I have been thinking about as ***Can Your Attractors Adapt?***, the starting question is what happens when a memory system has to keep changing its dynamics as it learns. In a classical attractor picture, memories correspond to stable patterns of the system. A partial cue sets an initial condition, and the dynamics can move towards a stored pattern. An energy landscape is one way to describe this in models where the relevant conditions hold. [Hopfield networks](https://neuronaldynamics.epfl.ch/online/Ch17.S2.html) are a familiar example. Picture a ball on a surface with several valleys. Start it somewhere in one valley's basin and local downhill motion can take it towards the bottom. In the model, that destination stands in for a recovered pattern. The example below is deliberately simpler: one state moving through a one-dimensional double-well potential.

A partial cue, a stable state

![A state at x equals 0.38 on a double-well energy landscape. Gradient descent moves it towards the stable minimum at plus one.](https://prigoistic.me/assets/diagrams/intelligence-between-things/1.svg)

Diagram labels: −1 +1 E(x) = (x² − 1)² Two stable minima; the cue determines the initial state.

Cue position

Choose an initial position, then release the cue.

A one-dimensional illustration: a state follows downhill dynamics in the fixed potential E(x) = (x² − 1)². The two minima sit at −1 and +1. This shows convergence in a toy model; it does not demonstrate learning or biological memory.

For a fixed landscape, you can ask whether the intended stable states exist and which cues reach them. The challenge changes when new memories must be added and old ones must be revised. Moving the surface can alter a basin, displace a minimum, or change which initial conditions lead where. That is why a train-once-and-retrieve demonstration only answers part of the memory question. In a persistent setting, learning, retrieval and forgetting continue to interact. A new experience may need to change the organisation without destroying the useful memories already supported by it. In the relational proposal, the difficulty is keeping an expanding structure useful **without a combinatorial explosion**. In the associative proposal, it is keeping the dynamics useful **while their landscape changes.** The representations differ, but both require controlled change over time.

[![Published histograms compare basin sizes in a Hopfield network and an orthogonalized network at two memory loads.](https://prigoistic.me/assets/essays/intelligence-between-things/attractor-recall-basins.png)](https://prigoistic.me/assets/essays/intelligence-between-things/attractor-recall-study.png)

These published model results show why basin size matters. Compare the two columns as stored patterns increase from p = 10 to p = 20. Values near zero indicate patterns with little or no surrounding basin; larger Hamming distances mean more differences in a cue can still lead back to the stored pattern. Panel A of [Figure 5, Sampath and Srivastava (2020)](https://doi.org/10.1371/journal.pone.0238054.g005), *PLOS ONE*, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [Open the complete figure ↗](https://prigoistic.me/assets/essays/intelligence-between-things/attractor-recall-study.png).

I do not yet know whether these approaches should meet. An associative mechanism might help select the region of a relational store that becomes active. Explicit relations might help describe dependencies that are otherwise represented in distributed dynamics. Or the two could remain useful for quite different tasks. There is a more speculative direction I keep returning to. Perhaps treating memories only as separate attractor basins will turn out to be too restrictive. Could a persistent field description be useful, with a memory represented as a stable, recoverable configuration within it?

I am borrowing a mathematical question from field-based descriptions, not claiming that the brain literally implements quantum field theory. The point of the analogy is to ask whether a larger persistent medium, rather than a collection of independent memory objects, could be the useful starting description. For now, call one of these hypothetical memory patterns a ***mnemon***. The name does not establish a new physical entity or a solved theory. It is a placeholder for a question: **what configuration would make a pattern stable, distinguishable and recoverable, and how would it respond to new experience?** We would need equations, a definition of the state space, stability conditions and a useful retrieval task before that idea could become more than an analogy. It may fail at any of those steps. I want to leave it visible as speculation because it helps explain the direction of the questions, not because it belongs in a list of established mechanisms.

One route asks how information can become useful explicit structure. The other asks how it can become stable yet adaptable dynamics. Perhaps there is a bridge through the organisation of their state spaces, or through categorical descriptions of the relations involved. Perhaps combining them would make both worse. At this stage, those possibilities need experiments rather than a confident diagram ending in “cognition”.

## Where this could break

If you work in AI for long enough, you learn how easy it is to draw a convincing architecture. Name the components, connect them with arrows, and the gaps can start to look like engineering details. Sometimes the gaps contain the whole problem. The useful part of this proposal is that we can begin testing it without trying to build a general intelligence first. Start with something small enough that we can see what is happening. Give the learning process a byte stream, without a supplied word vocabulary or an ontology, and ask whether it discovers structure that earns its cost.

First, test compression. If a chunk represents repeated material, count the space required for the chunk, its dictionary entry and every reference to it. Compare the total description length with the uncompressed alternative and simple baselines. A shorter list of observations is not an improvement if the machinery needed to interpret it costs more than it saves. Then test context. Do recurring items begin to form useful contextual classes? Keep some examples out of the learning stream and test whether the classes help predict or organise those examples. A category that merely memorises the training sentences is not the abstraction we are looking for.

Then test relations and generalisation. Can the system preserve who did what to whom? Can it distinguish one event from another, or a belief about an event from an asserted fact? Can a relation or rule learned in one setting help with a new combination of familiar parts? Those are small, bounded questions. If the system cannot handle them, adding more stored information will not make the failure more interesting.

The central scaling test comes next. Grow the store from thousands of structures to millions, and further only if the earlier tests justify it. Hold the query family and answer-quality target reasonably comparable. Add unrelated material as well as relevant material, so we can distinguish the cost of knowing more from the cost of solving a harder problem. For each query, record:

- How many structures became active and how many relations were traversed.
- How many database reads and candidate checks retrieval required.
- How much RAM the workspace used, including its temporary indexes.
- How much CPU time and end-to-end latency the query consumed.
- Whether the answer remained correct, complete enough, and appropriately uncertain.

The desired result is that comparable queries touch a relatively small relevant portion of a growing store. The active workspace does not need to stay constant for every task. A harder question may require more work. **What matters is whether irrelevant growth makes ordinary questions proportionally more expensive.** If a billion stored structures force a routine query to activate half a billion of them, the sparse-inference hypothesis has failed for that workload. We should count that as a failure even if the system can eventually produce an answer.

Abstraction is another place to watch closely. DOG and CAT share one context; the resulting class overlaps another; that overlap suggests another abstraction. Without a constraint, the system could preserve an enormous number of possible groupings. Fast retrieval would not rescue a store in which most structures were unhelpful. **An abstraction needs to improve something measurable:** description length, prediction on held-out data, retrieval selectivity, or reasoning cost at a given level of accuracy. We also have to charge it for maintenance. A rule that speeds up one query but requires expensive updates everywhere else may be a poor trade.

Forgetting needs equally concrete tests. Let a relation decay, merge it into another, or remove the original observation after consolidation. Then check which supported behaviours survive and which fail. Keep track of the evidence that remains, so the system can distinguish a well-supported abstraction from a result whose premises have quietly disappeared.

Compilation should make repeated reasoning cheaper, but we need to test both sides of it. Measure whether repeated tasks require fewer steps. Then change a premise or introduce an exception and see whether the shortcut is revised. Speed without correction would be a rather efficient way to become wrong.

Finally, include the costs we would most like to leave outside the story. Learning the structure takes computation. Maintaining it takes storage and writes. Deciding relevance takes work. Producing language may require a substantial model. Compare the whole system on comparable tasks, including those costs, rather than only timing its most flattering lookup.

And there is a larger failure condition. Useful chunks might never become useful concepts. Contextual similarity might produce categories that help compression but do little for reasoning. Explicit representations might struggle with the ambiguity, perception or graded similarity that neural models handle well. In that case, a hybrid could be the useful outcome: neural representations for some kinds of perception and similarity, explicit structures for persistence and dependencies, and whichever processor fits each workload. The CPU-only hypothesis might fail while part of the persistent organisation remains valuable. The entire proposal might fail. I am comfortable with that, provided we can see where and why. The question has become specific enough to investigate: **can a system learn useful structure from information, keep access selective as it grows, and reduce the cost of familiar reasoning without losing its ability to revise what it knows?**

## Between things

Look back over the route we took. Cells competing and communicating. Tissue maintaining its organisation. A pattern moving through a grid. Working memory recruiting a sensory region. A tree that could not hold all the ways a dog mattered. Relations that become the contents of other relations. A cue making a small part of a much larger structure relevant. These are different mechanisms. They belong to different scales and carry different kinds of evidence. What keeps bringing me back to them is the question of how a system's organisation lets a local event change what becomes possible next. We tend to search for the thing that contains intelligence. The brain, then the neuron, then the synapse. In AI, the parameter, the embedding, the attention head, the model. Each is worth studying. But the behaviour we care about may depend on relationships that are hard to see when we keep zooming in.

A cell does not contain an account of the whole liver. A neuron does not contain a complete autobiographical memory. A Game of Life rule does not describe a glider. The collective behaviour depends on how parts are organised and how their states affect one another over time. That is the interpretation I keep returning to in *The empty brain*. We do not need to deny the physical changes left by experience. We need to be careful about the filing-cabinet picture those changes sometimes inherit in our language. What survives from an experience may be a changed disposition of the system: different connections, different excitability, a different organisation, a different route by which a later cue brings a state back into reach. Experience can alter the machinery through which the next experience is processed. History, in that picture, is active in the present. It has changed the thing doing the work.

This is also why I am interested in persistence as more than an external store attached to an otherwise unchanged model. I want to investigate systems in which new information keeps altering the structures and dynamics that will process later information. A current thought draws on that history without needing to activate all of it at once. That ambition leaves almost every difficult part on the table: learning useful units, grounding abstractions, selecting relevance, handling uncertainty, preserving stability, and making the costs add up. The biological analogies help us ask questions. They cannot settle those engineering and scientific questions for us. Still, perhaps the most useful abstraction to borrow from biology is the organisation around the neuron. Local units contributing to larger behaviour. Processes changing on different timescales. A small relevant region becoming active within a much larger persistent system. Learning changing what future computation can do. I started this rabbit hole wondering whether we could build intelligence without a neural network. Now the question I care about is slightly different. **If cognition is something a system continuously organises, what would it take to build a machine that can do the same?**

## Sources and further reading

The biological studies inform the questions in this essay. The architecture, sparse-inference tests and field-like memory proposal are directions for investigation.

1. [Ellis and colleagues, “Distinct modes of cell competition shape mammalian tissue morphogenesis”](https://www.nature.com/articles/s41586-019-1199-y), *Nature*, 2019.
2. [Levin and Mercola, “Gap Junctions Are Involved in the Early Generation of Left–Right Asymmetry”](https://www.sciencedirect.com/science/article/pii/S0012160698990248), *Developmental Biology*, 1998.
3. [Nogi and Levin, “Characterization of innexin gene expression and functional roles of gap-junctional communication in planarian regeneration”](https://www.sciencedirect.com/science/article/pii/S0012160605005956), *Developmental Biology*, 2005.
4. [Lobo, Beane and Levin, “Modeling Planarian Regeneration: A Primer for Reverse-Engineering the Worm”](https://doi.org/10.1371/journal.pcbi.1002481), *PLOS Computational Biology*, 2012. Source of the regeneration comparison.
5. [Pai and colleagues, “Transmembrane voltage potential controls embryonic eye patterning in Xenopus laevis”](https://pmc.ncbi.nlm.nih.gov/articles/PMC3243095/), *Development*, 2012.
6. [Michael Levin and Daniel C Dennett, “Cognition all the way down”](https://aeon.co/essays/how-to-understand-cells-tissues-and-organisms-as-agents-with-agendas), *Aeon*, 2020.
7. [Robert Epstein, “The empty brain”](https://aeon.co/essays/your-brain-does-not-process-information-and-it-is-not-a-computer), *Aeon*, 2016.
8. [Ester, Sprague and Serences, “Parietal and Frontal Cortex Encode Stimulus-Specific Mnemonic Representations during Visual Working Memory”](https://doi.org/10.1016/j.neuron.2015.07.013), *Neuron*, 2015.
9. [Christophel and colleagues, “Cortical specialization for attended versus unattended working memory”](https://www.nature.com/articles/s41593-018-0094-4), *Nature Neuroscience*, 2018.
10. [Dake and Curtis, “Perturbing human V1 degrades the fidelity of visual working memory”](https://www.nature.com/articles/s41467-025-57882-8), *Nature Communications*, 2025.
11. [Roy and colleagues, “Brain-wide mapping reveals that engrams for a single memory are distributed across multiple brain regions”](https://www.nature.com/articles/s41467-022-29384-4), *Nature Communications*, 2022.
12. [Kitamura and colleagues, “Engrams and circuits crucial for systems consolidation of a memory”](https://doi.org/10.1126/science.aam6808), *Science*, 2017.
13. [Brennan and Proekt, “Attractor dynamics with activity-dependent plasticity capture human working memory across time scales”](https://www.nature.com/articles/s44271-023-00027-8), *Communications Psychology*, 2023.
14. [Pagnoni and colleagues, “Byte Latent Transformer: Patches Scale Better Than Tokens”](https://arxiv.org/abs/2412.09871), 2024.
15. [Delétang and colleagues, “Language Modeling Is Compression”](https://arxiv.org/abs/2309.10668), 2023.
16. [Lenzo and colleagues, “Speech Recognition: Past, Present, and Future”](https://www.cs.cmu.edu/afs/cs/user/msiegler/www/ASR/futureofcmu-final.html), a Carnegie Mellon perspective.
17. [Erman, Hayes-Roth, Lesser and Reddy, “The HEARSAY-II Speech Understanding System: Integrating Knowledge to Resolve Uncertainty”](https://mas.cs.umass.edu/pub/paper_detail.php/229), *ACM Computing Surveys*, 1980.
18. [Gerstner and colleagues, *Neuronal Dynamics*, section 17.2](https://neuronaldynamics.epfl.ch/online/Ch17.S2.html), for an introduction to Hopfield attractor memory.
19. [HStore](https://github.com/metacoglabs/hypergraph) and [Memora](https://github.com/venkat1701/memora-sdk-core), the projects discussed in the essay.
