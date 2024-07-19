import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useBlockNumber } from "wagmi";
import { useSnapshotClient } from "@/utils/useSnapshotClient";

function getInitialDate(offsetDays: number) {
  let now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + offsetDays,
    now.getHours(),
  );
}

function toDatetimeFormat(date: Date): string {
  const modified = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return modified.toISOString().substring(0, 16);
}

function updateDate(
  e: ChangeEvent<HTMLInputElement>,
  setter: Dispatch<SetStateAction<Date>>,
) {
  if (!e.target["validity"].valid) return;
  const parsed = new Date(e.target.value + ":00Z");
  console.log("parsed date", parsed);
  setter(parsed);
}

export default function ProposalCreate({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [start, setStart] = useState<Date>(getInitialDate(0));
  const [end, setEnd] = useState<Date>(getInitialDate(7));

  const { client, web3, address } = useSnapshotClient();
  const { data: blockHeight } = useBlockNumber();

  const createProposal = async () => {
    if (!address || !blockHeight) return;
    // some rough date validations
    if (end < new Date() || end < start) return;

    // send proposal to API
    const receipt = await client.proposal(web3, address, {
      space: process.env.NEXT_PUBLIC_SNAPSHOT_SPACE || "",
      type: "basic",
      title,
      body,
      discussion: "",
      choices: ["For", "Against", "Abstain"],
      start: start.getTime() / 1000,
      end: end.getTime() / 1000,
      snapshot: Number(blockHeight),
      plugins: JSON.stringify({}),
      // provide the name of your project which is using this snapshot.js integration
      app: "m-kura.vote",
    });
    console.log("proposal receipt", receipt);

    // TODO: refetch proposals

    onClose();
  };

  return (
    <div className="p-4 mb-8 grid grid-cols-1 gap-4 bg-white rounded-2xl shadow-lg text-slate-700">
      <h1 className="text-center text-lg font-bold">Create proposal</h1>
      <input
        className="w-full h-10 px-4 py-2 bg-[#F8F8F8] border rounded-lg"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-40 px-4 py-2 bg-[#F8F8F8] border rounded-lg"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <label className="flex flex-row items-baseline justify-between">
        Start
        <input
          type="datetime-local"
          className="h-10 bg-[#F8F8F8] border rounded-lg"
          defaultValue={toDatetimeFormat(start)}
          onChange={(e) => updateDate(e, setStart)}
          placeholder="Start"
        />
      </label>
      <label className="flex flex-row items-baseline justify-between">
        End
        <input
          type="datetime-local"
          className="h-10 bg-[#F8F8F8] border rounded-lg"
          defaultValue={toDatetimeFormat(end)}
          onChange={(e) => updateDate(e, setEnd)}
          placeholder="End"
        />
      </label>
      <button
        className="w-full h-10 bg-[#21b66f] text-white rounded-lg"
        onClick={createProposal}
      >
        Create proposal
      </button>
    </div>
  );
}
