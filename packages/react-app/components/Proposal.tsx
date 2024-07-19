import { SnapshotProposal, SnapshotProposalState } from "@/types/snapshot";
import Percentage from "@/components/Percentage";
import ProposalStatePill from "@/components/ProposalStatePill";
import TokenAmount from "@/components/TokenAmount";
import { useQuery } from "graphql-hooks";
import cn from "classnames";
import { useSnapshotClient } from "@/utils/useSnapshotClient";
import Markdown from "react-markdown";

const VOTE_QUERY = `query Vote($proposal: String, $voter: String) {
  votes(where: {proposal: $proposal, voter: $voter}) {
    created
    choice
  }
}
`;

type SnapshotVote = {
  choice: number;
  created: number;
};

export default function Proposal({ proposal }: { proposal: SnapshotProposal }) {
  const { client, web3, address } = useSnapshotClient();
  const { loading, error, data, refetch } = useQuery<{ votes: SnapshotVote[] }>(
    VOTE_QUERY,
    {
      variables: {
        proposal: proposal.id,
        voter: address,
      },
    },
  );

  const hasVoted = !loading && !error && data && data.votes.length == 1;
  const canVote =
    !loading &&
    !error &&
    data &&
    data.votes.length == 0 &&
    proposal.state == SnapshotProposalState.ACTIVE;

  const castVote = async (choice: number) => {
    if (!address) return;
    try {
      const receipt = await client.vote(web3, address, {
        space: process.env.NEXT_PUBLIC_SNAPSHOT_SPACE || "",
        proposal: proposal.id,
        type: proposal.type,
        choice,
        // reason: 'Choice 1 make lot of sense',
        // app: 'my-app'
      });
      console.log("vote receipt", receipt);
    } catch (err) {
      console.warn("vote failed", err);
      return;
    }
    let refetchResult = await refetch();
    console.log("vote refetch result", refetchResult);
  };

  // TODO: collapse proposal body to max 600px, add "view more" body to expand
  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      <div className="flex">
        <ProposalStatePill state={proposal.state} />
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold">{proposal.title}</h1>
        <div className="markdown text-sm">
          <Markdown>{proposal.body}</Markdown>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-lg">
        <h3 className="mb-2 text-lg font-bold">Information</h3>
        <div className="grid grid-cols-2 text-sm text-slate-700">
          <div className="font-semibold">Author</div>
          <div className="text-right text-ellipsis overflow-hidden">
            {proposal.author}
          </div>
          <div className="font-semibold">Voting System</div>
          <div className="text-right">{proposal.type}</div>
          <div className="font-semibold">Start date</div>
          <div className="text-right">
            {new Date(proposal.start * 1000).toLocaleString()}
          </div>
          <div className="font-semibold">End date</div>
          <div className="text-right">
            {new Date(proposal.end * 1000).toLocaleString()}
          </div>
          <div className="font-semibold">Snapshot block</div>
          {/*TODO: add link to block explorer*/}
          <div className="text-right">{proposal.snapshot}</div>
        </div>
      </div>

      {proposal.state == SnapshotProposalState.ACTIVE && (
        <div className="p-4 bg-white rounded-2xl shadow-lg">
          <h3 className="mb-2 text-lg font-bold">Cast your vote</h3>
          <div className="grid grid-cols-1 gap-2">
            {proposal.choices.map((choice, i) => (
              <button
                key={choice}
                disabled={!canVote}
                className={cn(
                  "border rounded-2xl hover:border-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                  {
                    "bg-black text-white":
                      hasVoted && data.votes[0].choice == i + 1,
                  },
                )}
                onClick={() => castVote(i + 1)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white rounded-2xl shadow-lg">
        <h3 className="mb-2 text-lg font-bold">
          {proposal.state == SnapshotProposalState.CLOSED
            ? "Results"
            : "Current results"}
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {proposal.choices.map((choice, i) => (
            <div key={choice} className="flex flex-row justify-between">
              <p className="font-semibold">{choice}</p>
              <p className="">
                <TokenAmount
                  amount={proposal.scores[i]}
                  symbol={proposal.symbol}
                />{" "}
                <Percentage
                  value={
                    proposal.scores_total == 0
                      ? 0
                      : proposal.scores[i] / proposal.scores_total
                  }
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
