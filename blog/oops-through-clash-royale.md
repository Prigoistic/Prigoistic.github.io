# Understanding Principles of OOP Through Clash Royale

Inheritance, polymorphism, encapsulation, and composition, explained through the troops, buildings, and battles of Clash Royale.

Author: Priyam Ghosh
Published: February 19, 2026
Canonical: https://prigoistic.me/blog/oops-through-clash-royale.html
Keywords: object-oriented programming, Java, inheritance, polymorphism, game design

When I first read about the principles of Object Oriented Programming, it totally went over my head. I could not grasp what those principles intended to mean. But I used to play a lot of games back in the day, especially Clash of Clans and Clash Royale, and I feel RPG games are the best use case of OOP concepts.

Everyone at some point has played Clash Royale. So many roles and classes in the game. Barbarians, Archers, Giants, Wizards, but all of them have some shared properties.

Think of a **[class](https://en.wikipedia.org/wiki/Class_(computer_programming))** as a race of entities in the game, like Skeletons or Goblins.

Whereas **[objects](https://en.wikipedia.org/wiki/Object_(computer_science))** are like an instance of that class, like Skeleton Army or Goblin Barrel, with their own method injections.

All the entities in Clash Royale have a fixed set of properties. HP, attack power, position, and so on.

So instead of rewriting HP, `takeDamage()`, `destroy()` functions for every single troop class, we create a base blueprint.

Let us call that blueprint a **GameEntity**. The very fundamental block of the game. Every character, every troop, every building has the properties of GameEntity.

```java
class GameEntity {
    int health;
    int x, y;

    void takeDamage(int amount) { ... }
    void destroy() { ... }
}
```

Now when we create something like

```java
class Troop extends GameEntity { ... }
class Building extends GameEntity { ... }
```

These classes automatically gain health, damage handling, and destruction logic. No rewriting. No copy pasting. Just extension.

· · ·

## Inheritance and the "Is-A" Chain

An Ice Wizard *is a* Wizard. A Wizard *is a* Troop. A Troop *is a* GameEntity.

Which means writing something like

```java
GameEntity x = new Wizard();
```

is perfectly valid.

This whole chain of "is-a" relationships is **[inheritance](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming))**. But inheritance is not only about copying code.

A Wizard must behave like a Troop in every context where a Troop is expected. If somewhere in the engine we have

```java
void applyRange(Troop t) { ... }
```

we should be able to pass a Wizard, an Archer, a P.E.K.K.A, without any problem. This idea, that a child must be safely usable as its parent, is called the **[Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)**.

> If a function expects a parent type, any child type must work without breaking anything.

And this whole system of "one blueprint extends another" is what we call inheritance.

· · ·

## Polymorphism: Same Call, Different Chaos

Now let us go back into Clash Royale. Your opponent unleashed a P.E.K.K.A with a Skeleton Army, a great tactic honestly. Both of these entities have `attack()` but the attacking style of P.E.K.K.A and Skeleton Army are wildly different.

P.E.K.K.A is slow but hits hard and costs seven Elixir. Skeleton Army needs three Elixir but as a swarm they attack quick.

But from the Game Engine's point of view, it just wants to say

```java
t.attack();
```

It does not care if `t` is P.E.K.K.A or Skeleton Army.

The same method call behaves differently depending on what the actual object is. And this is so beautiful, as Kshitij Sir says, that you can add anything and it inherits all its methods.

SAME INTERFACE. DIFFERENT BEHAVIOURS.

```java
class Troop {
    void attack() { }
}

class PEKKA extends Troop {
    void attack() { swingIronSword(); }
}

class SkeletonArmy extends Troop {
    void attack() { swingBoneSword(); }
}
```

When you rewrite a method like this, the child replaces the parent behavior. This is **[method overriding](https://en.wikipedia.org/wiki/Method_overriding)**.

The engine calls `attack()`. At runtime, Java decides which actual version to run based on the real object. That runtime behavior switching is called **[dynamic binding](https://en.wikipedia.org/wiki/Dynamic_dispatch)**.

And this entire concept, same method, different behavior, that is called **[polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science))**.

· · ·

## Overloading: Same Name, Different Intent

Now contrast that with overloading. Overloading is when the method name is the same but the parameters are different.

```java
attack()
attack(Building target)
attack(Troop target)
```

Same name but with different intent. The compiler picks the right version at compile time based on the argument types. That is called **[compile-time polymorphism](https://en.wikipedia.org/wiki/Function_overloading)**.

Overriding is runtime polymorphism. Overloading is compile-time polymorphism.

> When you override, the method signature must match exactly.
>  When you overload, the signature must differ.

· · ·

## Encapsulation: Protecting the Arena

Now imagine if every part of Clash Royale could directly modify a troop's health. Some random class could just do

```java
wizard.health = -5000;
```

Which is so wrong.

Instead we hide health. We make it **[private](https://en.wikipedia.org/wiki/Access_modifiers)** so that no one can touch it directly. They must use controlled methods like

```java
takeDamage(int amount)
heal(int amount)
```

So that we can control the rules. Maybe health cannot drop below zero. Maybe Elixir regains after a cooldown. Maybe certain troops have damage resistance.

By hiding internal state and exposing controlled methods, we protect the system. And that hiding of data and forcing interaction through methods, this is called **[encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming))**.

> This actually keeps your game logic safe so that no one can directly inject random values into your Clash Royale game.

· · ·

## Abstraction: The Prince's Charge

Now picture this.

You are staring at the code for the Prince. He is not just a bundle of stats. He has a personality. He has that iconic, terrifying **Charge**.

Now think about what actually happens when he starts running. It is a mess of math. The code has to track how many tiles he has moved without stopping. It has to calculate a gradual speed ramp-up. It has to trigger the white streak visual effect behind his pony. It has to load that trumpet sound effect. And finally, it has to tell the game, "Hey, next time he hits something, multiply the damage by two."

If you forced the main Game Engine to handle all that micromanagement, the code would be a disaster. The Engine is like a busy director on a movie set. It does not have time to tell the actor how to breathe or tie his shoes.

**So you lie to the Engine.**

You hide all that messy, complex logic inside a nice, clean box. You create a simple command, an abstraction, called `initiateCharge()`.

The Engine does not know how the speed is calculated. It does not know why the damage doubles. It does not care about the physics of the pony. It just looks at the Prince and says, "Charge."

**Suddenly, the complexity vanishes.**

The same goes for the Witch. Think about her summoning skeletons. Inside her logic, it is a nightmare of grid coordinates. Is there space to the left? Is there a wall to the right? Which level are the skeletons?

But to the outside world? It is just `witch.summon()`.

That is the beauty of **[abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science))**.

It allows you to look at a complex object, like a P.E.K.K.A with her heavy, slow swing timers and butterfly distractions, and treat it like a simple tool. You expose *what* the card does. But you ruthlessly hide *how* she does it.

> It saves your brain from exploding. It reduces the mental load so you can focus on the fun stuff, like game balance, instead of debugging skeleton spawn coordinates.

· · ·

## Encapsulation vs Abstraction

Here is the difference that trips people up.

**[Encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming))** is like the Prince's armor. It protects his internal data, like his Health Points, so nothing outside can accidentally reach in and break him.

**[Abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science))** is like the Prince's reputation. Everyone knows what he does, he charges. But nobody needs to know his internal workout routine or his diet plan to fear him. You know the action, not the details.

