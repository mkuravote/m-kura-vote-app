import { useState } from "react";
import { SnapshotProposal } from "@/types/snapshot";
import Proposal from "@/components/Proposal";
import ProposalPreview from "@/components/ProposalPreview";
import ProposalCreate from "@/components/ProposalCreate";
import { useQuery } from "graphql-hooks";
import { useERC20Balance } from "@/utils/useERC20Balance";
import { SECURA_ADDRESS } from "@/utils/transfer";
import MintSecura from "@/components/MintSecura";
import { parseEther } from "viem";

const PROPOSALS_QUERY = `query Proposals($space: String, $limit: Int, $skip: Int) {
  proposals(first: $limit, skip: $skip, where: {space: $space}, orderBy: "created", orderDirection: desc) {
    id
    title
    body
    type
    choices
    start
    end
    snapshot
    state
    author
    symbol,
    scores
    scores_total
  }
}
`;

export default function Proposals() {
  const secura = useERC20Balance(SECURA_ADDRESS);
  const [createProposal, setCreateProposal] = useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] =
    useState<SnapshotProposal | null>(null);

  // TODO: add pagination or endless loading
  const { loading, error, data } = useQuery<{ proposals: SnapshotProposal[] }>(
    PROPOSALS_QUERY,
    {
      variables: {
        limit: 10,
        skip: 0,
        space: process.env.NEXT_PUBLIC_SNAPSHOT_SPACE,
      },
    },
  );

  if (loading) return null;
  if (error) return "Something went wrong";

  if (createProposal) {
    if (secura.loading || secura.balance < parseEther("50")) {
      return <MintSecura targetBalance={50} onUpdate={secura.refetch} />;
    }
    return (
      <>
        <button
          className="mb-4 w-10 h-10 shadow-lg rounded-full bg-white shrink-0"
          onClick={() => setCreateProposal(false)}
        >
          ←
        </button>

        <ProposalCreate onClose={() => setCreateProposal(false)} />
      </>
    );
  }

  if (selectedProposal) {
    return (
      <>
        <button
          className="mb-4 w-10 h-10 shadow-lg rounded-full bg-white shrink-0"
          onClick={() => setSelectedProposal(null)}
        >
          ←
        </button>
        <Proposal proposal={selectedProposal} />
      </>
    );
  }

  return (
    <>
      <div className="grid gap-4 mb-24">
        {data?.proposals.map((proposal) => (
          <ProposalPreview
            key={proposal.id}
            proposal={proposal}
            onSelect={() => setSelectedProposal(proposal)}
          />
        ))}
      </div>
      <div
        className="fixed bottom-4 right-4 h-16 w-16 bg-[#21b66f] rounded-full content-center text-center text-3xl font-bold text-white shadow-xl cursor-pointer"
        onClick={() => setCreateProposal(true)}
      >
        +
      </div>
    </>
  );
}
