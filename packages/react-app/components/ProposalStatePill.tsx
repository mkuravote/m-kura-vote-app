import { SnapshotProposalState } from "@/types/snapshot";
import cn from "classnames";

type ProposalStatePillProps = {
  state: SnapshotProposalState;
};

export default function ProposalStatePill({ state }: ProposalStatePillProps) {
  return (
    <div
      className={cn(
        "px-3 leading-6 text-sm text-white capitalize rounded-full font-semibold",
        {
          "bg-gray-500": state == SnapshotProposalState.PENDING,
          "bg-[#21b66f]": state == SnapshotProposalState.ACTIVE,
          "bg-[#BB6BD9]": state == SnapshotProposalState.CLOSED,
        },
      )}
    >
      {state}
    </div>
  );
}
