import type { Context, Event } from "ponder:registry";
import {
  chamber_Approval,
  chamber_ConfirmTransaction,
  chamber_Delegate,
  chamber_DelegationUpdated,
  chamber_Deposit,
  chamber_ExecuteSetSeats,
  chamber_ExecuteTransaction,
  chamber_Initialized,
  chamber_Received,
  chamber_RevokeConfirmation,
  chamber_SeatUpdateCancelled,
  chamber_SetSeats,
  chamber_SubmitTransaction,
  chamber_Transfer,
  chamber_Undelegate,
  chamber_Withdraw,
} from "ponder:schema";

import { applyShareTransfer, asHex } from "./lib/directory";

export async function handleApproval({
  context,
  event,
}: {
  context: Context<"Chamber:Approval">;
  event: Event<"Chamber:Approval">;
}) {
  await context.db.insert(chamber_Approval).values({
    id: event.log.id,
    owner: event.args.owner,
    spender: event.args.spender,
    value: event.args.value,
  });
}

export async function handleConfirmTransaction({
  context,
  event,
}: {
  context: Context<"Chamber:ConfirmTransaction">;
  event: Event<"Chamber:ConfirmTransaction">;
}) {
  await context.db.insert(chamber_ConfirmTransaction).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
  });
}

export async function handleDelegate({
  context,
  event,
}: {
  context: Context<"Chamber:Delegate">;
  event: Event<"Chamber:Delegate">;
}) {
  await context.db.insert(chamber_Delegate).values({
    id: event.log.id,
    sender: event.args.sender,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
  });
}

export async function handleDelegationUpdated({
  context,
  event,
}: {
  context: Context<"Chamber:DelegationUpdated">;
  event: Event<"Chamber:DelegationUpdated">;
}) {
  await context.db.insert(chamber_DelegationUpdated).values({
    id: event.log.id,
    holder: event.args.holder,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
  });
}

export async function handleDeposit({
  context,
  event,
}: {
  context: Context<"Chamber:Deposit">;
  event: Event<"Chamber:Deposit">;
}) {
  await context.db.insert(chamber_Deposit).values({
    id: event.log.id,
    sender: event.args.sender,
    owner: event.args.owner,
    assets: event.args.assets,
    shares: event.args.shares,
  });
}

export async function handleExecuteSetSeats({
  context,
  event,
}: {
  context: Context<"Chamber:ExecuteSetSeats">;
  event: Event<"Chamber:ExecuteSetSeats">;
}) {
  await context.db.insert(chamber_ExecuteSetSeats).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    seats: event.args.seats,
  });
}

export async function handleExecuteTransaction({
  context,
  event,
}: {
  context: Context<"Chamber:ExecuteTransaction">;
  event: Event<"Chamber:ExecuteTransaction">;
}) {
  await context.db.insert(chamber_ExecuteTransaction).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
  });
}

export async function handleInitialized({
  context,
  event,
}: {
  context: Context<"Chamber:Initialized">;
  event: Event<"Chamber:Initialized">;
}) {
  await context.db.insert(chamber_Initialized).values({
    id: event.log.id,
    version: event.args.version,
  });
}

export async function handleReceived({
  context,
  event,
}: {
  context: Context<"Chamber:Received">;
  event: Event<"Chamber:Received">;
}) {
  await context.db.insert(chamber_Received).values({
    id: event.log.id,
    sender: event.args.sender,
    amount: event.args.amount,
  });
}

export async function handleRevokeConfirmation({
  context,
  event,
}: {
  context: Context<"Chamber:RevokeConfirmation">;
  event: Event<"Chamber:RevokeConfirmation">;
}) {
  await context.db.insert(chamber_RevokeConfirmation).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
  });
}

export async function handleSeatUpdateCancelled({
  context,
  event,
}: {
  context: Context<"Chamber:SeatUpdateCancelled">;
  event: Event<"Chamber:SeatUpdateCancelled">;
}) {
  await context.db.insert(chamber_SeatUpdateCancelled).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
  });
}

export async function handleSetSeats({
  context,
  event,
}: {
  context: Context<"Chamber:SetSeats">;
  event: Event<"Chamber:SetSeats">;
}) {
  await context.db.insert(chamber_SetSeats).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    numOfSeats: event.args.numOfSeats,
  });
}

export async function handleSubmitTransaction({
  context,
  event,
}: {
  context: Context<"Chamber:SubmitTransaction">;
  event: Event<"Chamber:SubmitTransaction">;
}) {
  await context.db.insert(chamber_SubmitTransaction).values({
    id: event.log.id,
    tokenId: event.args.tokenId,
    nonce: event.args.nonce,
    to: event.args.to,
    value: event.args.value,
    data: event.args.data,
  });
}

export async function handleTransfer({
  context,
  event,
}: {
  context: Context<"Chamber:Transfer">;
  event: Event<"Chamber:Transfer">;
}) {
  await context.db.insert(chamber_Transfer).values({
    id: event.log.id,
    from: event.args.from,
    to: event.args.to,
    value: event.args.value,
  });

  await applyShareTransfer(
    context.db,
    asHex(event.log.address),
    asHex(event.args.from),
    asHex(event.args.to),
    event.args.value,
  );
}

export async function handleUndelegate({
  context,
  event,
}: {
  context: Context<"Chamber:Undelegate">;
  event: Event<"Chamber:Undelegate">;
}) {
  await context.db.insert(chamber_Undelegate).values({
    id: event.log.id,
    sender: event.args.sender,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
  });
}

export async function handleWithdraw({
  context,
  event,
}: {
  context: Context<"Chamber:Withdraw">;
  event: Event<"Chamber:Withdraw">;
}) {
  await context.db.insert(chamber_Withdraw).values({
    id: event.log.id,
    sender: event.args.sender,
    receiver: event.args.receiver,
    owner: event.args.owner,
    assets: event.args.assets,
    shares: event.args.shares,
  });
}
