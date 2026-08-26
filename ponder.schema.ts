import { index, onchainEnum, onchainTable, primaryKey, relations } from "ponder";

export const chamberSource = onchainEnum("chamber_source", [
  "factory",
  "registry",
]);

/**
 * First-class Chamber directory row. Populated from Registry and Factory
 * ChamberCreated. “Mine” is creator on this table OR a chamber_holder row
 * with shares > 0. Directors are omitted in v1 (getDirectors is on-chain
 * only; DelegationUpdated is holder→tokenId weight, not NFT ownership).
 */
export const chamber = onchainTable(
  "chamber",
  (t) => ({
    id: t.hex().primaryKey(),
    address: t.hex().notNull(),
    asset: t.hex().notNull(),
    nft: t.hex().notNull(),
    seats: t.bigint().notNull(),
    name: t.text().notNull(),
    symbol: t.text().notNull(),
    creator: t.hex().notNull(),
    source: chamberSource().notNull(),
    createdBlock: t.bigint().notNull(),
    createdAt: t.bigint().notNull(),
  }),
  (table) => ({
    creatorIdx: index().on(table.creator),
    sourceIdx: index().on(table.source),
    assetIdx: index().on(table.asset),
  }),
);

/** Current share balance per account, reconstructed from ERC-20 Transfer. */
export const chamberHolder = onchainTable(
  "chamber_holder",
  (t) => ({
    chamberId: t.hex().notNull(),
    account: t.hex().notNull(),
    shares: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chamberId, table.account] }),
    accountIdx: index().on(table.account),
    chamberIdx: index().on(table.chamberId),
  }),
);

export const chamberRelations = relations(chamber, ({ many }) => ({
  holders: many(chamberHolder),
}));

export const chamberHolderRelations = relations(chamberHolder, ({ one }) => ({
  chamber: one(chamber, {
    fields: [chamberHolder.chamberId],
    references: [chamber.id],
  }),
}));

// Registry

export const registry_ChamberCreated = onchainTable(
  "chamber_created_event",
  (t) => ({
    id: t.text().primaryKey(),
    chamber: t.text().notNull(),
    seats: t.bigint().notNull(),
    name: t.text().notNull(),
    symbol: t.text().notNull(),
    erc20Token: t.text().notNull(),
    erc721Token: t.text().notNull(),
  }),
  (table) => ({
    chamberIdx: index().on(table.chamber),
  }),
);

export const factory_ChamberCreated = onchainTable(
  "factory_chamber_created_event",
  (t) => ({
    id: t.text().primaryKey(),
    chamber: t.hex().notNull(),
    asset: t.hex().notNull(),
    nft: t.hex().notNull(),
    seats: t.bigint().notNull(),
    name: t.text().notNull(),
    symbol: t.text().notNull(),
    creator: t.hex().notNull(),
  }),
  (table) => ({
    chamberIdx: index().on(table.chamber),
    creatorIdx: index().on(table.creator),
  }),
);

export const registry_Initialized = onchainTable(
  "initialized_event",
  (t) => ({
    id: t.text().primaryKey(),
    version: t.bigint().notNull(),
  }),
);

export const registry_RoleAdminChanged = onchainTable(
  "role_admin_changed_event",
  (t) => ({
    id: t.text().primaryKey(),
    role: t.text().notNull(),
    previousAdminRole: t.text().notNull(),
    newAdminRole: t.text().notNull(),
  }),
  (table) => ({
    roleIdx: index().on(table.role),
  }),
);

export const registry_RoleGranted = onchainTable(
  "role_granted_event",
  (t) => ({
    id: t.text().primaryKey(),
    role: t.text().notNull(),
    account: t.text().notNull(),
    sender: t.text().notNull(),
  }),
  (table) => ({
    roleIdx: index().on(table.role),
    accountIdx: index().on(table.account),
  }),
);

export const registry_RoleRevoked = onchainTable(
  "role_revoked_event",
  (t) => ({
    id: t.text().primaryKey(),
    role: t.text().notNull(),
    account: t.text().notNull(),
    sender: t.text().notNull(),
  }),
  (table) => ({
    roleIdx: index().on(table.role),
    accountIdx: index().on(table.account),
  }),
);

// Chamber events (live names only; DirectorshipChanged / QuorumUpdated dropped)

