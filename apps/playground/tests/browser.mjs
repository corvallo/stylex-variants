// Attach to an isolated Chromium instance started with --remote-debugging-port.
const appUrl = process.env.PLAYGROUND_URL ?? "http://127.0.0.1:5173/";
const cdpUrl = process.env.CDP_URL ?? "http://127.0.0.1:9227";
const targets = await (await fetch(`${cdpUrl}/json`)).json();
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) p.reject(m.error);
    else p.resolve(m.result);
  }
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, { resolve, reject });
    ws.send(JSON.stringify({ id: key, method, params }));
  });
}
async function evaluate(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: true,
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1100,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: appUrl });
for (let i = 0; i < 50; i++) {
  if (await evaluate('!!document.querySelector("main")')) break;
  await new Promise((r) => setTimeout(r, 200));
}

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log("PASS", message);
};
const click = async (text) => {
  await evaluate(
    `(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!b)throw new Error('Missing button '+${JSON.stringify(text)});b.click()})()`,
  );
  await new Promise((r) => setTimeout(r, 200));
};
const nav = async (name) => {
  await evaluate(
    `(()=>{const b=[...document.querySelectorAll('nav[aria-label="Examples"] button')].find(b=>b.textContent.includes(${JSON.stringify(name)}));b.click()})()`,
  );
  await new Promise((r) => setTimeout(r, 200));
};
const preview = () =>
  evaluate(
    `(()=>{const b=[...document.querySelectorAll('section[aria-label="Live preview"] button')].find(b=>b.textContent==='Ship something great');const s=getComputedStyle(b);return {className:b.className,disabled:b.disabled,background:s.backgroundColor,opacity:s.opacity,radius:s.borderRadius,transform:s.textTransform,border:s.borderWidth}})()`,
  );
const usage = () =>
  evaluate(`document.querySelector('pre[aria-label="Generated React usage"]').textContent`);
assert(
  await evaluate("document.documentElement.scrollWidth <= innerWidth"),
  "desktop has no horizontal page overflow",
);
const before = await preview();
await click("neutral");
const after = await preview();
assert(
  before.className !== after.className && before.background !== after.background,
  "tone updates real compiled styles",
);
assert((await usage()).includes('"tone": "neutral"'), "usage follows tone selection");
await click("↺ Reset");
assert((await preview()).className === before.className, "reset restores basic recipe");
await nav("Default Variants");
assert((await usage()).includes("variants={{}}"), "default selection omits props");
await click("outline");
assert((await usage()).includes('"tone": "outline"'), "default can be overridden");
await click("↺ Reset");
assert((await usage()).includes("variants={{}}"), "reset removes explicit overrides");
await nav("Compound Variants");
assert((await preview()).transform === "uppercase", "compound styles activate");
await click("neutral");
assert((await preview()).transform === "none", "compound styles deactivate");
await click("outline");
await click("sm");
assert((await preview()).border === "2px", "second compound condition activates");
await nav("Boolean Variants");
await evaluate(`document.querySelector('[role="switch"]').click()`);
await new Promise((r) => setTimeout(r, 200));
assert(
  (await preview()).disabled && (await preview()).opacity === "0.45",
  "boolean variant styles and native disabled stay synchronized",
);
assert(
  (await usage()).includes("disabled={variants.disabled}") &&
    (await usage()).includes('"disabled": true'),
  "usage includes native disabled attribute",
);
await click("↺ Reset");
assert(!(await preview()).disabled, "boolean reset restores native interaction");
await nav("Composition");
assert((await preview()).radius === "999px", "composition applies extension shape");
assert((await usage()).includes("variants={{}}"), "composition inherits its own defaults");
await click("primary");
assert((await preview()).background === before.background, "composition retains base variants");
await nav("TypeScript Inference");
await click("lg");
assert(
  (await usage()).includes("<Button {...variants}>") && (await usage()).includes('"size": "lg"'),
  "inferred component usage updates",
);
const cardPreview = () =>
  evaluate(
    `(()=>{const root=document.querySelector('section[aria-label="Live preview"] article');const title=root.querySelector('h3');const description=root.querySelector('p');return {root:root.className,title:title.className,description:description.className,border:getComputedStyle(root).borderWidth,transform:getComputedStyle(title).textTransform,padding:getComputedStyle(root).padding}})()`,
  );
