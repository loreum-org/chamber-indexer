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

ponder.on("Chamber:Approval", handleApproval);
ponder.on("Chamber:ConfirmTransaction", handleConfirmTransaction);
ponder.on("Chamber:Delegate", handleDelegate);
ponder.on("Chamber:DelegationUpdated", handleDelegationUpdated);
ponder.on("Chamber:Deposit", handleDeposit);
ponder.on("Chamber:ExecuteSetSeats", handleExecuteSetSeats);
ponder.on("Chamber:ExecuteTransaction", handleExecuteTransaction);
ponder.on("Chamber:Initialized", handleInitialized);
ponder.on("Chamber:Received", handleReceived);
ponder.on("Chamber:RevokeConfirmation", handleRevokeConfirmation);
ponder.on("Chamber:SeatUpdateCancelled", handleSeatUpdateCancelled);
ponder.on("Chamber:SetSeats", handleSetSeats);
ponder.on("Chamber:SubmitTransaction", handleSubmitTransaction);
ponder.on("Chamber:Transfer", handleTransfer);
ponder.on("Chamber:Undelegate", handleUndelegate);
ponder.on("Chamber:Withdraw", handleWithdraw);
