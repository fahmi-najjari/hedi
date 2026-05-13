type AdminStatusProps = {
  messages: Array<string | false | null | undefined>;
};

export function AdminStatus({ messages }: AdminStatusProps) {
  const activeMessages = messages.filter(Boolean);

  if (activeMessages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700">
      {activeMessages.join(" ")}
    </div>
  );
}
