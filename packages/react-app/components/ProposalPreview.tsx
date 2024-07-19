import { SnapshotProposal, SnapshotProposalState } from "@/types/snapshot";
import ProposalStatePill from "@/components/ProposalStatePill";
import RelativeTime from "@/components/RelativeTime";

export default function ProposalPreview({
  proposal,
  onSelect,
}: {
  proposal: SnapshotProposal;
  onSelect: () => void;
}) {
  const start = new Date(proposal.start * 1000);
  const end = new Date(proposal.end * 1000);
  // TODO: add author at the top left
  return (
    <div
      className="p-4 grid grid-cols-1 gap-3 bg-white rounded-2xl shadow-lg cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex flex-row justify-end">
        <ProposalStatePill state={proposal.state} />
      </div>
      <h3 className="text-lg font-semibold">{proposal.title}</h3>
      <p className="text-sm text-slate-700 break-words line-clamp-2">
        {proposal.body.substring(0, 200)}
      </p>
      <div className="text-sm font-semibold text-slate-700">
        {proposal.state == SnapshotProposalState.PENDING && (
          <RelativeTime label="Starts" date={start} />
        )}
        {proposal.state == SnapshotProposalState.ACTIVE && (
          <RelativeTime label="Ends" date={end} />
        )}
        {proposal.state == SnapshotProposalState.CLOSED && (
          <RelativeTime label="Ended" date={end} />
        )}
      </div>
    </div>
  );
}
