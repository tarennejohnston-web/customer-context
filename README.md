# Customer Context

Customer Context is a small AI learning project designed around a practical Customer Success problem:

**How can a CSM get enough customer context to have a better conversation without spending a large amount of time researching every account?**

## What it does

The prototype takes basic customer information and produces a structured conversation brief covering:

- Customer snapshot
- Business priorities
- Potential challenges
- Questions to ask
- Potential value opportunities
- Risks to watch

The demo uses Apapacho Wines as an example input. The example output is intentionally framed as hypotheses rather than verified company facts.

## Why I built it

Customer Success teams often manage many accounts at once. Researching every customer from scratch can take significant time, but going into a conversation without context can make the interaction less relevant.

This project explores how AI can help a CSM get to useful context faster while keeping human judgment in the loop.

## What I learned

I focused on three things:

1. Turning a real workflow problem into a small product
2. Designing AI output around a specific user rather than asking for a generic summary
3. Making the tool explicit about assumptions so AI generated information is not treated as fact

## Next step

The current version is a frontend prototype with a sample customer brief. The next iteration can connect the interface to an LLM through a server side API route so the brief is generated dynamically from the customer's inputs.

## Tech

HTML, CSS, JavaScript

Built as part of my ongoing exploration of AI, Customer Success, and workflow improvement.
