import { Protocol } from "../lib/types";

type Mode = "MANUAL" | "AUTO" | "ATTACK";

interface PacketInputState {
  sourceIp: string;
  destinationIp: string;
  port: string;
  protocol: Protocol;
}

interface TrafficInputPanelProps {
  packetInput: PacketInputState;
  mode: Mode;
  queueSize: number;
  inputError: string | null;
  onPacketInputChange: (next: PacketInputState) => void;
  onSendPacket: () => void;
  onRandomPacket: () => void;
  onModeChange: (mode: Mode) => void;
  onStopSimulation: () => void;
}

export function TrafficInputPanel({
  packetInput,
  mode,
  queueSize,
  inputError,
  onPacketInputChange,
  onSendPacket,
  onRandomPacket,
  onModeChange,
  onStopSimulation,
}: TrafficInputPanelProps) {
  return (
    <section className="rounded-panel border border-stone-200 bg-ivory p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl">Traffic Input</h2>
        <div className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-muted">
          Queue: {queueSize}
        </div>
      </div>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSendPacket();
        }}
      >
        <input
          className="w-full rounded-lg border border-stone-300 bg-white p-2"
          value={packetInput.sourceIp}
          onChange={(e) => onPacketInputChange({ ...packetInput, sourceIp: e.target.value })}
          placeholder="Source IP"
        />
        <input
          className="w-full rounded-lg border border-stone-300 bg-white p-2"
          value={packetInput.destinationIp}
          onChange={(e) => onPacketInputChange({ ...packetInput, destinationIp: e.target.value })}
          placeholder="Destination IP"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            className="rounded-lg border border-stone-300 bg-white p-2"
            value={packetInput.port}
            onChange={(e) => onPacketInputChange({ ...packetInput, port: e.target.value })}
            placeholder="Port"
          />
          <select
            className="rounded-lg border border-stone-300 bg-white p-2"
            value={packetInput.protocol}
            onChange={(e) => onPacketInputChange({ ...packetInput, protocol: e.target.value as Protocol })}
          >
            <option>TCP</option>
            <option>UDP</option>
          </select>
        </div>
        <button className="w-full rounded-lg bg-accent px-4 py-2 text-white" type="submit">
          Send Packet
        </button>
        {inputError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-block">{inputError}</div>}
      </form>

      <button className="mt-3 w-full rounded-lg border border-stone-300 px-4 py-2" onClick={onRandomPacket}>
        Random Packet
      </button>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        {(["MANUAL", "AUTO", "ATTACK"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onModeChange(item)}
            className={`rounded-lg border px-2 py-1 ${mode === item ? "border-accent text-accent" : "border-stone-300 text-muted"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onStopSimulation}
        className="mt-3 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-ink"
      >
        Stop Simulation
      </button>

      <div className="mt-3 text-xs text-muted">
        {mode === "MANUAL"
          ? "Manual mode processes only the packets you send."
          : "Auto-generated traffic is capped so the simulator stays responsive and does not break under load."}
      </div>
    </section>
  );
}
