# Interactive Firewall Simulation System

An educational, web-based simulator that helps users **see and understand firewall logic** in seconds.

This is **not a real firewall**. It is a visual learning tool.

---

## 1) Core Idea

The app teaches one important concept:

> Firewall rules are checked from top to bottom. The first matching rule decides the packet fate.

If no rule matches, the packet is blocked by default.

The UI makes this visible through animation, active rule highlighting, and plain-language explanations.

---

## 2) What the App Simulates

Each packet has:

- Source IP
- Destination IP
- Port
- Protocol (`TCP` or `UDP`)

Each rule has:

- Match type (`IP`, `PORT`, `PROTOCOL`)
- Value (for example `22`, `TCP`, or `192.168.1.10`)
- Action (`ALLOW` or `BLOCK`)
- Priority (based on order in rule list)

Decision logic:

1. Check rules from top to bottom
2. Apply the first matching rule
3. If none match → `BLOCK`

---

## 3) How to Read the UI

### A. Traffic Input (left panel)

This area is for creating traffic.

- **Source IP**: where the packet comes from
- **Destination IP**: where the packet is going
- **Port**: target service/endpoint (for example `80`, `443`, `22`)
- **Protocol dropdown**: choose `TCP` or `UDP`

Buttons:

- **Send Packet**
   - Sends one packet using your form values
   - Best for step-by-step learning

- **Random Packet**
   - Generates and sends one random packet
   - Useful for quick experimentation

- **MANUAL**
   - Traffic only appears when you click **Send Packet** or **Random Packet**

- **AUTO**
   - Generates packets continuously at a normal pace
   - Good for observing steady traffic behavior

- **ATTACK**
   - Generates packets faster (burst-like)
   - Helps demonstrate stress and repeated rule matching

### B. Firewall Visualization (center panel)

This is the learning core.

What you see:

1. Packet moves toward firewall
2. Firewall pauses in inspect state
3. Matching rule gets highlighted on right
4. Decision is applied
    - `ALLOW` → packet proceeds
    - `BLOCK` → packet stops/fades

Color meaning:

- Neutral/gray: in transit or waiting
- Green: allowed
- Red: blocked

### C. Rules (right panel)

This defines firewall behavior.

Controls:

- **Match Type** dropdown: `IP`, `PORT`, or `PROTOCOL`
- **Value** input: value to match
- **Action** dropdown: `ALLOW` or `BLOCK`
- **Add Rule**: appends a new rule

Per-rule buttons:

- **↑** move rule up (higher priority)
- **↓** move rule down (lower priority)
- **✕** remove rule

Important idea:

- Rule order is the policy.
- A broad `ALLOW` rule at top can permit traffic before a lower `BLOCK` rule is checked.

### D. Stats + Activity Timeline (bottom)

- **Stats**
   - `Total`: all processed packets
   - `Allowed`: packets allowed
   - `Blocked`: packets blocked

- **Activity Timeline**
   - Shows each packet and the reason for the decision
   - Example: `BLOCK due to rule #1 (PORT = 22)`

This gives instant feedback for every action.

---

## 4) Typical Learning Flow

1. Add rule: `PORT = 22`, action `BLOCK`
2. Add rule: `PROTOCOL = TCP`, action `ALLOW`
3. Send packet with `TCP:22`
4. Observe: it gets blocked because rule #1 matches first
5. Reorder rules and send again
6. Observe how outcome changes

This demonstrates why firewall rule priority matters.

---

## 5) Tech Stack (Current)

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Persistence: **In-memory only** (data resets on server restart)

> Current behavior is intentionally volatile for fast iteration.

---

## 6) Project Structure

- `client` → UI and animation logic
   - `src/pages` → page-level orchestration
   - `src/components` → modular UI panels
   - `src/lib` → simulation types and local fallback logic
- `server` → API and in-memory firewall model
   - `src/config` → app config
   - `src/models` → data + decision logic
   - `src/controllers` → route handlers
   - `src/routes` → endpoint definitions

---

## 7) API Endpoints

- `GET /health`
- `GET /rules`
- `POST /rules`
- `DELETE /rules/:id`
- `PUT /rules/reorder`
- `POST /simulate`
- `GET /logs`

---

## 8) Quick Start

1. Install dependencies:
    - `npm install`
2. Create env files:
    - copy `server/.env.example` → `server/.env`
    - copy `client/.env.example` → `client/.env`
3. Run both apps:
    - `npm run dev`

URLs:

- Client: http://localhost:5173
- Server: http://localhost:5000

---

## 9) Current Limitations (Expected)

- Rules and logs are not persisted
- Refresh/restart can reset simulator state
- Attack mode is traffic-rate simulation, not real network attack logic

---

## 10) Goal of This Simulator

By interacting with the buttons and watching packet motion, users should quickly understand:

- What a firewall rule is
- Why rule order changes outcomes
- Why default deny (`BLOCK`) is a safe baseline

That is the educational objective of this app.
