# Starter Product Agent Brief

This document is the product reference for agents working on Starter. Use it before proposing features, flows, copy, UI, or implementation details.

The current phase is product clarification before coding. Do not drift into broad UI design, technical architecture, or feature expansion unless the user explicitly asks for it.

## Core Concept

Starter is a mobile app that helps a user recover a bad day in a few minutes.

It is not:

- a classic meditation app
- a habit tracker
- a general journaling app
- a vague AI coach
- a full productivity system

The product is a reset button for bad days.

Main promise:

> You don't need to fix your life. You need to reset your day.

Short version:

> Bad day? Reset.

The user opens the app during real emotional friction: wasted time, doomscrolling, stress, anxiety, guilt, anger, low energy, lost focus, or the feeling that the day is already ruined.

The product must make the user feel:

> My day is not over. I can still restart.

## Positioning

Starter should stay simple:

> A reset button for bad days.

Other products sell life transformation, daily meditation, habit building, mood tracking, or morning journaling.

Starter sells a short, useful, actionable moment:

> Your day is not over. You can reset.

Do not promise a full life transformation. Promise recovery now.

## User Problem

The real problem is not only disorganization.

The real problem:

> When users lose part of their day, they often treat the whole day as ruined.

Typical thoughts:

- I started too late, so I might as well give up.
- I scrolled for two hours, so I am useless.
- I am too stressed to work.
- I am behind, so I will do nothing.
- I cannot get back into it.
- I just need something to tell me what to do now.

Starter must break this spiral with a short protocol.

## Product Question

Every product decision should answer this question:

> What helps the user recover now?

If a feature, screen, copy block, or metric does not help the user recover now, postpone it.

## Core Loop

1. The user opens the app because the day is going off track.
2. The user taps `Reset my day`.
3. The user chooses what happened.
4. The app proposes a short protocol.
5. The user follows the steps one by one.
6. The user completes the reset.
7. The app shows that they regained control.
8. The user leaves with one clear next action.

Target feeling:

> I was losing my day. Now I have taken back control.

## Strict MVP

The MVP should prove one thing:

> Do people come back to open the app when their day goes wrong?

MVP features:

- simple home
- choose problem
- reset protocol
- timer
- completion
- history
- simple profile/settings
- optional simple paywall

Avoid adding extra features in the first version.

## Home

The home has one job:

> I want to reset my day now.

Possible content:

- primary button: `Reset my day`
- short line: `Your day is not over.`
- last reset
- light streak
- optional access to emergency reset later

Avoid:

- complex dashboard
- charts
- advanced analytics
- social feed
- community features
- too many stats
- heavy gamification

## Choose Problem

After tapping `Reset my day`, the user chooses what derailed them.

MVP options:

- `I wasted time`
- `I feel anxious`
- `I'm stressed`
- `I lost focus`
- `I feel guilty`
- `I'm angry`
- `I have no energy`
- `I'm overwhelmed`
- `I need discipline`

This step must be fast. The user should recognize their state in a few seconds.

Do not ask for many details in the MVP.

## Reset Protocol

The reset protocol is the core product.

Recommended structure:

1. Reframe
2. Breathe
3. Clear
4. Write
5. Next move

### Reframe

Goal: break the mental spiral.

Examples:

- `You didn't ruin the day. You lost momentum. Get it back.`
- `Don't save the whole day. Save the next 20 minutes.`

### Breathe

Goal: quickly calm the nervous system.

Example:

- `Slow down. Breathe for 60 seconds.`

Breathing is only one step. It must not become the whole product.

### Clear

Goal: change the user's physical state.

Examples:

- drink water
- stand up
- stretch
- clear your desk
- open the window
- walk for 2 minutes

The product must remain actionable, not purely introspective.

### Write

Goal: clarify one thought.

Prompt examples:

- `What is one thing that would make today still count?`
- `What do you need to stop carrying right now?`
- `What is the next useful action?`

Keep writing short. This is not long-form journaling.

### Next Move

Goal: restart the day with one clear action.

Examples:

- `Start a 20-minute focus block.`
- `Send the message you are avoiding.`
- `Clean one small thing.`
- `Open the task and work for 10 minutes.`

The next move is crucial. It separates Starter from meditation and journaling apps.

## Timer

The timer is important for the MVP.

Without a timer, the app feels like advice.
With a timer, the app becomes an active tool.

Possible timers:

- 60 seconds for breathing
- 2 minutes for clearing
- 10 minutes for a short reset
- 20 minutes for a focus block

The timer should move the user into action.

## Completion

