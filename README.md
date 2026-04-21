# Interactive Firewall Simulation System

An educational web app for understanding a simple firewall rule engine through packet animation and immediate visual feedback.

This is not a real firewall. It is a learning-focused simulator.

---

## 1) Core Idea

The simulator teaches one main concept:

> Firewall rules are checked from top to bottom, and the first matching rule decides the packet outcome.

If no rule matches, the packet is blocked by default.

The interface makes that visible with:

- packet movement
- an inspection phase
- active rule highlighting
- plain-language decision messages

---

## 2) What the App Simulates

Each packet contains:

- Source IP
- Destination IP
- Port
- Protocol (`TCP` or `UDP`)

Each rule contains:

- Match type (`IP`, `PORT`, `PROTOCOL`)
- Value
- Action (`ALLOW` or `BLOCK`)
- Priority based on list order

Decision logic:

1. Read rules from top to bottom.
2. Stop at the first matching rule.
3. Apply that rule's action.
4. If nothing matches, block the packet.

---

## 3) UI Overview

### A. Traffic Input

This panel is used to generate traffic.

Inputs:

- **Source IP**
- **Destination IP**
- **Port**
- **Protocol**

Controls:

- **Send Packet**
  Sends one packet using the current form values.

- **Random Packet**
  Queues a randomly generated packet.

- **MANUAL**
  Traffic only appears when you send packets yourself.

- **AUTO**
  Generates packets continuously at a steady pace.

- **ATTACK**
  Generates packets faster to simulate heavy traffic.

- **Stop Simulation**
  Stops auto-generation, clears queued/current simulation traffic, and resets the visual state.

Notes:

- Manual packet input is validated for IPv4 format and port range.
- The queued traffic is capped so the simulator stays responsive.

### B. Firewall Visualization

This is the central learning panel.

Typical packet flow:

1. A packet enters from the left.
2. It pauses at the firewall during inspection.
3. The matching rule is highlighted in the rules panel.
4. The firewall decides:
   - `ALLOW` lets the packet continue
   - `BLOCK` stops and fades the packet

The panel also shows:

- packet label and route details
- current simulation phase
- the decision reason

### C. Rules

This panel defines the firewall behavior.

Controls:

- **Match Type** dropdown
- **Value** input
- **Action** dropdown
- **Add Rule**
- **Remove Rule**

Important behavior:

- Rules are evaluated in the order they appear.
- There is no rule drag/reorder control in the current UI.
- The default policy is always `BLOCK`.

### D. Stats and Activity Timeline

**Stats** shows:

- Total processed packets
- Allowed packets
- Blocked packets

**Activity Timeline** shows:

- each processed packet
- source and destination
- protocol and port
- the reason the packet was allowed or blocked

---

## 4) Typical Learning Flow

1. Keep the default rule `PORT = 22 -> BLOCK`.
2. Keep the default rule `PROTOCOL = TCP -> ALLOW`.
3. Send a packet with `TCP:22`.
4. Observe that it is blocked because the first rule matches.
5. Remove or change rules and send another packet.
6. Compare the outcome and the highlighted rule.

This demonstrates first-match rule evaluation and default deny behavior.

---

## 5) Current Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Data storage: in-memory only

Current behavior is intentionally volatile:

- refreshing the client resets client-side simulation state
- restarting the server resets server-side rules/logs

---

## 6) Project Structure

- `client`
  Frontend UI, animation, and local fallback logic
- `client/src/pages`
  Page-level orchestration
- `client/src/components`
  UI panels
- `client/src/lib`
  Shared client-side types and simulation helpers
- `server`
  Express API and in-memory firewall model
- `server/src/models`
  Rule storage, evaluation, and logs
- `server/src/controllers`
  Request handlers
- `server/src/routes`
  API endpoints

---

## 7) API Endpoints

- `GET /health`
- `GET /rules`
- `POST /rules`
- `DELETE /rules/:id`
- `PUT /rules/reorder`
- `POST /simulate`
- `GET /logs`

Note:

- The client currently uses `GET /rules`, `POST /rules`, `DELETE /rules/:id`, and `POST /simulate`.
- `PUT /rules/reorder` exists on the backend, but the current UI does not expose rule reordering.

---

## 8) Quick Start

1. Install dependencies:
   - `npm install`
2. Configure environment files:
   - create `client/.env` from `client/.env.example`
   - create `server/.env` with `PORT=5000` if it does not already exist
3. Run the app:
   - `npm run dev`

Default URLs:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

Build:

- `npm run build`

---

## 9) Current Limitations

- No persistence by design
- No authentication or multi-user state
- Attack mode is only faster packet generation, not a real attack model
- Rule matching is intentionally simple:
  - `IP` matches exact source or destination IP
  - `PORT` matches exact port
  - `PROTOCOL` matches exact protocol

---

## 10) Educational Goal

The simulator is designed to help a learner quickly understand:

- what a firewall rule is
- how top-to-bottom matching works
- why first match matters
- why default deny (`BLOCK`) is a safe baseline

That learning outcome is the main goal of the project.