export const chamber_Approval = onchainTable(
  "chamber_approval_event",
  (t) => ({
    id: t.text().primaryKey(),
    owner: t.text().notNull(),
    spender: t.text().notNull(),
    value: t.bigint().notNull(),
  }),
  (table) => ({
    ownerIdx: index().on(table.owner),
    spenderIdx: index().on(table.spender),
  }),
);

export const chamber_ConfirmTransaction = onchainTable(
  "chamber_confirm_transaction_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
    nonce: t.bigint().notNull(),
  }),
);

export const chamber_Delegate = onchainTable(
  "chamber_delegate_event",
  (t) => ({
    id: t.text().primaryKey(),
    sender: t.text().notNull(),
    tokenId: t.bigint().notNull(),
    amount: t.bigint().notNull(),
  }),
  (table) => ({
    senderIdx: index().on(table.sender),
  }),
);

export const chamber_DelegationUpdated = onchainTable(
  "chamber_delegation_updated_event",
  (t) => ({
    id: t.text().primaryKey(),
    holder: t.text().notNull(),
    tokenId: t.bigint().notNull(),
    amount: t.bigint().notNull(),
  }),
  (table) => ({
    holderIdx: index().on(table.holder),
  }),
);

export const chamber_Deposit = onchainTable(
  "chamber_deposit_event",
  (t) => ({
    id: t.text().primaryKey(),
    sender: t.text().notNull(),
    owner: t.text().notNull(),
    assets: t.bigint().notNull(),
    shares: t.bigint().notNull(),
  }),
  (table) => ({
    senderIdx: index().on(table.sender),
    ownerIdx: index().on(table.owner),
  }),
);

export const chamber_ExecuteSetSeats = onchainTable(
  "chamber_execute_set_seats_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
    seats: t.bigint().notNull(),
  }),
);

export const chamber_ExecuteTransaction = onchainTable(
  "chamber_execute_transaction_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
    nonce: t.bigint().notNull(),
  }),
);

export const chamber_Initialized = onchainTable(
  "chamber_initialized_event",
  (t) => ({
    id: t.text().primaryKey(),
    version: t.bigint().notNull(),
  }),
);

export const chamber_Received = onchainTable(
  "chamber_received_event",
  (t) => ({
    id: t.text().primaryKey(),
    sender: t.text().notNull(),
    amount: t.bigint().notNull(),
  }),
  (table) => ({
    senderIdx: index().on(table.sender),
  }),
);

export const chamber_RevokeConfirmation = onchainTable(
  "chamber_revoke_confirmation_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
    nonce: t.bigint().notNull(),
  }),
);

export const chamber_SeatUpdateCancelled = onchainTable(
  "chamber_seat_update_cancelled_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
  }),
);

export const chamber_SetSeats = onchainTable(
  "chamber_set_seats_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
    numOfSeats: t.bigint().notNull(),
  }),
);

export const chamber_SubmitTransaction = onchainTable(
  "chamber_submit_transaction_event",
  (t) => ({
    id: t.text().primaryKey(),
    tokenId: t.bigint().notNull(),
    nonce: t.bigint().notNull(),
    to: t.text().notNull(),
    value: t.bigint().notNull(),
    data: t.text().notNull(),
  }),
  (table) => ({
    toIdx: index().on(table.to),
  }),
);

export const chamber_Transfer = onchainTable(
  "chamber_transfer_event",
  (t) => ({
    id: t.text().primaryKey(),
    from: t.text().notNull(),
    to: t.text().notNull(),
    value: t.bigint().notNull(),
  }),
  (table) => ({
    fromIdx: index().on(table.from),
    toIdx: index().on(table.to),
  }),
);

export const chamber_Undelegate = onchainTable(
  "chamber_undelegate_event",
  (t) => ({
    id: t.text().primaryKey(),
    sender: t.text().notNull(),
    tokenId: t.bigint().notNull(),
    amount: t.bigint().notNull(),
  }),
  (table) => ({
    senderIdx: index().on(table.sender),
  }),
);

export const chamber_Withdraw = onchainTable(
  "chamber_withdraw_event",
  (t) => ({
    id: t.text().primaryKey(),
    sender: t.text().notNull(),
    receiver: t.text().notNull(),
    owner: t.text().notNull(),
    assets: t.bigint().notNull(),
    shares: t.bigint().notNull(),
  }),
  (table) => ({
    senderIdx: index().on(table.sender),
    receiverIdx: index().on(table.receiver),
    ownerIdx: index().on(table.owner),
  }),
);
