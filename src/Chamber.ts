import { ponder } from "ponder:registry";

import {
  chamber_Approval,
  chamber_ConfirmTransaction,
  chamber_Delegate,
  chamber_DelegationUpdated,
  chamber_Deposit,
  chamber_DirectorshipChanged,
  chamber_ExecuteSetSeats,
  chamber_ExecuteTransaction,
  chamber_Initialized,
  chamber_QuorumUpdated,
  chamber_Received,
  chamber_RevokeConfirmation,
  chamber_SeatUpdateCancelled,
  chamber_SetSeats,
  chamber_SubmitTransaction,
  chamber_Transfer,
  chamber_Undelegate,
  chamber_Withdraw,
} from "ponder:schema";

ponder.on("Chamber:Approval", async ({ context, event }) => {
  await context.db.insert(chamber_Approval).values({
    id: event.log.id,
    owner: event.args.owner,
    spender: event.args.spender,
    value: event.args.value,
  });
});

ponder.on("Chamber:ConfirmTransaction", async ({ context, event }) => {
  await context.db.insert(chamber_ConfirmTransaction).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
  });
});

ponder.on("Chamber:Delegate", async ({ context, event }) => {
  await context.db.insert(chamber_Delegate).values({
    id: event.log.id,
    sender: event.args.sender,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
  });
});

ponder.on("Chamber:DelegationUpdated", async ({ context, event }) => {
  await context.db.insert(chamber_DelegationUpdated).values({
    id: event.log.id,
    agent: event.args.agent,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
  });
});

ponder.on("Chamber:Deposit", async ({ context, event }) => {
  await context.db.insert(chamber_Deposit).values({
    id: event.log.id,
    sender: event.args.sender,
    owner: event.args.owner,
    assets: event.args.assets,
    shares: event.args.shares,
  });
});

ponder.on("Chamber:DirectorshipChanged", async ({ context, event }) => {
  await context.db.insert(chamber_DirectorshipChanged).values({
    id: event.log.id,
    account: event.args.account,
    tokenId: event.args.tokenId,
    isDirector: event.args.isDirector,
  });
});

ponder.on("Chamber:ExecuteSetSeats", async ({ context, event }) => {
  await context.db.insert(chamber_ExecuteSetSeats).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    seats: event.args.seats,
  });
});

ponder.on("Chamber:ExecuteTransaction", async ({ context, event }) => {
  await context.db.insert(chamber_ExecuteTransaction).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
  });
});

ponder.on("Chamber:Initialized", async ({ context, event }) => {
  await context.db.insert(chamber_Initialized).values({
    id: event.log.id,
    version: event.args.version,
  });
});

ponder.on("Chamber:QuorumUpdated", async ({ context, event }) => {
  await context.db.insert(chamber_QuorumUpdated).values({
    id: event.log.id,
    oldQuorum: event.args.oldQuorum,
    newQuorum: event.args.newQuorum,
  });
});

ponder.on("Chamber:Received", async ({ context, event }) => {
  await context.db.insert(chamber_Received).values({
    id: event.log.id,
    sender: event.args.sender,
    amount: event.args.amount,
  });
});

ponder.on("Chamber:RevokeConfirmation", async ({ context, event }) => {
  await context.db.insert(chamber_RevokeConfirmation).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
  });
});

ponder.on("Chamber:SeatUpdateCancelled", async ({ context, event }) => {
  await context.db.insert(chamber_SeatUpdateCancelled).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
  });
});

ponder.on("Chamber:SetSeats", async ({ context, event }) => {
  await context.db.insert(chamber_SetSeats).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    numOfSeats: event.args.numOfSeats,
  });
});

ponder.on("Chamber:SubmitTransaction", async ({ context, event }) => {
  await context.db.insert(chamber_SubmitTransaction).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
    to: event.args.to,
    value: event.args.value,
    data: event.args.data,
  });
});

ponder.on("Chamber:Transfer", async ({ context, event }) => {
  await context.db.insert(chamber_Transfer).values({
    id: event.log.id,
    from: event.args.from,
    to: event.args.to,
    value: event.args.value,
  });
});

ponder.on("Chamber:Undelegate", async ({ context, event }) => {
  await context.db.insert(chamber_Undelegate).values({
    id: event.log.id,
    sender: event.args.sender,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
  });
});

ponder.on("Chamber:Withdraw", async ({ context, event }) => {
  await context.db.insert(chamber_Withdraw).values({
    id: event.log.id,
    sender: event.args.sender,
    receiver: event.args.receiver,
    owner: event.args.owner,
    assets: event.args.assets,
    shares: event.args.shares,
  });
});
