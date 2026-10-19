// One-off reachability probe: a few polite requests, logs status + parsed counts only.
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function hit(name, url, headers = {}, parse) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en-IN,en;q=0.9', ...headers }, redirect: 'follow' });
    const t = await r.text();
    let n = parse ? parse(t) : '';
    console.log(`${name}: HTTP ${r.status} bytes=${t.length} parsed=${n} captcha/block-hint=${/captcha|access denied|unusual traffic|authwall|are you a human|akamai/i.test(t)}`);
    console.log(`  sample: ${t.slice(0, 160).replace(/\s+/g, ' ')}`);
  } catch (e) { console.log(`${name}: ERROR ${e.message}`); }
  await sleep(4000);
}
const li = q => `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(q)}&location=India&f_TPR=r86400&start=0`;
const liCount = t => (t.match(/base-search-card__title/g) || []).length;
await hit('linkedin genai engineer', li('GenAI engineer'), {}, liCount);
await hit('linkedin forward deployed engineer', li('forward deployed engineer'), {}, liCount);
await hit('naukri html', 'https://www.naukri.com/gen-ai-engineer-jobs-in-india?jobAge=1', {}, t => (t.match(/jobTuple|srp-jobtuple/g) || []).length);
await hit('naukri api', 'https://www.naukri.com/jobapi/v3/search?noOfResults=20&urlType=search_by_keyword&searchType=adv&keyword=gen%20ai%20engineer&location=india&jobAge=1&pageNo=1&seoKey=gen-ai-engineer-jobs-in-india&src=jobsearchDesk',
  { appid: '109', systemid: 'Naukri', accept: 'application/json', clientid: 'd3skt0p' }, t => { try { return JSON.parse(t).jobDetails?.length ?? 'json-no-jobDetails'; } catch { return 'not-json'; } });