await nav("Slots");
const plainCard = await cardPreview();
assert(
  plainCard.root && plainCard.title && plainCard.description,
  "all three slots render compiled styles",
);
await click("accent");
const accentCard = await cardPreview();
assert(
  accentCard.root !== plainCard.root &&
    accentCard.title !== plainCard.title &&
    accentCard.description === plainCard.description,
  "slot variants affect only their declared elements",
);
await click("compact");
assert((await cardPreview()).padding !== accentCard.padding, "density changes root spacing");
const cardSource = await usage();
assert(
  cardSource.includes("export function CardExample") &&
    ["root", "title", "description"].every((slot) => cardSource.includes(`card.${slot}(variants)`)),
  "generated card is the complete actual multi-slot React component",
);
assert(
  cardSource.includes('"tone": "accent"') && cardSource.includes('"density": "compact"'),
  "generated card invocation contains selected variants",
);
await click("↺ Reset");
assert(
  (await cardPreview()).root === plainCard.root && (await usage()).includes("variants={{}}"),
  "slot reset restores recipe defaults and generated invocation",
);
await nav("Compound Slots");
const activeCard = await cardPreview();
assert(
  activeCard.border === "2px" && activeCard.transform === "uppercase",
  "compoundSlots activates root and title together",
);
await click("comfortable");
const inactiveCard = await cardPreview();
assert(
  inactiveCard.border === "1px" && inactiveCard.transform === "none",
  "compoundSlots requires both conditions",
);
assert(
  inactiveCard.description === activeCard.description,
  "compoundSlots leaves unrelated description unchanged",
);
await click("↺ Reset");
assert((await cardPreview()).border === "2px", "compoundSlots reset restores matching selection");
await nav("Basic Variants");
await send("Page.bringToFront");
await send("Browser.grantPermissions", {
  origin: new URL(appUrl).origin,
  permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
});
await click("Copy code");
assert(
  await evaluate(`document.body.textContent.includes('Copied ✓')`),
  "clipboard copy confirms success",
);
assert(
  (await evaluate("navigator.clipboard.readText()")).includes("export const button = sxv("),
  "clipboard contains executable recipe",
);
await evaluate(`document.querySelector('section[aria-label="React component"] button').click()`);
await new Promise((r) => setTimeout(r, 200));
const copiedComponent = await evaluate("navigator.clipboard.readText()");
assert(
  copiedComponent.includes("export function ButtonExample") &&
    copiedComponent.includes("export default function Example") &&
    copiedComponent.includes("button(variants)"),
  "copy returns the complete React component and its current usage",
);
await evaluate(
  `document.querySelector('button[aria-label="Use light preview background"]').click()`,
);
await new Promise((r) => setTimeout(r, 200));
assert(
  await evaluate(
    `document.querySelector('button[aria-label="Use light preview background"]').getAttribute('aria-pressed')==='true'`,
  ),
  "preview theme toggles",
);
await evaluate(
  `document.querySelector('button[aria-label="Use light preview background"]').click()`,
);
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1100,
  deviceScaleFactor: 1,
  mobile: false,
});
for (const width of [768, 390, 320]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  assert(
    await evaluate("document.documentElement.scrollWidth <= innerWidth"),
    `${width}px viewport has no horizontal page overflow`,
  );
  await nav("Compound Slots");
  await click("comfortable");
  assert((await cardPreview()).border === "1px", `${width}px slot controls remain functional`);
  assert(
    await evaluate("document.documentElement.scrollWidth <= innerWidth"),
    `${width}px card has no horizontal overflow`,
  );
}
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
assert(errors.length === 0, "no browser runtime errors");
ws.close();
