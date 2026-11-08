#!/usr/bin/env node
// Prints, for each npm package, the newest stable release published at least N days ago (default 14),
// from the registry's publish times. No dependencies; Node 18+.
//
//   node mature-version.mjs react @codemirror/view --days 14
//   react             19.1.1   2025-07-28   (newest: 19.2.0, 2025-10-01, too recent)
//
// Exit code 1 if a package has no release old enough, or can't be fetched.

const args = process.argv.slice(2);
let days = 14;
const packages = [];
for (let i = 0; i < args.length; i++) {
	if (args[i] === "--days") days = Number(args[++i]);
	else if (args[i] === "-h" || args[i] === "--help") {
		console.log("Usage: mature-version.mjs <package…> [--days 14]");
		process.exit(0);
	} else packages.push(args[i]);
}
if (packages.length === 0 || !Number.isFinite(days) || days < 0) {
	console.error("Usage: mature-version.mjs <package…> [--days 14]");
	process.exit(2);
}

const registry = (process.env.npm_config_registry ?? "https://registry.npmjs.org").replace(/\/+$/, "");
const cutoff = Date.now() - days * 86_400_000;
const day = (iso) => iso.slice(0, 10);
// Stable versions only: x.y.z, no pre-release tag.
const stable = (version) => /^\d+\.\d+\.\d+$/.test(version);
const compare = (a, b) => {
	const [x, y] = [a, b].map((v) => v.split(".").map(Number));
	for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
	return 0;
};

let failed = false;
const width = Math.max(...packages.map((p) => p.length));
for (const name of packages) {
	const url = `${registry}/${name.startsWith("@") ? `@${encodeURIComponent(name.slice(1))}` : encodeURIComponent(name)}`;
	let doc;
	try {
		const response = await fetch(url, { headers: { accept: "application/json" } });
		if (!response.ok) throw new Error(`the registry answered ${response.status}`);
		doc = await response.json();
	} catch (error) {
		console.error(`${name.padEnd(width)}  could not be fetched: ${error.message}`);
		failed = true;
		continue;
	}
	const times = Object.entries(doc.time ?? {}).filter(([v]) => stable(v) && doc.versions?.[v] && !doc.versions[v].deprecated);
	// The highest version (not the latest published: a backport can come after a newer major).
	const newest = times.sort(([a], [b]) => compare(b, a))[0];
	const mature = times.find(([, at]) => Date.parse(at) <= cutoff);
	if (!mature) {
		console.error(`${name.padEnd(width)}  no stable release at least ${days} days old`);
		failed = true;
		continue;
	}
	const note = newest && newest[0] !== mature[0] ? `   (newest: ${newest[0]}, ${day(newest[1])}, too recent)` : "";
	console.log(`${name.padEnd(width)}  ${mature[0].padEnd(9)}  ${day(mature[1])}${note}`);
}
process.exit(failed ? 1 : 0);
