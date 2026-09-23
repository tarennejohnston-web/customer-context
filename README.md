# Customer Context

Customer Context is an AI powered Customer Success research assistant.

**Turn basic customer information into a practical account brief before a customer conversation.**

## The problem

CSMs often manage many accounts at once. Researching every customer from scratch takes time, but going into a conversation without context can make the interaction less relevant.

This project explores a small, focused use of AI: helping a CSM get to useful customer context faster while keeping human judgment in the loop.

## What it generates

For each customer, the tool creates:

- Customer snapshot
- Likely business priorities
- Potential challenges
- Questions a CSM should ask
- Potential value opportunities
- Risks to watch

The prompt explicitly tells the model not to invent facts and to distinguish known information from reasonable hypotheses.

## AI architecture

The browser collects the customer inputs and sends them to a server side Vercel Function at `/api/generate`.

The server side function calls the OpenAI Responses API using an environment variable named `OPENAI_API_KEY`. The API key is never exposed in the browser or committed to GitHub.

The project uses GPT 5.6 Luna for a cost conscious customer research workflow.

## Demo

The included Apapacho Wines example uses supplied demo notes about a wine business shipping temperature sensitive products. The generated analysis should be treated as a working hypothesis unless the underlying company information has been independently verified.

## Guardrails

This is a decision support tool, not a source of truth.

The prompt is designed to:

1. Separate supplied information from inference
2. Avoid fabricated company facts
3. Keep recommendations tied to the customer's stated context
4. Give the CSM questions to validate assumptions with the customer

## Stack

HTML, CSS, JavaScript, Vercel Functions, OpenAI Responses API

## Run locally

1. Install Node.js.
2. Set `OPENAI_API_KEY` in your local environment.
3. Serve the project through Vercel or another server that supports the `/api` function.
4. Open the site and enter a customer.

For deployment, add `OPENAI_API_KEY` as a Vercel Environment Variable rather than putting it in source code.

Built as an AI learning project by Tarenne Johnston.
