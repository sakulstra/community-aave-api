# Unofficial Aave api & more?

I noticed that there are a lot of projects visualizing aave data in some way doing the same kind of aggregations & calculations either in background or on the client.
Therefor I created this api repository which will automatically be deployed to vercel.

## Getting Started

First, run the development database. If you got a local mongo running - great. If not you can start on in-memory by running `npm run db:mem` or `npm run db:mem:persist` - the latter one saves the db to a .gitignore database folder, so that data is persisted throughout reboots. After that, you can run `npm run dev` to start a local dev server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Quick start

```bash
# npm run db:mem:persist // only needed when using mongo
yarn dev
# watch for query changes
yarn codegen:watch
```

### Add a new api endpoint

1. create a new file in `pages/api`, e.g. test-endpoint.ts

## Contribute

Feel free to refine & propose new endpoints!
Ideas:

- tlv
- fees
- liquidations
- markets data

## Used tools

I want this thing to be cheap and easy to extend.
Therefor I use a serverless architecture based on:

- github actions ci for refreshing the cache
- mongodb at the moment as atlas provides a generous free tier (might migrate to fauna, as mongodb is poor on serverless :sob:)
- vercel for hosting & cdn as I already pay for it, and it has a flat fee :shrug:
