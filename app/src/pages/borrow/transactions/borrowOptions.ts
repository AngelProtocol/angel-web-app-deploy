import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { fabricateBorrow } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { WalletState, WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickBorrowResult } from 'pages/borrow/transactions/pickBorrowResult';
import { refetchMarket } from 'pages/borrow/transactions/refetchMarket';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

interface DependencyList {
  addressProvider: AddressProvider;
  post: WalletState['post'];
  client: ApolloClient<any>;
  walletStatus: WalletStatus;
}

export const borrowOptions = createOperationOptions({
  id: 'borrow/borrow',
  pipe: (
    { addressProvider, post, client, walletStatus }: DependencyList,
    storage,
  ) => [
    takeTxFee(storage, fabricateBorrow), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    getTxInfo(client), // TxResult -> { TxResult, TxInfo }
    injectTxFee(storage, refetchMarket(addressProvider, client, walletStatus)), // { TxResult, TxInfo } -> { TxResult, TxInfo, MarketBalanceOverview, MarketOverview, MarketUserOverview }
    pickBorrowResult, // { TxResult, TxInfo, MarketBalanceOverview, MarketOverview, MarketUserOverview } -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
