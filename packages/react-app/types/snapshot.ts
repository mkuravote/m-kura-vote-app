import { ProposalType } from "@snapshot-labs/snapshot.js/src/sign/types";

export enum SnapshotProposalState {
  PENDING = "pending",
  ACTIVE = "active",
  CLOSED = "closed",
}

export type SnapshotProposal = {
  id: string;
  type: ProposalType;
  title: string;
  // There is a character limit of 10,000 for the description of a proposal.
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: SnapshotProposalState;
  author: string;
  app: string;
  symbol: string;
  scores: number[];
  scores_total: number;
};
