"""Build the Ibrahim Malik session prep doc."""
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

NAVY = RGBColor(0x0B, 0x1F, 0x3A)
GOLD = RGBColor(0xC9, 0xA9, 0x61)
GRAY = RGBColor(0x55, 0x55, 0x55)
RED = RGBColor(0xB0, 0x00, 0x00)
BLACK = RGBColor(0x00, 0x00, 0x00)

doc = Document()

# Page margins
section = doc.sections[0]
section.left_margin = Inches(0.8)
section.right_margin = Inches(0.8)
section.top_margin = Inches(0.7)
section.bottom_margin = Inches(0.7)

# ---------- helpers ----------
def add_title(text, size=24, color=NAVY):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.name = "Georgia"
    return p

def add_h2(text, size=15, color=NAVY):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.name = "Georgia"
    return p

def add_h3(text, size=12, color=NAVY):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(size)
    run.font.color.rgb = color
    return p

def add_para(text, size=11, color=BLACK, italic=False, bold=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.italic = italic
    run.bold = bold
    return p

def add_bullet(text, size=11, color=BLACK):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.color.rgb = color

def add_quote(text, size=11, color=GRAY):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.3)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.italic = True

def add_blank_lines(n=3):
    for _ in range(n):
        doc.add_paragraph()

def add_hr():
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(8)
    run = p.add_run("─" * 60)
    run.font.color.rgb = GOLD
    run.font.size = Pt(9)

# ===== HEADER =====
add_title("Mizan × Ibrahim Malik — Session Prep")
add_para("Thursday June 4, 2026 · 5:30–6:00pm Hong Kong time", size=12, color=GRAY, italic=True)
add_para("Channel: Zoom (link sent Wednesday night HK)", size=11, color=GRAY)
add_para("Recording: ON (local recording to Gordon's laptop)", size=11, color=GRAY)
add_para("First inbound from CUHK MSA route. First real-user feedback session.", size=10, color=GOLD, italic=True)

add_hr()

# ===== PART 1: MIZAN REFRESHER =====
add_h2("PART 1 — Mizan refresher  (read 10 min before the call)")
add_para(
    "You must be fluent in Mizan's six profiles, key thresholds, and navigation. "
    "If Ibrahim asks something and you fumble, the trust collapses. Spend the 10 "
    "minutes before the call walking through this.",
    italic=True, color=GRAY,
)

add_h3("Mizan in ONE sentence")
add_quote(
    "A multi-scholar halal stock screener — six scholar profiles, every threshold "
    "cited to a primary source, every verdict reconstructable from the published rules."
)

add_h3("The 6 scholar profiles (memorize the differentiators)")

add_para("AAOIFI Standard (DEFAULT)", bold=True)
add_bullet("Gulf standard, used by most Islamic banks.")
add_bullet("Debt ≤ 30% of market cap. Cash+securities ≤ 30%. Non-permissible income ≤ 5%.")
add_bullet("Purification: dividends only.")
add_bullet("Source: AAOIFI Shariah Standard No. 21.")

add_para("Mufti Taqi Usmani (stricter Hanafi)", bold=True)
add_bullet("Same as AAOIFI PLUS: illiquid assets must be ≥ 20% of total assets.")
add_bullet("Purification: dividends AND capital gains.")
add_bullet("THIS IS MIZAN'S BIGGEST DIFFERENTIATOR. No other halal app implements his illiquid-asset rule.")
add_bullet("Source: Mufti Taqi's published equity-screening rulings.")

add_para("Dow Jones Islamic Market (DJIM)", bold=True)
add_bullet("Most permissive of the major indices.")
add_bullet("Debt ≤ 33%. Cash+securities ≤ 33%. Receivables ≤ 33%. Non-permissible income ≤ 5%.")
add_bullet("Purification: dividends only.")
add_bullet("Source: S&P Dow Jones Islamic Market Indices Methodology.")

add_para("Ja'fari (Shia, Sistani-aligned)", bold=True)
add_bullet("Shia methodology, follows Ayatollah Sistani's rulings.")
add_bullet("Debt ≤ 33%. Cash+securities ≤ 33%. Non-permissible income ≤ 5%.")
add_bullet("Purification: khums (20%) on net annual surplus — treated as capital-gains purification.")
add_bullet("Source: Sistani office's Code of Practice.")

