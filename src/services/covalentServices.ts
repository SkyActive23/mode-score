import axios from 'axios';

interface CovalentItem {
  eth_address: string;
  chain_id: string;
}
interface getTokenBalances {
  eth_address: string;
  chain_id: string;
}
interface getTokenTransfers {
  eth_address: string;
  chain_id: string;
  contract_address: string;
}

const COVALENT_KEY = process.env.NEXT_PUBLIC_COVALENT_KEY;

const acceptedChainIds = ['1', '34443', '919', '11155111']; // Ethereum Mainnet Mode Mainnet, Mode Testnet, Sepolia Testnet

/*
const CACHE_KEY = 'defiTokenList';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
*/

export const getTransactions = async (data: CovalentItem) => {
  if (!acceptedChainIds.includes(data.chain_id)) {
    throw new Error('Unsupported chain ID');
  }

  try {
    const response = await axios.get(`https://api.covalenthq.com/v1/${data.chain_id}/address/${data.eth_address}/transactions_v2/?key=${COVALENT_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getAssets = async (data: CovalentItem) => {
  const response = await axios.get(`https://api.covalenthq.com/v1/${data.chain_id}/address/${data.eth_address}/balances_v2/?key=${COVALENT_KEY}`);
  return response.data;
};

export const getCreditScore = async (data: CovalentItem) => {
  if (!acceptedChainIds.includes(data.chain_id)) {
    throw new Error('Unsupported chain ID');
  }


  try {
    const response = await axios.post('https://jm-mode-score.onrender.com/credit_score/covalent', {
      chainid: data.chain_id,
      eth_address: data.eth_address,
      covalent_key: COVALENT_KEY,
      coinmarketcap_key: process.env.NEXT_PUBLIC_COINMARKETCAP_KEY,
    },{
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching credit score:', error);
    throw error;
  }
};

/*
export const getDeFiTokens = async () => {
  // Check if we have a cached list that's still valid
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { timestamp, tokens } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return tokens;
    }
  }

  // If no valid cached data, fetch from API
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category';
  try {
    const response = await axios.get(url, {
      params: {
        category: 'defi',
        limit: 100, // Adjust this number based on your needs
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_COINMARKETCAP_KEY,
      },
    });

    const tokens = response.data.data.coins.map((coin: { symbol: any; }) => coin.symbol);

    // Cache the fetched data
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      tokens: tokens
    }));

    return tokens;
  } catch (error) {
    console.error('Failed to fetch DeFi tokens:', error);
    // If API call fails, return cached data if available, otherwise an empty array
    return cachedData ? JSON.parse(cachedData).tokens : [];
  }
};
*/

export const getTokenBalances = async ( data: getTokenBalances ) => {
  const url = `https://api.covalenthq.com/v1/${data.chain_id}/address/${data.eth_address}/balances_v2/`;
  const response = await axios.get(url, {
    params: {
      "quote-currency": "USD",
      "nft": false,
      "no-spam": true,
    },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
    },
  });
  return response.data;
};

export const getTokenTransfers = async (data: getTokenTransfers) => {
  const url = `https://api.covalenthq.com/v1/${data.chain_id}/address/${data.eth_address}/transfers_v2/`;
  const response = await axios.get(url, {
    params: {
      "quote-currency": "USD",
      "contract-address": data.contract_address,
      "page-size": 100,
    },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`,
    },
  });
  return response.data;
};


// Define the type for the tokens
type Token = string;
const TOP_70_DEFI_TOKENS: Token[] = [
  "UNI",   // Uniswap
  "LINK",  // Chainlink
  "AAVE",  // Aave
  "SNX",   // Synthetix
  "MKR",   // Maker
  "YFI",   // Yearn.finance
  "COMP",  // Compound
  "SUSHI", // SushiSwap
  "CRV",   // Curve
  "RUNE",  // Thorchain
  "BAL",   // Balancer
  "1INCH", // 1inch
  "LRC",   // Loopring
  "REN",   // Ren
  "ZRX",   // 0x
  "KNC",   // Kyber Network
  "BNT",   // Bancor
  "GRT",   // The Graph
  "LEND",  // Aave (legacy)
  "SRM",   // Serum
  "FIL",   // Filecoin
  "SAND",  // The Sandbox
  "MATIC", // Polygon
  "ALCX",  // Alchemix
  "DF",    // dForce
  "GALA",  // Gala
  "FARM",  // Harvest Finance
  "SFI",   // Standard Protocol
  "MTA",   // Meta
  "CVC",   // Civic
  "BNT",   // Bancor Network Token
  "RGT",   // Rally
  "DODO",  // DODO
  "Hegic", // Hegic
  "PUNK",  // Polkamarkets
  "RLY",   // Rally
  "MITH",  // Mithril
  "DIA",   // DIA
  "COTI",  // COTI
  "LDO",   // Lido
  "DNT",   // district0x
  "COVER", // Cover Protocol
  "PERL",  // Perlin
  "NKN",   // NKN
  "IOST",  // IOST
  "SRM",   // Serum
  "CHZ",   // Chiliz
  "DODO",  // DODO
  "XEM",   // Nem
  "BAND",  // Band Protocol
  "STPT",  // Stably
  "FLOKI", // Floki Inu
  "HARD",  // Harvest Finance
  "TWT",   // Trust Wallet Token
  "XVS",   // Venus
  "RLC",   // iExec
  "AKRO",  // Akropolis
  "GNO",   // Gnosis
  "FLOKI"  // Floki Inu
];


interface CachedData {
  timestamp: number;
  tokens: Token[];
}

const CACHE_KEY = 'deFiTokensCache'; // Define your cache key here
const CACHE_DURATION = 3600000; // Example: 1 hour in milliseconds

export const getDeFiTokens = async (): Promise<Token[]> => {
  // Check if we have a cached list that's still valid
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { timestamp, tokens }: CachedData = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return tokens;
    }
  }

  // Use the provided tokens JSON object instead of making an API call
  const tokens: Token[] = TOP_70_DEFI_TOKENS;

  // Cache the tokens
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    tokens: tokens
  }));

  return tokens;
};
