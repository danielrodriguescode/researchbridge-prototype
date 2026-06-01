/* ============================================================
   ResearchBridge — DATA MODULE
   Static content + rule-based dictionaries. No backend.
============================================================ */

/* ------------------------------------------------------------
   DEMO / EXAMPLE STUDIES
------------------------------------------------------------ */
const DEMOS = {
  s1: {
    audience: 'policymaker', objective: 'motivate',
    title: 'Colorectal cancer risk model',
    blurb: 'An AI model that predicts 10-year colorectal cancer risk from routine health records across Portuguese hospitals.',
    pills: ['Policy Maker', 'Motivate a decision'],
    abstract: `We developed a machine learning model to predict 10-year colorectal cancer risk in adults aged 40–65 using electronic health records from 12,847 patients across three Portuguese hospital centres (2015–2022). The model achieved an AUC of 0.83 (95% CI: 0.79–0.87) and identified family history, BMI >30, and smoking status as the three strongest predictors. Compared to current national screening guidelines, our model would identify an additional 23% of high-risk individuals while reducing unnecessary colonoscopies by 31%. Implementation as a primary care decision-support tool could prevent an estimated 340 colorectal cancer deaths annually in Portugal.`
  },
  s2: {
    audience: 'clinical', objective: 'present-tool',
    title: 'Cardiac event early-warning model',
    blurb: 'A real-time model that predicts in-hospital cardiac events four hours in advance in a coronary care unit.',
    pills: ['Clinical Team', 'Introduce a new tool'],
    abstract: `This study presents a real-time predictive model for in-hospital cardiac events in patients admitted to the Coronary Care Unit. Using a deep learning architecture trained on 6-hour vital sign sequences from 2,341 admissions (2019–2023), the model predicted adverse events 4 hours in advance with sensitivity of 79% and specificity of 88%. Integration into the bedside monitoring system showed a 34% reduction in false alarm fatigue among nursing staff. The model requires approximately 2 GB of GPU memory and achieves inference latency under 200 ms per patient.`
  }
};

/* ------------------------------------------------------------
   AUDIENCE LABELS
------------------------------------------------------------ */
const AUD_LABELS = {
  policymaker:'policymakers', clinical:'a clinical team', patient:'a patient group',
  public:'the general public', funder:'funders & stakeholders'
};
const EXP_LABELS = {
  policymaker:'POLICY BRIEF', clinical:'CLINICAL SUMMARY', patient:'PATIENT INFORMATION',
  public:'RESEARCH SUMMARY', funder:'STAKEHOLDER BRIEF'
};

/* ------------------------------------------------------------
   AUDIENCE PROFILES  (survey R11)
------------------------------------------------------------ */
const AUD_PROFILE = {
  policymaker: {
    emoji:'🏛', title:'Policy Maker', sub:'Government officials, health-ministry staff, regulators',
    cares:'The practical decision: what to fund, approve, or change — and the public-health payoff.',
    knows:'Health-system savvy, but rarely statistics or data science. Assumes nothing technical.',
    attention:'Very short. Reads the first paragraph; skims the rest.',
    evidence:'Concrete numbers tied to lives, costs, and feasibility. One clear recommendation.',
    avoid:'Methodology up front, p-values, confidence intervals, hedged academic caveats.'
  },
  clinical: {
    emoji:'🩺', title:'Clinical Team', sub:'Doctors, nurses, allied health professionals',
    cares:'Impact on patients and workflow: will this help me decide or act, and is it safe?',
    knows:'Strong clinical knowledge; variable comfort with ML/biostatistics.',
    attention:'Moderate, but time-pressured. Responds to clinical stories and cases.',
    evidence:'Clinical impact framing (sensitivity as "catches X in Y"), validation in real settings.',
    avoid:'ROC curves, training graphs, architecture details, raw statistical jargon.'
  },
  patient: {
    emoji:'👥', title:'Patient Group', sub:'Patients, carers, patient advocates',
    cares:'What it means for me and my family: am I at risk, what should I do, is my data safe?',
    knows:'Generally low health literacy. Needs plain words and reassurance.',
    attention:'Variable; emotional engagement matters more than completeness.',
    evidence:'Relatable framing ("1 in 20 people"), empathy, clear next steps. Reading age ~12.',
    avoid:'Acronyms, percentages without context, anything that sounds alarming or cold.'
  },
  public: {
    emoji:'🌍', title:'General Public', sub:'Journalists, community groups, social media',
    cares:'Why this matters and why now: the story, the human angle, the surprising fact.',
    knows:'No specialist knowledge; short, distracted, scrolling.',
    attention:'Seconds. Needs a hook in the first line.',
    evidence:'One memorable number, a human story, a shareable visual. Inverted-pyramid structure.',
    avoid:'Jargon of any kind, dense statistics, more than ~500 words.'
  },
  funder: {
    emoji:'💼', title:'Funders & Stakeholders', sub:'Grant bodies, non-academic partners, industry',
    cares:'Return on investment: impact, milestones met, risk, and what the next money buys.',
    knows:'Strategic and financial literacy; not the technical detail of your methods.',
    attention:'Short and outcome-focused. Wants evidence the investment is working.',
    evidence:'Deliverables hit, impact metrics, value-for-money, a credible plan for what is next.',
    avoid:'Methodological depth, unquantified claims, jargon, vague "more research needed".'
  }
};

/* ------------------------------------------------------------
   JARGON DICTIONARY  (rule-based detection — survey R1/R5/R10)
------------------------------------------------------------ */
const JARGON_DICT = [
  { re:/\bAUC\b|\bAUROC\b|area under the curve/i, o:'AUC / AUROC', p:'overall accuracy score (independently verified)' },
  { re:/\bROC\b|receiver operating/i, o:'ROC curve', p:'accuracy trade-off chart → consider removing' },
  { re:/95%\s*CI|confidence interval/i, o:'95% confidence interval', p:'→ remove from main text' },
  { re:/\bsensitivity\b/i, o:'sensitivity', p:'how often it correctly catches true cases' },
  { re:/\bspecificity\b/i, o:'specificity', p:'how often it correctly clears healthy people' },
  { re:/p\s*[<=>]\s*0?\.\d+|p-value|statistical(?:ly)? signific/i, o:'p-value / significance', p:'→ remove; mention verbally only if asked' },
  { re:/hazard ratio|\bHR\b/i, o:'hazard ratio', p:'relative risk over time' },
  { re:/odds ratio|\bOR\b/i, o:'odds ratio', p:'relative odds' },
  { re:/deep learning/i, o:'deep learning architecture', p:'advanced AI trained on patterns' },
  { re:/machine learning|\bML\b/i, o:'machine learning model', p:'AI that learns from data' },
  { re:/\bLSTM\b|recurrent neural|neural network/i, o:'neural network / LSTM', p:'pattern-recognition AI' },
  { re:/electronic health record|\bEHR\b|\bEMR\b/i, o:'electronic health records', p:'patient medical records' },
  { re:/\bcohort\b/i, o:'cohort', p:'group of patients followed over time' },
  { re:/retrospective/i, o:'retrospective', p:'based on past records' },
  { re:/prospective/i, o:'prospective', p:'following patients forward in time' },
  { re:/inference latency|latency (?:under|<)?\s*\d+\s*ms/i, o:'inference latency', p:'how fast a result appears (instant)' },
  { re:/\bGPU\b|\d+\s*GB/i, o:'GPU / memory specs', p:'→ remove — not relevant to this audience' },
  { re:/number needed to treat|\bNNT\b/i, o:'number needed to treat', p:'patients treated per one who benefits' },
  { re:/kaplan-?meier/i, o:'Kaplan-Meier curve', p:'survival-over-time chart' },
  { re:/biomarker/i, o:'biomarker', p:'measurable health indicator' },
  { re:/\balgorithm\b/i, o:'algorithm', p:'set of rules the computer follows' },
  { re:/regression/i, o:'regression model', p:'statistical relationship analysis' },
  { re:/decision[- ]support/i, o:'decision-support tool', p:'tool that flags at-risk patients for the clinician' }
];

