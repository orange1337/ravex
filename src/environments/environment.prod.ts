const chain = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
export const environment = {
    production: false,
    currency: 'EOS',
    market: 'simplemarket',
    asset: 'simpleassets',
    explorer: 'https://bloks.io',
    tables: {
          authors: 'authors',
          assets: 'sassets',
          claims: 'offers',
          delegates: 'delegates',
          assetsFt: 'accounts'
    },
    network: {
        blockchain: 'eos',
        host: 'bp.cryptolions.io',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://bp.cryptolions.io',
        chainId: chain,
        verbose: false
    }
};
