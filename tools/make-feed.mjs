// Builds data/feed.tsv: compact list of recently added postings for the daily digest.
import { readFileSync, writeFileSync } from 'fs';
const rows = readFileSync('data/scan-history.tsv', 'utf8').split('\n').map(l => l.split('\t'));
const h = rows[0], ix = Object.fromEntries(h.map((k, i) => [k, i]));
const cutoff = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
const out = rows.slice(1).filter(r => r[ix.status] === 'added' && r[ix.location] && r[ix.first_seen] >= cutoff)
  .sort((a, b) => b[ix.first_seen].localeCompare(a[ix.first_seen]))
  .map(r => [r[ix.first_seen], r[ix.company].replace(/^IN-/, ''), r[ix.title], r[ix.location], r[ix.posted_at], r[ix.url]].join('\t'));
writeFileSync('data/feed.tsv', ['first_seen\tcompany\ttitle\tlocation\tposted_at\turl', ...out].join('\n') + '\n');
console.log(`feed: ${out.length} rows`);