The completion moment should be simple and satisfying, not heavily gamified.

Primary message:

> Day reset.

Possible content:

- reset completed
- light streak update
- mood before/after
- `Start focus block`
- `Done`

Target emotion:

> I have taken back control.

## History

History gives the user personal proof that they can recover.

Each item can show:

- date
- selected problem
- reset type
- completed or abandoned
- mood before/after

Implicit message:

> Even when I go off track, I can come back.

## Streak

The streak must stay light and non-punitive.

It can represent:

- days with at least one reset
- total resets
- consecutive days where the user took back control

Avoid:

- `You broke your streak.`

Prefer:

- `Start again today.`

## Profile And Settings

Keep profile/settings minimal in the MVP.

Possible elements:

- notifications
- premium
- reset history access
- simple reset preferences
- account/settings

Do not overload this area.

## Editorial Tone

The tone must be:

- short
- clear
- human
- reassuring
- direct
- action-oriented

Good examples:

- `Your day is not over.`
- `You can reset.`
- `Win the next 20 minutes.`
- `One small action is enough to restart.`
- `You didn't ruin the day. You lost momentum.`
- `Don't save the whole day. Save the next step.`

Avoid:

- heavy therapeutic jargon
- medical claims
- guilt
- alpha-male cringe
- forced spirituality
- long text
- generic quotes

Default MVP voice:

> calm + practical

Do not add reset style selection to the main flow in the MVP.

## Reset Styles

Reset styles are post-MVP or premium.

Possible styles:

- Calm
- Strict
- Stoic
- Practical
- Spiritual
- Minimal

Example for `I wasted time`:

- Calm: `It's okay. One bad morning doesn't define your day.`
- Strict: `Stop negotiating with the past. Move now.`
- Stoic: `You don't control the lost hours. You control the next action.`
- Practical: `Drink water. Clear your desk. Start 20 minutes.`

For the MVP, use the default calm + practical voice.

## Post-MVP Ideas

These are valid ideas, but should not distract from the strict MVP.

Emergency Reset:

- for spiraling moments
- possible button: `I'm spiraling`
- must not position the app as a medical or therapeutic substitute

Morning Reset:

- woke up late
- bad sleep
- no energy
- doomscrolling in bed
- already behind
- promise: `Save the day before it collapses.`

Night Reset:

- failed day
- regret
- procrastination
- next-day stress
- promise: `End the day clean.`

Saved Protocols:

- user saves resets that work well
- examples: after doomscrolling, before deep work, after argument, Sunday anxiety

Weekly Insight:

- example: `You reset 4 times this week. Your biggest trigger was wasted time. Your best recovery action was focus block.`

Custom Reset:

- premium later
- user creates trigger, reframe, physical action, prompt, and next action

## Monetization

Possible model: freemium.

Free:

- 1 reset per day
- a few problems available
- limited history
- default style

Premium:

- unlimited resets
- all problems
- reset styles
- emergency reset
- morning reset
- night reset
- saved protocols
- weekly insights
- custom reset
- audio mode later

Possible prices:

- 4.99 EUR/month
- 29.99 EUR/year
- 39.99 EUR lifetime early adopter

Avoid aggressive weekly pricing.

## Product Risks

Risk: too close to journaling.
Solution: keep the protocol short, actionable, and centered on next move.

Risk: too close to meditation.
Solution: breathing is one step, not the product.

Risk: too close to a habit tracker.
Solution: avoid multiplying habits. Keep reset sessions as the core unit.

Risk: too vague.
Solution: every protocol must say exactly what to do.

Risk: guilt-inducing.
Solution: encouraging tone, never punitive.

## Agent Guardrails

When working as an agent on Starter:

- Start from the core loop before adding features.
- Prefer simple product decisions over comprehensive systems.
- Keep copy short and action-oriented.
- Protect the next move step.
- Keep breathing, writing, and streaks secondary to recovery.
- Do not add dashboards unless explicitly requested.
- Do not add broad analytics unless explicitly requested.
- Do not add AI coaching unless it serves a concrete reset protocol.
- Do not turn the app into a wellness platform.
- Do not introduce medical or therapeutic claims.
- If a feature does not help the user recover now, recommend postponing it.

## MVP Direction

The first version should focus on this experience:

1. I feel bad or my day is going off track.
2. I open Starter.
3. I choose what happened.
4. The app gives me a short protocol.
5. I follow the steps.
6. I leave with one clear action.

Everything outside this loop should be postponed.

The priority is not having many features.
The priority is creating one strong product moment:

> I was losing my day. I opened the app. Ten minutes later, I had taken back control.