add_para("Strict / Zero-tolerance", bold=True)
add_bullet("Minority view: any riba exposure is impermissible.")
add_bullet("0% non-permissible income. 0% interest-bearing debt. 0% cash holdings.")
add_bullet("Almost no public equities pass this.")
add_bullet("Mizan ships it as a first-class profile because the audience exists and deserves a tool.")

add_para("Custom (user sets own thresholds)", bold=True)
add_bullet("Defaults match AAOIFI; user adjusts numbers via /custom.")
add_bullet("For users whose scholar isn't listed or who want to set their own.")

add_h3("The 4 operating principles (memorize)")
add_bullet("Scholars hold religious authority. Mizan does not.")
add_bullet("Show the math — every verdict reconstructable from published thresholds.")
add_bullet("Credibility through citation — every threshold traces to a primary source.")
add_bullet("The strict view is a first-class profile, not an afterthought.")

add_h3("The headline differentiator vs. competitors")
add_para(
    "Zoya, Wahed, and Musaffa all default users to AAOIFI and don't implement "
    "Mufti Taqi Usmani's illiquid-asset rule. Mizan is the only one that does. "
    "If Ibrahim follows Hanafi tradition (which most South Asian / Turkish Muslims do, "
    "though don't assume), Mufti Taqi's rule is the one that's been ignored for a decade.",
    color=GRAY,
)

add_h3("Site navigation cheatsheet (in case he asks 'where do I find X')")
add_bullet("/ — home, big ticker chips with verdict previews")
add_bullet("/screen — type ANY ticker, see full verdict + math + multi-scholar table")
add_bullet("/discover — trending stocks & where scholars disagree")
add_bullet("/methodology — every threshold cited to its primary source")
add_bullet("/about — origin story + Miqdad as Founding Advisor")
add_bullet("/trust — honest scoreboard of what's working, what's not")
add_bullet("/custom — set your own thresholds")
add_bullet("/watchlist + /portfolio — save tickers, see portfolio compliance %")
add_bullet("/zakat — annual zakat calculator")
add_bullet("/purification — dividend cleansing tool")
add_bullet("/ask — 49 common Q&A")

add_hr()

# ===== PART 2: SESSION FLOW =====
add_h2("PART 2 — Session flow  (minute-by-minute)")

add_h3("0:00–2:00 — Opening")
add_bullet("Thank him for the time.")
add_bullet("Brief frame: \"30 min. I'll watch you use the site, you tell me what's broken. I won't fix things in real time — I want to see your actual experience.\"")
add_bullet("Ask: \"Did you bring a stock you actually own or are considering?\" If yes, great. If no: offer AAPL, TSLA, AMZN, NVDA, JPM as test cases.")
add_bullet("Make sure he's screen-sharing, not you.")

add_h3("2:00–18:00 — Watch him use it  (THE CORE 16 MIN — stay quiet)")
add_bullet("Let him drive. Don't narrate.")
add_bullet("Don't explain features when he's confused — write it down.")
add_bullet("Don't fix typos / bugs / weird UI in real time — write it down.")
add_bullet("Watch where his eye goes first on each page.")
add_bullet("Watch what he clicks, what he hovers over, what he scrolls past.")
add_bullet("Write his EXACT WORDS verbatim when he speaks.")

add_h3("18:00–26:00 — Targeted questions  (see Part 3)")
add_bullet("Ask the diagnostic questions in Part 3.")
add_bullet("Don't lead him. Open questions only.")

add_h3("26:00–30:00 — Closing")
add_bullet("Ask the closing questions in Part 3 (publicity permission, intros).")
add_bullet("Thank him. Promise: \"I'll send you whatever I ship from your feedback.\"")
add_bullet("Stop the recording. Save the file with name 'ibrahim_malik_session_2026-06-04.mp4'.")

add_hr()

# ===== PART 3: QUESTIONS TO ASK =====
add_h2("PART 3 — Questions to ask Ibrahim")

add_h3("Observational (during the 16-min use period — sparingly)")
add_para("Use these ONLY when he pauses. Don't interrupt his flow.")
add_bullet("\"Walk me through what you're doing — narrate it.\"")
add_bullet("\"Where did your eye go first?\"")
add_bullet("\"What did you expect that didn't happen?\"")
add_bullet("\"Talk me through what you're reading right now.\"")