/* ------------------------------------------------------------
   OBJECTIVES per audience
------------------------------------------------------------ */
const OBJS = {
  policymaker: [
    { id:'motivate', icon:'🎯', h:'Motivate a decision', p:'Make the case for a specific policy action or programme' },
    { id:'brief',    icon:'📋', h:'Summarise the evidence', p:'Provide an accessible overview of the research landscape' },
    { id:'funding',  icon:'💶', h:'Support a funding request', p:'Justify resource allocation with evidence-based arguments' }
  ],
  clinical: [
    { id:'present-tool', icon:'🔬', h:'Introduce a new tool or method', p:'Present a new approach and argue for its adoption' },
    { id:'findings',     icon:'📈', h:'Share new clinical findings', p:'Communicate results and their implications for practice' },
    { id:'protocol',     icon:'📋', h:'Propose a protocol change', p:'Present evidence supporting a change to clinical practice' }
  ],
  patient: [
    { id:'explain',  icon:'💡', h:'Explain your research', p:'Help patients understand what you are studying and why' },
    { id:'results',  icon:'📊', h:'Share study results', p:'Communicate findings and what they mean for patients' },
    { id:'recruit',  icon:'🤝', h:'Recruit participants', p:'Invite eligible individuals to take part in your study' }
  ],
  public: [
    { id:'awareness',  icon:'📢', h:'Raise awareness', p:'Help people understand why this health issue matters' },
    { id:'findings',   icon:'🔍', h:'Share key findings', p:'Communicate your results to a broad non-specialist audience' },
    { id:'relevance',  icon:'❤️', h:'Explain personal relevance', p:'Connect the research to everyday life and individual health' }
  ],
  funder: [
    { id:'impact',   icon:'📈', h:'Justify impact & value', p:'Show the return on investment and real-world impact' },
    { id:'progress', icon:'✅', h:'Report progress', p:'Communicate milestones reached against the plan' },
    { id:'continue', icon:'💶', h:'Secure continued funding', p:'Make the case for the next phase of investment' }
  ]
};

