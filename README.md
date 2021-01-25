# Unofficial Aave api & more?

I noticed that there are a lot of projects visualizing aave data in some way doing the same kind of aggregations & calculations either in background or on the client.
Therefor I created this api repository which will automatically be deployed to vercel.

## Getting Started

First, run the development database. If you got a local mongo running - great. If not you can start on in-memory by running `npm run db:mem` or `npm run db:mem:persist` - the latter one saves the db to a .gitignore database folder, so that data is persisted throughout reboots. After that, you can run `npm run dev` to start a local dev server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
dhshdjas
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