add_h3("Diagnostic (after he's used it ~15 min)")
add_bullet("\"If you described Mizan to one of your friends in ONE sentence, what would you say? Don't polish it.\"")
add_bullet("\"What's the ONE thing you'd change first?\"")
add_bullet("\"Did the verdict on the stock you screened match what you expected? Why or why not?\"")
add_bullet("\"If your scholar / imam disagreed with what Mizan said, would you change Mizan's verdict, or would you change scholars?\"")
add_bullet("\"What did you think when you saw the welcome banner about AAOIFI?\"  (this tests the new UX from Miqdad's feedback)")
add_bullet("\"Anything confusing about which scholar to pick?\"")

add_h3("Closing")
add_bullet("\"Who else do you know who'd actually use this and tell me what's wrong? Can you intro me?\"")
add_bullet("\"OK if I quote anything you said publicly? Named or anonymous?\"")
add_bullet("\"What would make you come back and use this every time you screen a stock?\"")

add_hr()

# ===== PART 4: QUESTIONS HE MIGHT ASK =====
add_h2("PART 4 — Questions Ibrahim might ask  (and your honest answers)")

add_h3("Q: How do you make money?")
add_para(
    "\"Not making money yet — it's free. Long-term plan: a small subscription "
    "for portfolio tracking and advanced features (~$5-10/mo equivalent). "
    "Methodology stays free forever. No ads, no affiliate links.\"",
    italic=True,
)

add_h3("Q: Where's the financial data from?")
add_para(
    "\"Financial Modeling Prep (FMP) — institutional-grade equity data provider. "
    "Updated quarterly. I'm transparent about the data source on /methodology.\"",
    italic=True,
)

add_h3("Q: Who validates the methodology? Are you a scholar?")
add_para(
    "\"Not a scholar. I'm a CUHK med student. Miqdad is Founding Advisor — a "
    "Muslim, gut-checks methodology. Credibility right now comes from the "
    "citation chain — every threshold traces to AAOIFI Standard 21 or Mufti "
    "Taqi's published works or DJIM's PDF or Sistani's Code of Practice. "
    "Eventually we'll have a formal Shariah Supervisory Board. Until then, the "
    "honesty is the credibility. We don't claim authority we don't have.\"",
    italic=True,
)

add_h3("Q: Why aren't you Muslim? Why should I trust this?")
add_para(
    "\"Fair question. Honest answer: I'm not the source of authority — the cited "
    "scholars are. I defer to them on every religious call. The fact that I have "
    "no religious stake is actually why I can represent all six profiles fairly "
    "without favoring one. I show the math, cite every source, and never tell "
    "anyone what to follow.\"",
    italic=True,
)

add_h3("Q: How is this different from Zoya / Musaffa / Wahed?")
add_para(
    "\"Three things. First, multi-scholar — those default to AAOIFI, we show "
    "all six side-by-side. Second, Mufti Taqi's illiquid-asset rule — we're the "
    "only one that implements it; the others don't even check it. Third, every "
    "threshold cited — they give black-box scores, we show the math behind every "
    "verdict.\"",
    italic=True,
)

add_h3("Q: Does it have [specific stock he owns]?")
add_para(
    "\"Prototype dataset is 163 representative tickers right now. Production "
    "version supports any listed equity — I'm adding more weekly. If yours isn't "
    "there, tell me and I'll add it in the next batch.\"",
    italic=True,
)

add_h3("Q: Can I save my watchlist / track my portfolio?")
add_para(
    "\"Yes — /watchlist for saved tickers, /portfolio to see your overall "
    "compliance %. Both work without an account (stored in your browser).\"",
    italic=True,
)

add_h3("Q: What about crypto? Sukuk?")
add_para(
    "\"Yes — /crypto for multi-scholar views on Bitcoin, ETH, etc.; /sukuk for "
    "Islamic bonds. Both are in earlier development than the stock screener.\"",
    italic=True,
)

add_h3("Q: Can I use this to actually invest?")
add_para(
    "\"Mizan provides INFORMATION, not investment advice. The verdicts are "
    "scholarly compliance opinions, not buy/sell recommendations. You'd still "
    "execute through a regular brokerage — Mizan tells you which stocks pass "
    "your scholar's bar, you decide what to do with that.\"",
    italic=True,
)