/* ============================================================
   RECOMMENDATIONS  —  RECS[example][audience][objective]
   Each set: { al, ol, msg[3], data[3], jargon[], fmt[], prereq[], qa[] }
============================================================ */
const RECS = {

  /* =========================================================
     EXAMPLE 1 — Colorectal cancer risk model
  ========================================================= */
  s1: {
    policymaker: {
      motivate: {
        al:'Policymaker', ol:'Motivate a decision',
        msg:[
          { l:'Lead with', t:'An AI-based screening tool could prevent 340 colorectal cancer deaths per year in Portugal — validated across nearly 13,000 Portuguese patients.' },
          { l:'Support with', t:'The model identifies 23% more high-risk individuals than current guidelines, while reducing unnecessary colonoscopies by 31%, cutting both human and financial costs.' },
          { l:'The ask', t:'Approve a pilot implementation in 3 primary care centres in 2026, with a 12-month evaluation and publication of results.' }
        ],
        data:[ { n:'340', l:'preventable deaths\nper year in Portugal' }, { n:'23%', l:'more high-risk\nindividuals identified' }, { n:'31%', l:'fewer unnecessary\ncolonoscopies' } ],
        jargon:[ { o:'AUC of 0.83', p:'high accuracy, independently verified' }, { o:'95% CI: 0.79–0.87', p:'→ remove entirely' }, { o:'machine learning model', p:'AI-based risk prediction tool' }, { o:'electronic health records', p:'patient medical records' }, { o:'primary care decision-support', p:'tool for GPs to flag at-risk patients' } ],
        fmt:[ { i:'📄', h:'Format: 1-page PDF policy brief', p:'Maximum 400 words. Lead with patient impact, not study design.' }, { i:'📧', h:'Channel: Direct email to DGS', p:'Address the Director de Serviços or deputy. CC relevant programme coordinator.' }, { i:'📞', h:'Follow-up: Offer a 15-minute call', p:'Attach the full paper as reference only — not required reading.' }, { i:'⚠️', h:'Avoid: Methodological language in paragraph 1', p:'Start with the outcome (340 deaths), then the evidence.' } ],
        prereq:[ 'That screening today misses a share of high-risk adults before diagnosis.', 'That an AI tool reuses data the health service already holds — no new tests.', 'That a pilot is low-risk: it runs alongside current practice, not instead of it.' ],
        qa:[ { q:'How much will this cost to implement?', a:'Frame against the cost of late-stage cancer treatment the tool helps avoid — the pilot is designed to produce exactly that economic evidence.' }, { q:'Can we trust an algorithm with this decision?', a:'It flags patients for a clinician to review — it never decides alone. Accuracy was independently verified on ~13,000 Portuguese patients.' }, { q:'Why now, and why us?', a:'The model is validated and ready; what is missing is a real-world pilot. Portugal can lead rather than follow.' } ]
      },
      brief: {
        al:'Policymaker', ol:'Summarise the evidence',
        msg:[
          { l:'Framing', t:'Current screening guidelines miss a significant proportion of high-risk adults before diagnosis at early stages.' },
          { l:'Evidence overview', t:'Three independent Portuguese studies (2019–2023) converge on AI-assisted early detection as both accurate and cost-effective in primary care settings.' },
          { l:'Conclusion', t:'The evidence base supports a structured evaluation of AI-assisted screening within the Portuguese National Health Service.' }
        ],
        data:[ { n:'3', l:'independent Portuguese\nstudies aligned' }, { n:'+23%', l:'more high-risk patients\nidentified vs. guidelines' }, { n:'2026', l:'optimal window\nfor pilot evaluation' } ],
        jargon:[ { o:'AUC / ROC', p:'accuracy measure' }, { o:'prospective cohort', p:'study following patients over time' }, { o:'systematic review', p:'comprehensive evidence review' } ],
        fmt:[ { i:'📋', h:'Format: 2-page evidence summary', p:'Include a table comparing existing approaches and their limitations.' }, { i:'📎', h:'Attach: Key papers as annexes', p:'Annotate each with a one-line plain-language summary.' } ],
        prereq:[ 'The difference between a single study and a converging body of evidence.', 'That "cost-effective" here means fewer late diagnoses and fewer needless procedures.' ],
        qa:[ { q:'Is the evidence strong enough to act on?', a:'Three independent studies agree — that convergence is what distinguishes a robust signal from a one-off result.' }, { q:'What would a structured evaluation involve?', a:'A time-limited pilot with pre-agreed metrics, independent analysis, and published results.' } ]
      },
      funding: {
        al:'Policymaker', ol:'Support a funding request',
        msg:[
          { l:'The problem', t:'Colorectal cancer is the second most common cancer in Portugal, with significant preventable mortality if detected early.' },
          { l:'The solution', t:'An AI-based screening tool validated in Portuguese hospitals can identify high-risk patients earlier, reducing costs and saving lives.' },
          { l:'The request', t:'Request funding for a 2-year pilot across 5 primary care units, including implementation, training, and independent evaluation.' }
        ],
        data:[ { n:'340', l:'lives saved\nper year (projected)' }, { n:'31%', l:'reduction in unnecessary\nprocedures (cost savings)' }, { n:'2 yr', l:'pilot timeline\nto produce evidence' } ],
        jargon:[ { o:'cost-effectiveness ratio', p:'value for money' }, { o:'health technology assessment', p:'evaluation of the tool\'s benefits and costs' }, { o:'implementation science', p:'how to put the research into practice' } ],
        fmt:[ { i:'💶', h:'Format: Structured budget proposal', p:'Include cost per patient screened vs. cost of late-stage cancer treatment.' }, { i:'📊', h:'Attach: Economic modelling summary', p:'Even a simple cost-benefit table strengthens the case.' } ],
        prereq:[ 'The scale of preventable colorectal cancer mortality in Portugal.', 'That early detection is dramatically cheaper than late-stage treatment.' ],
        qa:[ { q:'What is the return on this investment?', a:'Each late-stage cancer avoided saves both lives and substantial treatment cost — the pilot quantifies this precisely.' }, { q:'What happens if the pilot fails?', a:'It is time-boxed with clear stop criteria; the downside is limited and the learning is valuable either way.' } ]
      }
    },
    clinical: {
      'present-tool': {
        al:'Clinical Team', ol:'Introduce a new tool',
        msg:[
          { l:'Lead with clinical impact', t:'This tool flags patients at high colorectal cancer risk during routine visits — identifying 23% more high-risk people than age-based screening, before symptoms appear.' },
          { l:'Support with evidence', t:'Validated on 12,847 patients across three Portuguese centres, using data already in the record — family history, BMI, smoking — with no new tests.' },
          { l:'The ask', t:'Trial it as a risk flag in the primary-care record for 3 months; you keep full control of who is referred.' }
        ],
        data:[ { n:'23%', l:'more high-risk\npatients identified' }, { n:'31%', l:'fewer unnecessary\ncolonoscopies' }, { n:'0', l:'new tests required\nfor patients' } ],
        jargon:[ { o:'AUC of 0.83', p:'accuracy, independently verified' }, { o:'machine learning model', p:'tool that learns risk patterns from records' }, { o:'positive predictive value', p:'of those flagged, the share who truly are high-risk' }, { o:'electronic health records', p:'the notes you already keep' } ],
        fmt:[ { i:'🖥', h:'Replace: ROC curve', p:'Show a "who gets flagged, who gets referred" worked example instead.' }, { i:'📋', h:'Add: Prerequisite slide', p:'"What you need to know first" — what the flag is and is not.' }, { i:'⏱', h:'Format: 10-minute slot at the clinical meeting', p:'Story → evidence → how it fits the workflow. Add a one-line referral pathway.' }, { i:'💬', h:'Prepare: "More flags = more work?"', p:'Answer: it cuts low-yield colonoscopies by 31% while catching more true cases.' } ],
        prereq:[ 'That it uses existing record data — no new tests.', 'That a flag is a prompt to consider referral, not an automatic order.' ],
        qa:[ { q:'Will this flood us with referrals?', a:'No — it reduces low-value colonoscopies by 31% while catching more true high-risk cases.' }, { q:'What about patients it misses?', a:'It adds to your clinical judgement and current guidelines; it does not replace them.' } ]
      },
      findings: {
        al:'Clinical Team', ol:'Share new findings',
        msg:[
          { l:'Clinical headline', t:'Family history, BMI over 30, and smoking together identify a high-risk group that age-based screening misses — up to 10 years before diagnosis.' },
          { l:'What this means for practice', t:'These three factors, already in your records, rank a patient\'s 10-year colorectal cancer risk more accurately than age alone.' },
          { l:'Next step', t:'We would value your input on where a risk flag would best fit your consultation workflow.' }
        ],
        data:[ { n:'10yr', l:'risk horizon\npredicted' }, { n:'3', l:'strongest predictors\n(all in the record)' }, { n:'12,847', l:'patients in the\nvalidation set' } ],
        jargon:[ { o:'AUC / discrimination', p:'how well it separates high- from low-risk' }, { o:'hazard ratio', p:'how much each factor raises risk' }, { o:'cohort', p:'patients followed over time' } ],
        fmt:[ { i:'📊', h:'Replace forest plots with a clinical impact table', p:'Risk group | risk with age alone | risk with the model | difference.' }, { i:'🎯', h:'End with: "What we need from you"', p:'Where a flag fits, and the acceptable referral threshold.' } ],
        prereq:[ 'That age-based screening alone misses a meaningful high-risk group.', 'Which three factors combine to raise risk.' ],
        qa:[ { q:'Is this ready for clinic?', a:'Not yet — we are gathering clinical input on workflow and thresholds first.' }, { q:'How strong is the evidence?', a:'12,847 patients across three centres, with independent validation.' } ]
      },
      protocol: {
        al:'Clinical Team', ol:'Propose a protocol change',
        msg:[
          { l:'Current practice gap', t:'Screening referral is currently triggered mainly by age, missing younger high-risk adults.' },
          { l:'Proposed change', t:'Add an automated risk flag at routine consultations for adults 40–65, prompting a referral conversation.' },
          { l:'Evidence basis', t:'Validated in 12,847 patients: the flag identifies 23% more high-risk individuals while cutting unnecessary colonoscopies by 31%.' }
        ],
        data:[ { n:'+23%', l:'more high-risk\nfound' }, { n:'31%', l:'fewer needless\ncolonoscopies' }, { n:'40–65', l:'target age\ngroup' } ],
        jargon:[ { o:'number needed to screen', p:'how many flagged per cancer found early' }, { o:'sensitivity', p:'share of true high-risk patients caught' } ],
        fmt:[ { i:'📋', h:'Format: 1-page protocol amendment', p:'Current practice → proposed change → evidence → evaluation metrics.' }, { i:'✅', h:'Include: Implementation checklist', p:'Record change, brief training, sign-off owner.' } ],
        prereq:[ 'Exactly where the flag sits in the visit.', 'That it is a prompt, not an automatic referral.' ],
        qa:[ { q:'Who approves this change?', a:'It is framed as a 1-page amendment with an evaluation plan and an approval line.' }, { q:'What is the burden on us?', a:'A single flag in the record — seconds per eligible patient — plus a short briefing.' } ]
      }
    },
    funder: {
      impact: {
        al:'Funders & Stakeholders', ol:'Justify impact & value',
        msg:[
          { l:'Headline impact', t:'Your investment produced a validated tool that could prevent an estimated 340 colorectal cancer deaths a year in Portugal — a clear, measurable public-health return.' },
          { l:'Evidence of value', t:'Built and tested on nearly 13,000 Portuguese patients, the tool identifies 23% more high-risk people while cutting unnecessary colonoscopies by 31% — better outcomes at lower system cost.' },
          { l:'What this enables', t:'The project is now ready to move from research to a real-world pilot, turning the investment into demonstrable clinical and economic impact.' }
        ],
        data:[ { n:'340', l:'preventable deaths\nper year (projected)' }, { n:'31%', l:'fewer unnecessary\nprocedures (cost saved)' }, { n:'12,847', l:'patients in the\nvalidation base' } ],
        jargon:[ { o:'AUC of 0.83', p:'independently verified accuracy' }, { o:'machine learning model', p:'AI-based risk prediction tool' }, { o:'decision-support tool', p:'tool that flags at-risk patients for GPs' }, { o:'95% confidence interval', p:'→ remove from the headline summary' } ],
        fmt:[ { i:'📈', h:'Format: 1-page impact summary', p:'Lead with the impact number, then value-for-money, then what comes next.' }, { i:'📊', h:'Include: A simple cost-vs-benefit visual', p:'Cost of early screening vs. cost of late-stage treatment avoided.' }, { i:'🏁', h:'Close with: The readiness milestone', p:'State plainly that the work is now pilot-ready.' } ],
        prereq:[ 'That accuracy was confirmed on real Portuguese patient data, not a simulation.', 'That "impact" here is both lives saved and system costs avoided.' ],
        qa:[ { q:'How do we know the money was well spent?', a:'The deliverable is a validated, pilot-ready tool with a quantified public-health and cost case.' }, { q:'What is the risk from here?', a:'The science risk is largely retired; remaining risk is implementation, which the pilot manages.' } ]
      },
      progress: {
        al:'Funders & Stakeholders', ol:'Report progress',
        msg:[
          { l:'Where we are', t:'All planned research milestones for this phase are complete: the model is built, validated on ~13,000 patients, and accepted for publication.' },
          { l:'Against the plan', t:'Delivery is on schedule. The validation results meet or exceed the accuracy targets set at the start of the grant.' },
          { l:'Next milestone', t:'The next phase moves to a clinical pilot — the natural transition from proof to practice.' }
        ],
        data:[ { n:'100%', l:'phase-1 milestones\ncompleted' }, { n:'0.83', l:'accuracy achieved\nvs. 0.80 target' }, { n:'2026', l:'pilot start\nplanned' } ],
        jargon:[ { o:'AUC 0.83 vs. target 0.80', p:'accuracy beat the agreed target' }, { o:'external validation', p:'independent confirmation the tool works' }, { o:'deployment-ready', p:'ready to be tested in a real clinic' } ],
        fmt:[ { i:'✅', h:'Format: Milestone status table', p:'Planned → status → evidence. Green/amber/red at a glance.' }, { i:'📅', h:'Include: Updated timeline', p:'What is done, what is next, any changes to dates.' } ],
        prereq:[ 'Which milestones were promised for this phase.', 'That beating the accuracy target is the key go/no-go signal for the pilot.' ],
        qa:[ { q:'Are you on track?', a:'Yes — 100% of phase-1 milestones are met and the accuracy target was exceeded.' }, { q:'Any risks to the next phase?', a:'The main dependency is securing clinical sites for the pilot; conversations have begun.' } ]
      },
      continue: {
        al:'Funders & Stakeholders', ol:'Secure continued funding',
        msg:[
          { l:'What you have already enabled', t:'Phase 1 delivered a validated, publication-ready tool that could prevent 340 deaths a year — the hard scientific risk is now behind us.' },
          { l:'What the next investment buys', t:'Phase 2 funding turns the validated model into a real-world pilot in primary care, producing the clinical and economic evidence needed for national adoption.' },
          { l:'The ask', t:'Continue funding for a 2-year pilot across 5 primary care units, with independent evaluation and published results.' }
        ],
        data:[ { n:'340', l:'preventable deaths\nthe tool targets' }, { n:'2 yr', l:'pilot to evidence\nfor adoption' }, { n:'5', l:'primary care units\nin the next phase' } ],
        jargon:[ { o:'translational pilot', p:'putting the research into real clinical use' }, { o:'health technology assessment', p:'formal evaluation of benefits and costs' }, { o:'scalability', p:'whether it can work nationwide, not just one site' } ],
        fmt:[ { i:'💶', h:'Format: Phase-2 proposal (2 pages)', p:'Recap impact → what is de-risked → what the next money delivers → ask.' }, { i:'📊', h:'Include: A clear milestone-and-budget table', p:'Tie each deliverable to a cost and a date.' } ],
        prereq:[ 'That phase 1 already retired the main scientific risk.', 'That phase 2 is about evidence for adoption, not more basic research.' ],
        qa:[ { q:'Why fund more — is the work not done?', a:'The science is done; the value is realised only once it is piloted in real clinics. Phase 2 delivers that evidence.' }, { q:'What do we get for the next investment?', a:'A real-world pilot with independent evaluation — the evidence base required for national-scale adoption.' } ]
      }
    },
    patient: {
      explain: {
        al:'Patient Group', ol:'Explain your research',
        msg:[
          { l:'What we are studying', t:'We are developing a computer tool that learns to spot patterns in routine health check-up data, to identify people who may be at higher risk of colorectal cancer before symptoms appear.' },
          { l:'Why it matters', t:'Most colorectal cancer cases are found late, when treatment is harder. Finding people at risk earlier means treatment can start sooner — when it works best.' },
          { l:'What we are asking', t:'We are currently recruiting volunteers to check that the tool works fairly for different groups of people.' }
        ],
        data:[ { n:'1 in 20', l:'people develop\ncolorectal cancer' }, { n:'90%', l:'survival rate if\ndetected early' }, { n:'12,847', l:'people already\nin our study' } ],
        jargon:[ { o:'machine learning algorithm', p:'computer tool that learns from patient data' }, { o:'AUC of 0.83', p:'→ omit; say "the tool has been tested and performs accurately"' }, { o:'electronic health records', p:'your routine medical records' }, { o:'colorectal cancer incidence', p:'how often colorectal cancer occurs' } ],
        fmt:[ { i:'📄', h:'Format: 1-page patient information sheet', p:'Plain language (reading age 12). Avoid acronyms. Include a FAQ box.' }, { i:'🖼', h:'Add: A simple diagram of how the tool works', p:'Your data → tool → GP alert → earlier screening.' } ],
        prereq:[ 'That the tool uses records that already exist — no new tests for you.', 'That "higher risk" does not mean you have cancer — it means earlier checking.' ],
        qa:[ { q:'Does this mean I have cancer?', a:'No. The tool helps find people who should be checked sooner — being flagged is about earlier care, not a diagnosis.' }, { q:'Is my information safe?', a:'Your records are used with your name and address removed, and only with your permission.' } ]
      },
      results: {
        al:'Patient Group', ol:'Share study results',
        msg:[
          { l:'What we found', t:'Our study shows that a computer tool using your routine health records can identify people at high risk of colorectal cancer earlier than current screening guidelines.' },
          { l:'What this means for you', t:'In the future, this could mean your GP is alerted to check you earlier — even before you notice any symptoms.' },
          { l:'What happens next', t:'We are working with health authorities to evaluate whether this tool can be used in Portuguese primary care clinics.' }
        ],
        data:[ { n:'340', l:'lives that could be\nsaved per year' }, { n:'+23%', l:'more at-risk patients\nidentified early' }, { n:'2026', l:'target year for\npilot in GP clinics' } ],
        jargon:[ { o:'sensitivity/specificity', p:'→ omit; use "accurately identifies most at-risk people while avoiding unnecessary worry"' }, { o:'95% confidence interval', p:'→ omit entirely' }, { o:'primary care', p:'your GP or family health centre' } ],
        fmt:[ { i:'💬', h:'Format: Short letter or video message', p:'Begin with "Thank you for being part of our study." End with what you are doing with the findings.' }, { i:'📞', h:'Offer: A Q&A session or helpline', p:'Many participants want to know if they were in the high-risk group. Plan your policy in advance.' } ],
        prereq:[ 'That these are early results that still need to be confirmed in clinics.', 'That nothing changes in your own care right now because of this study.' ],
        qa:[ { q:'Was I in the high-risk group?', a:'Decide your policy in advance — be clear about what you can and cannot tell participants individually.' }, { q:'When will this reach my GP?', a:'Not yet — the tool is being evaluated with health authorities, with a pilot targeted for 2026.' } ]
      },
      recruit: {
        al:'Patient Group', ol:'Recruit participants',
        msg:[
          { l:'Why we need your help', t:'We are developing a computer tool to detect colorectal cancer risk earlier. To make it fair and accurate, we need it tested on a wide range of people.' },
          { l:'What being in the study involves', t:'We would ask to use your anonymised health records from your GP. No extra tests, no appointments, no disruption to your care.' },
          { l:'Your rights', t:'Your participation is entirely voluntary. You can withdraw at any time without affecting your healthcare.' }
        ],
        data:[ { n:'30 min', l:'total time\nrequirement' }, { n:'100%', l:'data kept\nanonymous' }, { n:'0', l:'extra medical\nappointments needed' } ],
        jargon:[ { o:'informed consent', p:'your permission — given freely after we explain everything' }, { o:'anonymised data', p:'your information with your name and address removed' }, { o:'ethics approval', p:'an independent committee has reviewed and approved this study' } ],
        fmt:[ { i:'📱', h:'Channel: Social media + GP waiting room', p:'Short version (< 100 words) for online; printed leaflet for the clinic.' }, { i:'✅', h:'Include: Clear eligibility criteria', p:'"You can take part if you are aged 40–65, registered with a GP in [region], with no prior colorectal cancer diagnosis."' } ],
        prereq:[ 'That taking part means sharing existing records — not attending anything new.', 'That you can stop at any time, with no effect on your care.' ],
        qa:[ { q:'What exactly do I have to do?', a:'Give permission to use your anonymised GP records. No appointments, no tests — about 30 minutes total.' }, { q:'What if I change my mind?', a:'You can withdraw at any time, and it will never affect the care you receive.' } ]
      }
    },
    public: {
      awareness: {
        al:'General Public', ol:'Raise awareness',
        msg:[
          { l:'The headline', t:'Colorectal cancer kills over 4,000 people in Portugal every year — and most of those deaths are preventable if the cancer is found early enough.' },
          { l:'What researchers are doing', t:'A new AI tool, developed at the University of Porto, could identify people at high risk before symptoms appear, using data already collected during routine GP visits.' },
          { l:'Why it matters now', t:'The tool is ready for evaluation. What is needed is the political will and investment to test it at scale.' }
        ],
        data:[ { n:'4,000+', l:'colorectal cancer\ndeaths/year in Portugal' }, { n:'90%', l:'survival rate if\ncaught early' }, { n:'340', l:'preventable deaths\nwith this tool' } ],
        jargon:[ { o:'machine learning', p:'AI — a computer that learns from data' }, { o:'AUC / sensitivity / specificity', p:'→ omit entirely; say "tested and shown to work"' }, { o:'primary care', p:'your GP or family health centre' }, { o:'electronic health records', p:'the medical notes your doctor keeps' } ],
        fmt:[ { i:'📰', h:'Format: Press release or news article', p:'Inverted pyramid: headline → key facts → background. No more than 500 words.' }, { i:'🐦', h:'Social: Thread or short video', p:'Lead with the human story. Use the 340 number as the hook.' }, { i:'📷', h:'Visuals: Infographic with the 3 key numbers', p:'340 / 90% / +23%. Simple, shareable, memorable.' } ],
        prereq:[ 'That this cancer is common and often caught too late.', 'That the tool reuses data the health service already has.' ],
        qa:[ { q:'Is this available to me now?', a:'Not yet — be clear it is ready for testing, not yet in clinics, to avoid false expectations.' }, { q:'Is AI replacing my doctor?', a:'No. It flags who might need earlier checks; your GP stays in charge of every decision.' } ]
      },
      findings: {
        al:'General Public', ol:'Share key findings',
        msg:[
          { l:'What we found', t:'A new AI tool, trained on data from nearly 13,000 Portuguese patients, can predict who is at risk of colorectal cancer up to 10 years before diagnosis.' },
          { l:'Why it is important', t:'The tool could save 340 lives a year in Portugal — and would reduce unnecessary procedures for thousands more who are not at high risk.' },
          { l:'What happens next', t:'The research team is working with health authorities to plan a pilot programme in Portuguese primary care clinics.' }
        ],
        data:[ { n:'340', l:'lives saved\nper year' }, { n:'12,847', l:'Portuguese patients\nstudied' }, { n:'10yr', l:'predicted risk\nhorizon' } ],
        jargon:[ { o:'AUC 0.83', p:'→ omit; say "independently verified as accurate"' }, { o:'95% confidence interval', p:'→ omit' }, { o:'randomised controlled trial', p:'a rigorous type of scientific study' } ],
        fmt:[ { i:'📱', h:'Format: Short explainer (blog or social thread)', p:'Lead with the most surprising finding. Use analogies. End with a call to action.' }, { i:'🎥', h:'Consider: 60-second explainer video', p:'Script: Problem → Discovery → Implication → What you can do.' } ],
        prereq:[ 'That "10 years before diagnosis" means much earlier than today.', 'That fewer unnecessary procedures is a benefit for low-risk people too.' ],
        qa:[ { q:'How can it predict 10 years ahead?', a:'It spots subtle patterns in routine records that together signal long-term risk — like a forecast from many small signals.' }, { q:'Could it be wrong about me?', a:'It guides earlier checks, not diagnoses; a doctor confirms everything.' } ]
      },
      relevance: {
        al:'General Public', ol:'Explain personal relevance',
        msg:[
          { l:'What this means for you', t:'If you are between 40 and 65 and visit your GP regularly, this research could one day mean your doctor spots your cancer risk earlier — without any extra tests.' },
          { l:'How it works in plain terms', t:'Your routine blood tests and GP records already contain clues about cancer risk. The new tool reads those clues faster and more reliably than existing guidelines.' },
          { l:'What to do now', t:'Ask your GP about your colorectal cancer risk, especially if you have a family history. Early conversations save lives.' }
        ],
        data:[ { n:'40–65', l:'the age group who\nbenefit most' }, { n:'0', l:'extra tests needed —\njust existing records' }, { n:'1 in 20', l:'people develop\ncolorectal cancer' } ],
        jargon:[ { o:'algorithm', p:'a set of rules the computer follows' }, { o:'biomarkers', p:'measurements in your blood that give clues about your health' }, { o:'risk stratification', p:'grouping people by their level of risk' } ],
        fmt:[ { i:'🤝', h:'Tone: Empathetic, not alarming', p:'Start with hope ("this research could help you"). Avoid statistics-heavy language.' }, { i:'📲', h:'Channel: Patient-facing social media or health app', p:'Short video (< 90 seconds) works best for this audience.' } ],
        prereq:[ 'That this is about earlier checking, not a test you need to ask for today.', 'That family history is the simplest thing to raise with your GP.' ],
        qa:[ { q:'Should I be worried?', a:'Lead with reassurance: this is about earlier, better care — not a reason for alarm.' }, { q:'What can I actually do today?', a:'Have a conversation with your GP about your risk, especially if cancer runs in your family.' } ]
      }
    }
  },

  /* =========================================================
     EXAMPLE 2 — Cardiac event early-warning model
  ========================================================= */
  s2: {
    policymaker: {
      motivate: {
        al:'Policymaker', ol:'Motivate a decision',
        msg:[
          { l:'Lead with', t:'An AI early-warning system can predict in-hospital cardiac events four hours in advance — giving staff time to act and cutting false alarms by a third.' },
          { l:'Support with', t:'Validated on 2,341 coronary-care admissions, it correctly flagged 4 in 5 critical events while reducing the alarm fatigue that contributes to missed emergencies.' },
          { l:'The ask', t:'Fund a pilot in three coronary care units in 2026, with independent evaluation of patient-safety outcomes.' }
        ],
        data:[ { n:'4h', l:'advance warning\nbefore an event' }, { n:'34%', l:'fewer false alarms\n(less alarm fatigue)' }, { n:'79%', l:'of critical events\ncorrectly flagged' } ],
        jargon:[ { o:'deep learning architecture', p:'AI trained on vital-sign patterns' }, { o:'sensitivity 79% / specificity 88%', p:'catches 4 in 5 events; clears 9 in 10 low-risk patients correctly' }, { o:'coronary care unit (CCU)', p:'the hospital ward for serious heart patients' }, { o:'inference latency / GPU memory', p:'→ remove — technical detail' } ],
        fmt:[ { i:'📄', h:'Format: 1-page patient-safety brief', p:'Lead with the four-hour head start, not the architecture.' }, { i:'📧', h:'Channel: DGS hospital-care directorate', p:'Address the relevant director; offer a 15-minute call.' }, { i:'⚠️', h:'Avoid: Model internals', p:'Start with the outcome (earlier warning, fewer false alarms).' } ],
        prereq:[ 'That alarm fatigue causes real missed emergencies today.', 'That the tool warns earlier — it does not replace staff judgement.' ],
        qa:[ { q:'What will it cost?', a:'Weigh against the cost of cardiac arrests and prolonged ICU stays the earlier warning helps avoid.' }, { q:'Can we trust AI in an emergency setting?', a:'It alerts staff to look sooner; clinicians always make the call.' } ]
      },
      brief: {
        al:'Policymaker', ol:'Summarise the evidence',
        msg:[
          { l:'Framing', t:'Continuous bedside monitoring data is collected in every coronary care unit but is rarely used to give early warning of deterioration.' },
          { l:'Evidence overview', t:'A validated deep-learning early-warning model predicts cardiac events four hours ahead and reduces false-alarm fatigue among nursing staff.' },
          { l:'Conclusion', t:'The evidence supports a structured evaluation of AI-assisted early warning within NHS hospitals.' }
        ],
        data:[ { n:'4h', l:'early-warning\nwindow' }, { n:'34%', l:'less alarm\nfatigue' }, { n:'2,341', l:'admissions in\nthe validation set' } ],
        jargon:[ { o:'AUC', p:'overall accuracy' }, { o:'vital-sign telemetry', p:'continuous bedside monitoring data' }, { o:'alarm fatigue', p:'desensitisation to frequent false alarms' } ],
        fmt:[ { i:'📋', h:'Format: 2-page evidence summary', p:'Include a table comparing current monitoring with AI early warning.' }, { i:'📎', h:'Attach: Key papers as annexes', p:'Each with a one-line plain summary.' } ],
        prereq:[ 'The difference between a single study and converging evidence.', 'What alarm fatigue costs in real wards.' ],
        qa:[ { q:'Is the evidence strong enough to act?', a:'It is validated on thousands of real admissions, not a simulation.' }, { q:'What is the next step?', a:'A time-limited pilot with pre-agreed patient-safety metrics.' } ]
      },
      funding: {
        al:'Policymaker', ol:'Support a funding request',
        msg:[
          { l:'The problem', t:'In-hospital cardiac arrests are often preceded by hours of subtle deterioration that goes unnoticed until it becomes a crisis.' },
          { l:'The solution', t:'A validated AI early-warning tool gives coronary-care staff a four-hour head start to intervene.' },
          { l:'The request', t:'Request funding for a 2-year pilot across 5 coronary care units, including integration, training, and independent evaluation.' }
        ],
        data:[ { n:'4h', l:'earlier warning\nfor staff' }, { n:'34%', l:'fewer false\nalarms' }, { n:'2 yr', l:'pilot to produce\nsafety evidence' } ],
        jargon:[ { o:'cost-effectiveness', p:'value for money' }, { o:'rapid-response activation', p:'calling the emergency team' }, { o:'health technology assessment', p:'formal benefit/cost review' } ],
        fmt:[ { i:'💶', h:'Format: Structured budget proposal', p:'Cost of the tool vs. cost of an in-hospital cardiac arrest.' }, { i:'📊', h:'Attach: Economic modelling summary', p:'Even a simple cost-benefit table strengthens the case.' } ],
        prereq:[ 'The scale of avoidable in-hospital deterioration.', 'That earlier response saves both cost and lives.' ],
        qa:[ { q:'What is the return?', a:'Each prevented arrest avoids ICU time and its costs — the pilot quantifies this.' }, { q:'If the pilot fails?', a:'It is time-boxed with clear stop criteria.' } ]
      }
    },
    clinical: {
      'present-tool': {
        al:'Clinical Team', ol:'Introduce a new tool',
        msg:[
          { l:'Lead with clinical impact', t:'This AI tool alerts your team 4 hours before an adverse cardiac event — with 34% fewer false alarms than current monitoring.' },
          { l:'Support with evidence', t:'Validated across 2,341 CCU admissions at a Portuguese hospital centre. Correctly predicted 4 in 5 critical events; cleared 9 in 10 low-risk patients accurately.' },
          { l:'The ask', t:'Trial the tool alongside existing monitoring for 3 months. No change to protocols required during the evaluation period.' }
        ],
        data:[ { n:'4h', l:'advance warning\nbefore cardiac event' }, { n:'34%', l:'reduction in\nfalse alarm fatigue' }, { n:'79%', l:'of critical events\ncorrectly predicted' } ],
        jargon:[ { o:'deep learning architecture', p:'AI system trained on vital sign patterns' }, { o:'sensitivity 79% / specificity 88%', p:'detects 4 in 5 events; clears 9 in 10 low-risk patients correctly' }, { o:'LSTM neural network', p:'pattern-recognition algorithm' }, { o:'inference latency 200ms', p:'result appears instantly' }, { o:'2 GB GPU memory', p:'→ remove — not relevant to clinicians' } ],
        fmt:[ { i:'🖥', h:'Replace: ROC curve and training graphs', p:'Use a "before vs. after alarms" comparison chart instead.' }, { i:'📋', h:'Add: Prerequisite slide at the start', p:'"What you need to know first" — 4 concepts in plain language.' }, { i:'⏱', h:'Format: 20-minute presentation', p:'10 min clinical story + 5 min evidence + 5 min Q&A. Demo the interface live if possible.' }, { i:'💬', h:'Prepare: Objection — "What if it is wrong?"', p:'Answer: focus on the 34% alarm reduction, not the 79% prediction rate.' } ],
        prereq:[ 'What the tool watches: 6 hours of routine vital-sign trends, automatically.', 'That an "alert" is a prompt to look, not a diagnosis.', 'That it runs in parallel with current monitoring during the trial — nothing is switched off.' ],
        qa:[ { q:'What happens when the model is wrong?', a:'A missed low-risk case still gets standard monitoring. The headline benefit is 34% fewer false alarms, which reduces alert fatigue and missed real events.' }, { q:'Will this add to our workload?', a:'No new charting. The alert surfaces in the existing bedside monitor; you review it as you would any other.' }, { q:'How was it validated?', a:'On 2,341 real CCU admissions in a Portuguese centre — not a simulation.' } ]
      },
      findings: {
        al:'Clinical Team', ol:'Share new findings',
        msg:[
          { l:'Clinical headline', t:'Patients with elevated troponin AND irregularity in 6-hour vital sign patterns face a 3× higher risk of an adverse cardiac event within 24 hours.' },
          { l:'What this means for practice', t:'This pattern can be detected automatically, 4 hours before the event, providing a window for preventive intervention.' },
          { l:'Next step', t:'We are seeking clinical feedback on the alert threshold before a broader rollout.' }
        ],
        data:[ { n:'3×', l:'higher event risk\nwhen pattern detected' }, { n:'4h', l:'window for\nprevention' }, { n:'2,341', l:'admissions\nin validation set' } ],
        jargon:[ { o:'hazard ratio 3.1 (95% CI 2.4–4.0)', p:'3× higher risk — statistically robust' }, { o:'Kaplan-Meier curves', p:'→ replace with a clinical event timeline' }, { o:'p < 0.001', p:'→ remove from slides; mention verbally if asked' } ],
        fmt:[ { i:'📊', h:'Replace forest plots with a clinical impact table', p:'Patient group | event rate without tool | event rate with tool | difference.' }, { i:'🎯', h:'End with: "What we need from you"', p:'Acceptable false-positive rates and alert-fatigue thresholds.' } ],
        prereq:[ 'Which two signals combine to raise risk (troponin + vital-sign irregularity).', 'That the 4-hour window is what makes prevention possible.' ],
        qa:[ { q:'Does this change what I do today?', a:'Not yet — we are gathering clinical input on the alert threshold before any rollout.' }, { q:'How confident are you in the 3× figure?', a:'It is statistically robust and was found in 2,341 admissions.' } ]
      },
      protocol: {
        al:'Clinical Team', ol:'Propose a protocol change',
        msg:[
          { l:'Current practice gap', t:'Current triage protocols do not use continuous vital-sign pattern data for risk stratification in CCU admissions.' },
          { l:'Proposed change', t:'Add an AI-based pattern check at hour 2 of admission to identify high-risk patients earlier, enabling more targeted monitoring.' },
          { l:'Evidence basis', t:'Validated in 2,341 admissions with 79% sensitivity and a 34% reduction in alarm fatigue. Independent external validation is ongoing.' }
        ],
        data:[ { n:'79%', l:'sensitivity in\nvalidation set' }, { n:'2 min', l:'time added per\npatient assessment' }, { n:'3 mo', l:'proposed pilot\nduration' } ],
        jargon:[ { o:'AUC 0.87', p:'high discriminative accuracy' }, { o:'NNT (number needed to treat)', p:'→ replace with "for every 5 patients flagged, 4 benefit from early intervention"' } ],
        fmt:[ { i:'📋', h:'Format: 1-page protocol amendment proposal', p:'Current practice → proposed change → evidence → evaluation metrics.' }, { i:'✅', h:'Include: Implementation checklist', p:'Training needed, changes to the monitor, who approves.' } ],
        prereq:[ 'Exactly where in the pathway the new check sits (hour 2).', 'That it adds about 2 minutes per patient, not a new workflow.' ],
        qa:[ { q:'Who signs off a protocol change?', a:'The proposal is a 1-page amendment with an approval line and an evaluation plan built in.' }, { q:'What is the burden on staff?', a:'~2 minutes per patient and a short training session.' } ]
      }
    },
    funder: {
      impact: {
        al:'Funders & Stakeholders', ol:'Justify impact & value',
        msg:[
          { l:'Headline impact', t:'Your investment produced a validated AI early-warning tool that buys coronary-care clinicians a four-hour head start on cardiac events.' },
          { l:'Evidence of value', t:'Tested on 2,341 admissions, it catches 4 in 5 critical events and cuts false alarms by 34% — safer care and less wasted staff attention.' },
          { l:'What this enables', t:'The tool is ready to move from research to a real-world coronary-care pilot, turning the investment into demonstrable safety impact.' }
        ],
        data:[ { n:'4h', l:'head start before\na cardiac event' }, { n:'34%', l:'fewer false\nalarms' }, { n:'2,341', l:'admissions\nvalidated on' } ],
        jargon:[ { o:'AUC', p:'independently verified accuracy' }, { o:'deep learning', p:'AI trained on vital-sign patterns' }, { o:'inference latency / GPU', p:'→ remove from the summary' } ],
        fmt:[ { i:'📈', h:'Format: 1-page impact summary', p:'Lead with the four-hour head start, then value-for-money, then what comes next.' }, { i:'📊', h:'Include: A cost-vs-benefit visual', p:'Cost of an in-hospital arrest avoided vs. tool cost.' }, { i:'🏁', h:'Close with: The readiness milestone', p:'State plainly that the work is now pilot-ready.' } ],
        prereq:[ 'That validation used real patient monitoring data.', 'That "impact" is both lives and staff time saved.' ],
        qa:[ { q:'Was the money well spent?', a:'A validated, pilot-ready tool with a clear patient-safety case.' }, { q:'Risk from here?', a:'Science de-risked; remaining risk is implementation, which the pilot manages.' } ]
      },
      progress: {
        al:'Funders & Stakeholders', ol:'Report progress',
        msg:[
          { l:'Where we are', t:'All phase-1 milestones are complete: the model is built, validated on 2,341 admissions, and accepted for publication.' },
          { l:'Against the plan', t:'Delivery is on schedule and the sensitivity achieved exceeded the target set at the start of the grant.' },
          { l:'Next milestone', t:'The next phase is a clinical pilot in a coronary care unit.' }
        ],
        data:[ { n:'100%', l:'phase-1 milestones\ncompleted' }, { n:'79%', l:'sensitivity vs.\n75% target' }, { n:'2026', l:'pilot start\nplanned' } ],
        jargon:[ { o:'external validation', p:'independent confirmation it works' }, { o:'deployment-ready', p:'ready for a real coronary care unit' } ],
        fmt:[ { i:'✅', h:'Format: Milestone status table', p:'Planned → status → evidence at a glance.' }, { i:'📅', h:'Include: Updated timeline', p:'What is done, what is next, any date changes.' } ],
        prereq:[ 'Which milestones were promised this phase.', 'That beating the sensitivity target is the go signal for the pilot.' ],
        qa:[ { q:'Are you on track?', a:'Yes — 100% of milestones met and the target exceeded.' }, { q:'Risks ahead?', a:'Securing coronary-care pilot sites is the main dependency.' } ]
      },
      continue: {
        al:'Funders & Stakeholders', ol:'Secure continued funding',
        msg:[
          { l:'What you have already enabled', t:'Phase 1 delivered a validated cardiac early-warning tool; the hard scientific risk is now behind us.' },
          { l:'What the next investment buys', t:'Phase 2 turns the validated model into a real-world coronary-care pilot, producing the safety and economic evidence needed for adoption.' },
          { l:'The ask', t:'Continue funding for a 2-year pilot across 5 coronary care units, with independent evaluation.' }
        ],
        data:[ { n:'4h', l:'warning the\ntool delivers' }, { n:'2 yr', l:'pilot to adoption\nevidence' }, { n:'5', l:'coronary care units\nnext phase' } ],
        jargon:[ { o:'translational pilot', p:'putting research into real clinical use' }, { o:'scalability', p:'whether it works hospital-wide, not just one ward' } ],
        fmt:[ { i:'💶', h:'Format: Phase-2 proposal (2 pages)', p:'Recap impact → what is de-risked → what the next money delivers → ask.' }, { i:'📊', h:'Include: Milestone-and-budget table', p:'Tie each deliverable to a cost and a date.' } ],
        prereq:[ 'That phase 1 retired the science risk.', 'That phase 2 is evidence-for-adoption, not basic research.' ],
        qa:[ { q:'Why fund more?', a:'The value is realised only once piloted in real coronary care units.' }, { q:'What do we get?', a:'A pilot with independent evaluation — adoption-grade safety evidence.' } ]
      }
    },
    patient: {
      explain: {
        al:'Patient Group', ol:'Explain your research',
        msg:[
          { l:'What we are studying', t:'We are developing a computer tool that watches the routine bedside monitors in heart-care units and warns nurses early if a patient may be heading for a serious heart problem.' },
          { l:'Why it matters', t:'Warning signs can appear hours before an emergency. Earlier warning means the care team can step in sooner.' },
          { l:'What we are asking', t:'We are checking that the tool works fairly for all kinds of patients.' }
        ],
        data:[ { n:'4h', l:'earlier warning\nfor staff' }, { n:'0', l:'extra tests —\nuses existing monitors' }, { n:'2,341', l:'admissions\nstudied' } ],
        jargon:[ { o:'deep learning', p:'a computer that learns patterns' }, { o:'vital signs', p:'heart rate, blood pressure and similar measurements' }, { o:'sensitivity', p:'how often it correctly spots a problem' } ],
        fmt:[ { i:'📄', h:'Format: 1-page information sheet', p:'Reading age 12, with a short FAQ box.' }, { i:'🖼', h:'Add: A simple diagram', p:'Monitor → tool → nurse alert → earlier care.' } ],
        prereq:[ 'That it supports nurses — it does not replace them.', 'That an alert means "check", not "emergency".' ],
        qa:[ { q:'Does an alert mean I am in danger?', a:'No — it is a prompt for staff to check on you sooner.' }, { q:'Is my data safe?', a:'It is used anonymously and only with permission.' } ]
      },
      results: {
        al:'Patient Group', ol:'Share study results',
        msg:[
          { l:'What we found', t:'The tool can warn staff about heart problems up to four hours earlier than usual monitoring.' },
          { l:'What this means for you', t:'In future, your care team could step in sooner, before a problem becomes serious.' },
          { l:'What happens next', t:'We are working with hospitals to test it in real wards.' }
        ],
        data:[ { n:'4h', l:'earlier warning\nfor your care team' }, { n:'34%', l:'fewer false alarms\n(calmer wards)' }, { n:'2026', l:'target year for\na hospital pilot' } ],
        jargon:[ { o:'false alarms', p:'unnecessary alerts' }, { o:'specificity', p:'→ omit; say "avoids worrying staff about low-risk patients"' }, { o:'deep learning', p:'a computer that learns patterns' } ],
        fmt:[ { i:'💬', h:'Format: Short letter or video message', p:'Begin with thanks; end with what you are doing next.' }, { i:'📞', h:'Offer: A Q&A session or helpline', p:'For relatives who want to understand what it means.' } ],
        prereq:[ 'That these are early results still being tested.', 'That nothing changes in your care right now.' ],
        qa:[ { q:'Will this be in my hospital?', a:'Not yet — it is being evaluated, with a pilot targeted for 2026.' }, { q:'Why do fewer false alarms matter?', a:'They help staff focus on the patients who truly need attention.' } ]
      },
      recruit: {
        al:'Patient Group', ol:'Recruit participants',
        msg:[
          { l:'Why we need your help', t:'To make sure the tool works for everyone, we need to test it on many different patients\' monitoring data.' },
          { l:'What being in the study involves', t:'Using your anonymised bedside-monitoring records. No extra tests, no change to your care.' },
          { l:'Your rights', t:'Participation is entirely voluntary; you can withdraw at any time without affecting your care.' }
        ],
        data:[ { n:'0', l:'extra tests\nor appointments' }, { n:'100%', l:'data kept\nanonymous' }, { n:'anytime', l:'you can\nwithdraw' } ],
        jargon:[ { o:'informed consent', p:'your freely-given permission' }, { o:'anonymised', p:'your name and details removed' }, { o:'ethics approval', p:'independently reviewed and approved' } ],
        fmt:[ { i:'📱', h:'Channel: Consent-friendly leaflet + ward poster', p:'Short and plain; a printed version for the ward.' }, { i:'✅', h:'Include: Clear eligibility', p:'Who can take part, in one line.' } ],
        prereq:[ 'That taking part means sharing existing monitoring data — nothing new.', 'That you can stop at any time.' ],
        qa:[ { q:'What do I have to do?', a:'Give permission to use your anonymised monitoring data — nothing more.' }, { q:'What if I change my mind?', a:'You can withdraw anytime, with no effect on your care.' } ]
      }
    },
    public: {
      awareness: {
        al:'General Public', ol:'Raise awareness',
        msg:[
          { l:'The headline', t:'Hundreds of in-hospital cardiac emergencies could be caught earlier — an AI early-warning system gives staff a four-hour head start.' },
          { l:'What researchers are doing', t:'A University of Porto tool reads routine bedside monitors to spot deterioration before it becomes a crisis.' },
          { l:'Why it matters now', t:'It is ready for evaluation; it needs investment to be tested at scale.' }
        ],
        data:[ { n:'4h', l:'head start for\nhospital staff' }, { n:'34%', l:'fewer false\nalarms' }, { n:'2,341', l:'admissions\ntested' } ],
        jargon:[ { o:'AI / deep learning', p:'a computer that learns from data' }, { o:'vital signs', p:'routine bedside measurements' }, { o:'sensitivity / specificity', p:'→ omit; say "tested and shown to work"' } ],
        fmt:[ { i:'📰', h:'Format: Press release', p:'Inverted pyramid, under 500 words.' }, { i:'🐦', h:'Social: Thread or video', p:'Lead with the human story; use the four-hour head start as the hook.' }, { i:'📷', h:'Visuals: Infographic of the 3 numbers', p:'4h / 34% / 2,341. Simple and shareable.' } ],
        prereq:[ 'That warning signs often appear hours early.', 'That the tool supports staff, not replaces them.' ],
        qa:[ { q:'Is it available now?', a:'Ready for testing, not yet in routine use.' }, { q:'Is AI replacing nurses?', a:'No — it alerts them to look sooner.' } ]
      },
      findings: {
        al:'General Public', ol:'Share key findings',
        msg:[
          { l:'What we found', t:'An AI tool trained on thousands of heart-unit admissions can predict cardiac emergencies four hours in advance.' },
          { l:'Why it is important', t:'Earlier warning means earlier treatment — and a third fewer false alarms that wear staff down.' },
          { l:'What happens next', t:'The team is planning hospital pilots.' }
        ],
        data:[ { n:'4h', l:'advance\nwarning' }, { n:'34%', l:'fewer false\nalarms' }, { n:'2,341', l:'admissions\nstudied' } ],
        jargon:[ { o:'deep learning', p:'advanced AI' }, { o:'vital-sign monitoring', p:'routine bedside measurements' }, { o:'confidence interval', p:'→ omit' } ],
        fmt:[ { i:'📱', h:'Format: Short explainer (blog or thread)', p:'Lead with the four-hour head start. Use analogies.' }, { i:'🎥', h:'Consider: 60-second video', p:'Problem → discovery → implication.' } ],
        prereq:[ 'That "four hours early" is a big head start in an emergency.', 'That fewer false alarms helps everyone on the ward.' ],
        qa:[ { q:'How can it predict ahead?', a:'It spots subtle patterns that build over hours.' }, { q:'Could it be wrong?', a:'Staff confirm everything; it is an early prompt, not a decision.' } ]
      },
      relevance: {
        al:'General Public', ol:'Explain personal relevance',
        msg:[
          { l:'What this means for you', t:'If you or a relative are ever in a heart-care unit, this kind of tool could mean problems are spotted hours sooner.' },
          { l:'How it works in plain terms', t:'The monitors already track heart rate and blood pressure; the tool reads those trends and warns staff earlier.' },
          { l:'What to do now', t:'Nothing to do today — but this is the kind of research that makes hospital care safer.' }
        ],
        data:[ { n:'4h', l:'earlier warning\nfor your care team' }, { n:'0', l:'extra tests —\nuses existing monitors' }, { n:'24/7', l:'continuous\nbackground watch' } ],
        jargon:[ { o:'algorithm', p:'rules the computer follows' }, { o:'vital signs', p:'routine measurements like heart rate' }, { o:'risk prediction', p:'spotting who needs attention sooner' } ],
        fmt:[ { i:'🤝', h:'Tone: Reassuring, not alarming', p:'This is about safer care, not a reason to worry.' }, { i:'📲', h:'Channel: Patient-facing social media', p:'Short video (< 90 seconds).' } ],
        prereq:[ 'That this is about earlier, safer care — not a test to ask for.', 'That it supports the staff already caring for you.' ],
        qa:[ { q:'Should I worry?', a:'No — it is about making hospital care safer.' }, { q:'What can I do?', a:'Nothing needed; it is reassurance that care is improving.' } ]
      }
    }
  }
};
