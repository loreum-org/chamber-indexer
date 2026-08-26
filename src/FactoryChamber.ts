import { ponder } from "ponder:registry";

import {
  handleApproval,
  handleConfirmTransaction,
  handleDelegate,
  handleDelegationUpdated,
  handleDeposit,
  handleExecuteSetSeats,
  handleExecuteTransaction,
  handleInitialized,
  handleReceived,
  handleRevokeConfirmation,
  handleSeatUpdateCancelled,
  handleSetSeats,
  handleSubmitTransaction,
  handleTransfer,
  handleUndelegate,
  handleWithdraw,
} from "./chamberHandlers";

// Same Chamber ABI as Registry-discovered chambers. Event payloads match
// Chamber:*; Ponder types the two contract names separately.
const asChamber = <T>(handler: T) =>
  handler as never;

ponder.on("FactoryChamber:Approval", asChamber(handleApproval));
ponder.on("FactoryChamber:ConfirmTransaction", asChamber(handleConfirmTransaction));
ponder.on("FactoryChamber:Delegate", asChamber(handleDelegate));
ponder.on("FactoryChamber:DelegationUpdated", asChamber(handleDelegationUpdated));
ponder.on("FactoryChamber:Deposit", asChamber(handleDeposit));
ponder.on("FactoryChamber:ExecuteSetSeats", asChamber(handleExecuteSetSeats));
ponder.on("FactoryChamber:ExecuteTransaction", asChamber(handleExecuteTransaction));
ponder.on("FactoryChamber:Initialized", asChamber(handleInitialized));
ponder.on("FactoryChamber:Received", asChamber(handleReceived));
ponder.on("FactoryChamber:RevokeConfirmation", asChamber(handleRevokeConfirmation));
ponder.on("FactoryChamber:SeatUpdateCancelled", asChamber(handleSeatUpdateCancelled));
ponder.on("FactoryChamber:SetSeats", asChamber(handleSetSeats));
ponder.on("FactoryChamber:SubmitTransaction", asChamber(handleSubmitTransaction));
ponder.on("FactoryChamber:Transfer", asChamber(handleTransfer));
ponder.on("FactoryChamber:Undelegate", asChamber(handleUndelegate));
ponder.on("FactoryChamber:Withdraw", asChamber(handleWithdraw));