add_h3("Q: Why CUHK med student building this — what's your background in finance?")
add_para(
    "\"None formally. Software builder, careful researcher, can read a balance "
    "sheet. The actual halal screening logic is just disciplined arithmetic on "
    "published thresholds. I'm not generating new rulings; I'm faithfully "
    "implementing existing ones with full citation.\"",
    italic=True,
)

add_hr()

# ===== PART 5: CRITICAL RULES =====
add_h2("PART 5 — Critical session rules")

add_h3("DO")
add_bullet("Stay quiet during the use period. Silence is data.")
add_bullet("Write his EXACT words verbatim. Not summaries. Verbatim.")
add_bullet("Let Zoom record locally so you can re-watch.")
add_bullet("Acknowledge feedback with 'Interesting' or 'Tell me more' — neutral, not defensive.")
add_bullet("Be honest if you don't know something. 'I don't know — let me find out and email you.'")

add_h3("DON'T")
add_para("Highlight these in red because they matter most.", color=GRAY, italic=True)
add_bullet("DON'T fix bugs in real time. Write them down.")
add_bullet("DON'T explain features when he's confused. Watch the confusion.")
add_bullet("DON'T promise features. Say 'Interesting, I'll think about it.' — never 'yes I'll add that.'")
add_bullet("DON'T defend the product when criticized. Just listen and write.")
add_bullet("DON'T lead him with questions. 'Did you find this confusing?' is leading. 'What do you think?' is not.")
add_bullet("DON'T pitch Mizan to him during the session. He's already there.")

add_hr()

# ===== PART 6: NOTEPAD =====
add_h2("PART 6 — Notepad  (write live during the call)")
add_para("Prompts to fill in. Use bullet points. Verbatim quotes in quotation marks.", italic=True, color=GRAY)

add_h3("What stock did he screen first?")
add_blank_lines(2)

add_h3("First confused moment (timestamp + what)")
add_blank_lines(2)

add_h3("Quote 1 — verbatim")
add_blank_lines(2)

add_h3("Quote 2 — verbatim")
add_blank_lines(2)

add_h3("Quote 3 — verbatim")
add_blank_lines(2)

add_h3("His one-sentence description of Mizan")
add_blank_lines(2)

add_h3("The ONE thing he'd change first")
add_blank_lines(2)

add_h3("Did the verdict match his expectation? Why?")
add_blank_lines(2)

add_h3("Anything he said about Miqdad / the Founding Advisor framing")
add_blank_lines(2)

add_h3("Bugs / UX issues found (don't fix mid-call)")
add_blank_lines(2)

add_h3("Names of people he'd intro me to")
add_blank_lines(2)

add_h3("Quote attribution permission")
add_para("Named / Anonymous / No / Ask first → circle one", color=GRAY, italic=True)
add_blank_lines(2)

add_hr()

# ===== PART 7: POST-CALL CHECKLIST =====
add_h2("PART 7 — Post-call checklist  (do within 60 min of hanging up)")

add_bullet("Save Zoom recording with filename 'ibrahim_malik_2026-06-04.mp4'")
add_bullet("Type up 3-5 verbatim quotes into Quotable Feedback sheet of the tracker")
add_bullet("Type session summary into Outreach Log → Ibrahim row → column N (Notes): 'Session done. Top 3 things: [list].'")
add_bullet("List bugs / UX issues found into a new section of OUTREACH.md or a tickets.md")
add_bullet("Send Ibrahim a 2-line follow-up email: 'Thanks again. Top 3 things I'm working on from your feedback: [...]. Will keep you posted.'")
add_bullet("If he gave intro names — send YOU a draft warm-intro DM for each, ready to send Friday")
add_bullet("Update Day 7 row in Daily Counts: +1 quotable, +1 community engagement, notes")
add_bullet("Ping me (Claude) with the 3-5 verbatim quotes. We'll start drafting your first public LinkedIn post.")

add_hr()

# ===== FOOTER =====
add_para("Document generated for Gordon Louie · Mizan founder · Hong Kong / CUHK med school",
         size=9, color=GRAY, italic=True)
add_para("Session = the single highest-leverage 30 minutes in the first 30 days of Mizan. Don't wing it.",
         size=9, color=GOLD, italic=True)

# ===== SAVE =====
output = "/sessions/busy-sleepy-faraday/mnt/mizan/Ibrahim_Session_Prep.docx"
doc.save(output)
print(f"Saved: {output}")