ONE PROTECTS THE CODE.
 THE OTHER SIMPLIFIES IT.

· · ·

## Composition Over Inheritance

Let us zoom out and look at how we actually build these legendary troops.

The instinct is often to say a Dragon *is a* Fire Creature. It feels natural. But in code, that "is-a" relationship is a trap. If you say `Dragon extends Fire`, you have locked that dragon's destiny. It can never be an Ice Dragon. It can never be an Electro Dragon. You have hard-coded its biology.

The smarter move is **[composition](https://en.wikipedia.org/wiki/Composition_over_inheritance)**. You do not tell the engine the Dragon *is* fire, you tell the engine the Dragon *has* a FireBreath component.

Think of it like equipping a character in an RPG. You take a generic Flying Unit body, and you plug in a Fire Module. Later, when you want to make a Wizard, you do not need to rewrite the code for fire. You just take that same Fire Module and plug it into a Ground Unit body. If you want a Lava Hound? Plug in the fire module and the flying module, but swap the skin.

> Inheritance is rigid. It is a family tree you cannot escape.
>  Composition is flexible. It is a bucket of Lego bricks you can snap together however you want.

If you rely too heavily on inheritance, you end up with a nightmare structure. You start with GameEntity, then branch to Troop, then GroundTroop, then HeavyGroundTroop, and finally P.E.K.K.A. But what happens when you want a FlyingP.E.K.K.A? You are stuck. You cannot inherit from both FlyingTroop and HeavyGroundTroop without breaking the logic. Your tree explodes.

· · ·

## The Diamond Problem

This leads us to the most dangerous trap in C++: **[the Diamond Problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem)**.

Imagine you ignore the warnings and try to make a Dragon by inheriting from both FlyingUnit and FireUnit. It sounds powerful. But here is the catch, both FlyingUnit and FireUnit probably inherit from the base GameEntity class to get their health bars.

So now your Dragon is born. The game engine looks at it and sees **two paths back to GameEntity**. It sees two health bars. Two position coordinates. Two `die()` functions. When an Archer shoots your Dragon, which health bar goes down? The one from the Flying side, or the one from the Fire side?

**The computer does not know. It is ambiguous. The game crashes.**

Java saw this mess and drew a hard line in the sand. The architects of Java said, "No more multiple inheritance for classes."

In Java, a Dragon can only have one parent. It can extend Troop. That is it. That avoids the diamond ambiguity because there is only ever one copy of the health bar, one copy of the state.

· · ·

## Interfaces: Contracts Without Baggage

But you still need the Dragon to do multiple things, right? You need it to fly and breathe fire. So Java uses **[interfaces](https://en.wikipedia.org/wiki/Interface_(Java))**.

An interface is just a contract. It has no state, no health bars, no variables, just a list of empty promises.

```java
class Dragon extends Troop implements Flyable, Burnable {
    void fly() { ... }
    void breatheFire() { ... }
}
```

Because Flyable is just a contract saying "I know how to flap wings," there is no data to conflict. You can sign a hundred contracts, but you can only have one body.

> Interfaces let you say what a class can do without dictating what it is.

· · ·

## The Battle Is Just Objects

When you look at Clash of Clans through this lens, the magic fades, but the elegance appears. The chaotic battle is just a symphony of objects.

The Barbarian is an object with a pathfinding behavior. The Town Hall is an object with a storage state. The Dragon is an object composed of flight logic and attack logic. They are all just instances of classes, protecting their internal data with encapsulation, hiding their complex math with abstraction, and interacting through the clean, safe rules we designed.

Every raid is just millions of lines of code asking:

WHAT STATE ARE YOU IN,
 AND WHAT IS YOUR NEXT BEHAVIOR?

Anyway, not sure if I answered the question. But I think it would have helped me if someone had explained it this way when I first started programming. It is kind of funny that I remember making a post years ago about how I "mastered OOP" and I did not even know what composition meant at that time.

Written by Priyam · 19 February 2026
