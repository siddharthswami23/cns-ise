import { Rule, RuleAction, RuleMatchType } from "../lib/types";

interface NewRuleState {
  matchType: RuleMatchType;
  value: string;
  action: RuleAction;
}

interface RulesPanelProps {
  newRule: NewRuleState;
  sortedRules: Rule[];
  activeRuleIndex: number | null;
  onNewRuleChange: (next: NewRuleState) => void;
  onAddRule: () => void;
  onRemoveRule: (id: string) => void;
}

export function RulesPanel({
  newRule,
  sortedRules,
  activeRuleIndex,
  onNewRuleChange,
  onAddRule,
  onRemoveRule,
}: RulesPanelProps) {
  return (
    <section className="rounded-panel border border-stone-200 bg-ivory p-4 shadow-soft">
      <h2 className="mb-3  text-xl">Rules</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddRule();
        }}
        className="mb-3 space-y-2"
      >
        <div className="grid grid-cols-3 gap-2">
          <select
            className="rounded-lg border border-stone-300 bg-white p-2 text-sm"
            value={newRule.matchType}
            onChange={(e) => onNewRuleChange({ ...newRule, matchType: e.target.value as RuleMatchType })}
          >
            <option value="IP">IP</option>
            <option value="PORT">PORT</option>
            <option value="PROTOCOL">PROTOCOL</option>
          </select>
          <input
            className="rounded-lg border border-stone-300 bg-white p-2 text-sm"
            value={newRule.value}
            placeholder="Value"
            onChange={(e) => onNewRuleChange({ ...newRule, value: e.target.value })}
          />
          <select
            className="rounded-lg border border-stone-300 bg-white p-2 text-sm"
            value={newRule.action}
            onChange={(e) => onNewRuleChange({ ...newRule, action: e.target.value as RuleAction })}
          >
            <option value="ALLOW">ALLOW</option>
            <option value="BLOCK">BLOCK</option>
          </select>
        </div>
        <button className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" type="submit">
          Add Rule
        </button>
      </form>

      <div className="space-y-2">
        {sortedRules.map((rule, index) => (
          <div
            key={rule.id}
            className={`rounded-lg border p-2 text-sm ${activeRuleIndex === index ? "border-accent bg-orange-50" : "border-stone-300 bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <strong>
                #{index + 1} {rule.action}
              </strong>
              <div>
                <button
                  type="button"
                  className="rounded border border-stone-300 px-1"
                  onClick={() => onRemoveRule(rule.id)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="text-muted">
              Match {rule.matchType} = {rule.value}
            </div>
          </div>
        ))}
        <div className="rounded-lg border border-stone-300 bg-white p-2 text-sm text-muted">
          Default Policy: BLOCK (no match)
        </div>
      </div>
    </section>
  );
}
