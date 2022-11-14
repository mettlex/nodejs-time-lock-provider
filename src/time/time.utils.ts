import fetch from "node-fetch";

const solanaUrls = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
];

const ethereumUrls = ["https://cloudflare-eth.com"];

const ethereumLikeUrls = [
  "https://polygon-rpc.com",
  "https://bsc-dataseed.binance.org",
  "https://api.avax.network/ext/bc/C/rpc",
];

const nearUrls = [
  "https://rpc.mainnet.near.org",
  "https://public-rpc.blockpi.io/http/near",
  "https://near-mainnet-rpc.allthatnode.com:3030",
];

export const getTimestamp = async () => {
  const solanaPromises: Promise<number | null>[] = [];
  const ethereumPromises: Promise<number | null>[] = [];
  const ethereumLikePromises: Promise<number | null>[] = [];

  solanaPromises.push(
    timeout(),
    ...solanaUrls.map((url) =>
      getCurrentTimestampFromSolana({
        url,
      }).catch(async (e) => {
        console.log(e);
        return timeout(4000);
      }),
    ),
  );

  const solanaTimestampPromise = new Promise((resolve) => {
    solanaPromises.map((x) =>
      x.then((x) => {
        resolve(x);
      }),
    );
  }) as Promise<number | null>;

  ethereumPromises.push(
    Promise.race([
      timeout(),
      ...ethereumUrls.map((url) =>
        getCurrentTimestampFromEthereum({
          url,
        }).catch(async (e) => {
          console.log(e);
          return timeout(4000);
        }),
      ),
    ]),
  );

  const ethereumTimestampPromise = new Promise((resolve) => {
    solanaPromises.map((x) =>
      x.then((x) => {
        resolve(x);
      }),
    );
  }) as Promise<number | null>;

  ethereumLikePromises.push(
    timeout(),
    ...ethereumLikeUrls.map((url) =>
      getCurrentTimestampFromEthereum({
        url,
      }).catch(async (e) => {
        console.log(e);
        return timeout(4000);
      }),
    ),
  );

  const ethereumLikeTimestampPromise = new Promise((resolve) => {
    ethereumLikePromises.map((x) =>
      x.then((x) => {
        resolve(x);
      }),
    );
  }) as Promise<number | null>;

  const nearPromises: Promise<number | null>[] = [];

  nearPromises.push(
    timeout(),
    ...nearUrls.map((url) =>
      getCurrentTimestampFromNEAR({
        url,
      }).catch(async (e) => {
        console.log(e);
        return timeout(4000);
      }),
    ),
  );

  const nearTimestampPromise = new Promise((resolve) => {
    nearPromises.forEach((x) =>
      x.then((x) => {
        resolve(x);
      }),
    );
  }) as Promise<number | null>;

  const timestamps = await Promise.all([
    solanaTimestampPromise,
    ethereumTimestampPromise,
    ethereumLikeTimestampPromise,
    nearTimestampPromise,
  ]);

  let timestamp = 0;

  for (let i = 0; i < timestamps.length; i++) {
    const t = timestamps[i];
    if (t) {
      if (t > timestamp) {
        timestamp = t;
      }
    }
  }

  return { timestamp };
};

async function getCurrentTimestampFromSolana({
  url,
}: {
  url: string;
}): Promise<number | null> {
  const headers = {
    "Content-Type": "application/json",
  };

  let query = `{"id":1, "jsonrpc":"2.0", "method":"getVersion"}`;

  let response = await fetch(url, {
    method: "POST",
    body: query,
    headers,
  }).catch((_e) => null);

  let version: string | null;

  try {
    version = ((await response.json()) as { result: { "solana-core": string } })
      .result["solana-core"];
  } catch (error) {
    version = null;
  }

  if (!version || !response) {
    return null;
  }

  let methodName = "getLatestBlockhash";

  if (version.startsWith("1.8")) {
    methodName = "getRecentBlockhash";
  }

  query = `{"id":1, "jsonrpc":"2.0", "method":"${methodName}"}`;

  response = await fetch(url, {
    method: "POST",
    body: query,
    headers,
  });

  const slot = (
    (await response.json()) as { result: { context: { slot: number } } }
  ).result?.context?.slot;

  if (!slot) {
    return null;
  }

  query = `{"jsonrpc":"2.0","id":1, "method":"getBlockTime","params":[${slot}]}`;

  response = await fetch(url, {
    method: "POST",
    body: query,
    headers,
  });

  const timestamp = ((await response.json()) as { result: number }).result;

  return timestamp;
}

async function getCurrentTimestampFromEthereum({
  url,
}: {
  url: string;
}): Promise<number> {
  const response = (await (
    await fetch(url, {
      headers: {
        accept: "application/json",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
      },
      body: '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}',
      method: "POST",
    })
  ).json()) as { result: { timestamp: string } };

  return Number(response.result.timestamp);
}

async function getCurrentTimestampFromNEAR({
  url,
}: {
  url: string;
}): Promise<number> {
  const body = JSON.stringify({
    jsonrpc: "2.0",
    id: "dontcare",
    method: "status",
    params: [],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const json = await fetch("https://rpc.mainnet.near.org", requestOptions).then(
    (response) => response.json(),
  );

  return Math.round(
    new Date(json.result.sync_info.latest_block_time).getTime() / 1000,
  );
}

function timeout(ms = 3000) {
  return new Promise((resolve) => {
    const tid = setTimeout(() => {
      clearTimeout(tid);
      resolve(null);
    }, ms);
  }) as Promise<null>;
}
