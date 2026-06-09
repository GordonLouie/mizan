"""Update Mizan Outreach Tracker with everything from today's session."""
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import datetime

NAVY = "0B1F3A"
GOLD = "C9A961"
CREAM = "F4ECD8"

font_body = Font(name="Arial", size=11, color="000000")
font_inbound = Font(name="Arial", size=11, color="000000", bold=True)
fill_cream = PatternFill("solid", start_color=CREAM)
fill_gold_light = PatternFill("solid", start_color="FFF4D6")

thin = Side(border_style="thin", color="E5E5E5")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
left = Alignment(horizontal="left", vertical="center", wrap_text=True)

PATH = "/sessions/busy-sleepy-faraday/mnt/mizan/Mizan_Outreach_Tracker.xlsx"
wb = load_workbook(PATH)

# ----- Outreach Log: add missing LinkedIn rows + Miqdad + Ibrahim -----
ws = wb["Outreach Log"]

# Header columns reference (row 4):
# A=Date, B=Name, C=Channel, D=Template, E=Personal context,
# F=Accepted?, G=Replied?, H=Reply date, I=Quotable line,
# J=Outcome, K=Screened?, L=Shared?, M=Next action, N=Notes

new_rows = [
    # Day 1: complete the LinkedIn batch (Mohsin, Joe, Rakaan, Musaffa)
    ["2026-05-29", "Mohsin Patel", "LinkedIn connect", "Custom-3",
     "IFG co-founder", "—", "—", "", "", "Pending",
     "—", "—", "Wait 48h then engage post", "Tier 1 named target"],
    ["2026-05-29", "Joe Bradford", "LinkedIn connect", "Custom-4",
     "US Islamic scholar, finance ethics", "—", "—", "", "", "Pending",
     "—", "—", "Wait 48h then engage post", "Tier 1 named target"],
    ["2026-05-29", "Rakaan Kayali", "LinkedIn connect", "Custom-5",
     "Practical Islamic Finance YouTube", "—", "—", "", "", "Pending",
     "—", "—", "Wait 48h then engage post", "Tier 1 named target"],
    ["2026-05-29", "Musaffa team member", "LinkedIn connect", "No note",
     "Broader: competitor team", "—", "—", "", "", "Pending",
     "—", "—", "Network presence only", "Tier 2 broader"],
    # Day 1-2: Miqdad recruited as Founding Advisor
    ["2026-05-30", "Miqdad", "Direct message (existing)", "Founding Advisor ask",
     "My Muslim friend, origin of Mizan", "—", "Yes (same day)",
     "2026-05-30",
     "yeah a lot are not [familiar with the scholar thing]; u should auto set it to b",
     "Engaged — Founding Advisor confirmed",
     "Pending", "—",
     "Awaiting verbatim quote + warm intros",
     "Founding Advisor. Public name OK. No sect disclosure. Voted (b) silent default. Declined LinkedIn post. Endorsed CUHK DM. UX wording 'gold standard used by all Islamic banks' shipped."],
    # Day 4 (today June 1): FIRST INBOUND from CUHK MSA route
    ["2026-06-01", "Ibrahim Malik", "Email (inbound)", "N/A — he reached out",
     "CUHK MSA member, vxibrahimmalikxv@gmail.com",
     "—", "Yes (inbound)", "2026-05-31",
     "I find it really cool and would be happy to help out with testing the screener",
     "Engaged — wants to test",
     "Pending — pending session",
     "—",
     "Replied with Zoom proposal (Tue/Wed/Thu HK time)",
     "FIRST INBOUND. CUHK MSA Instagram route worked. Bring notepad. Record his exact words. June 1, 1:19 PM HK."],
]

# Insert at first empty row
start_row = 7
for offset, row_data in enumerate(new_rows):
    r = start_row + offset
    for c_idx, val in enumerate(row_data, start=1):
        cell = ws.cell(row=r, column=c_idx, value=val)
        cell.alignment = left
        cell.border = border
        # Highlight Ibrahim's row in gold (first inbound)
        if row_data[1] == "Ibrahim Malik":
            cell.font = font_inbound
            cell.fill = fill_gold_light
        elif row_data[1] == "Miqdad":
            cell.font = font_body
            cell.fill = fill_cream
        else:
            cell.font = font_body

# ----- Daily Counts: set Day 1 date + fill Day 1 and Day 4 -----
ws2 = wb["Daily Counts"]

# Set Day 1 date
ws2["B4"] = datetime.date(2026, 5, 29)

# Day 1 row (row 10) — May 29: sent 6 DMs
ws2.cell(row=10, column=2, value=6)   # DMs sent
ws2.cell(row=10, column=3, value=0)   # Replies received
ws2.cell(row=10, column=4, value=0)   # Quotable reactions
ws2.cell(row=10, column=5, value=0)   # Unprompted shares
ws2.cell(row=10, column=6, value=0)   # Communities engaged
ws2.cell(row=10, column=7, value="5 tier-1 named scholars (Faraz, Ibrahim, Mohsin, Joe, Rakaan) + 1 broader (Musaffa). Hit monthly free-note cap on Faraz #1.")

# Day 2 (May 30) — Miqdad recruited as Founding Advisor
ws2.cell(row=11, column=2, value=0)
ws2.cell(row=11, column=3, value=1)   # Miqdad's reply counts as a real engagement
ws2.cell(row=11, column=4, value=1)   # His "yeah a lot are not" is verbatim
ws2.cell(row=11, column=5, value=0)
ws2.cell(row=11, column=6, value=1)   # Miqdad's network = a community
ws2.cell(row=11, column=7, value="Miqdad recruited as Founding Advisor. Public name OK. UX vote: (b) silent default. About page + OUTREACH templates updated. Screen page shipped with his gold-standard copy.")

# Day 3 (May 31) — Continued setup
ws2.cell(row=12, column=2, value=0)
ws2.cell(row=12, column=3, value=0)
ws2.cell(row=12, column=4, value=0)
ws2.cell(row=12, column=5, value=0)
ws2.cell(row=12, column=6, value=0)
ws2.cell(row=12, column=7, value="Welcome banner UX shipped. CUHK MSA Instagram DM sent. X account setup.")

# Day 4 (June 1, today) — Ibrahim Malik inbound
ws2.cell(row=13, column=2, value=0)
ws2.cell(row=13, column=3, value=1)   # Ibrahim inbound
ws2.cell(row=13, column=4, value=1)   # His "find it really cool, happy to help" is quotable
ws2.cell(row=13, column=5, value=0)
ws2.cell(row=13, column=6, value=0)
ws2.cell(row=13, column=7, value="FIRST INBOUND — Ibrahim Malik via CUHK MSA route. Replied with Zoom proposal. First X reply queued.")

# Apply formatting to filled cells
for r in [10, 11, 12, 13]:
    for c in range(1, 8):
        cell = ws2.cell(row=r, column=c)
        cell.alignment = left
        cell.border = border
        cell.font = font_body
        if r == 13:  # Highlight today
            cell.fill = fill_gold_light

# ----- Quotable Feedback: pre-fill Ibrahim's first reaction -----
ws3 = wb["Quotable Feedback"]

# Find first empty row after the seeded ones (rows 5-6 are seeded)
new_quotes = [
    ["2026-05-30", "Miqdad (Founding Advisor)",
     "yeah a lot are not [familiar with the whole scholar thing]; u should auto set it to b",
     "WhatsApp — Founding Advisor UX vote",
     "Yes (per his permission, name OK, no sect)",
     "Internal — informed welcome banner UX"],
    ["2026-05-31", "Ibrahim Malik (CUHK MSA)",
     "Through CUHK Muslim student society, I learnt about the Halal Investing Screener app that you are building. I find it really cool and would be happy to help out with testing the screener.",
     "Email — inbound after CUHK MSA Instagram DM",
     "Ask first before public use",
     "Internal for now — pending session"],
]

start_quote = 7
for offset, row_data in enumerate(new_quotes):
    r = start_quote + offset
    for c_idx, val in enumerate(row_data, start=1):
        cell = ws3.cell(row=r, column=c_idx, value=val)
        cell.alignment = left
        cell.border = border
        cell.font = font_body
        if row_data[1].startswith("Ibrahim"):
            cell.fill = fill_gold_light
        elif row_data[1].startswith("Miqdad"):
            cell.fill = fill_cream

# ----- Hanafi Communities: update CUHK MSA status -----
ws4 = wb["Hanafi Communities"]
# CUHK Muslim Students row should exist from seed (last/lower row)
# Search for it
for r in range(5, 30):
    name = ws4.cell(row=r, column=1).value
    if name and "CUHK" in str(name):
        ws4.cell(row=r, column=3, value="ACTIVE — Ibrahim Malik responded")
        ws4.cell(row=r, column=4, value="2026-05-31")
        ws4.cell(row=r, column=5, value="Instagram DM to society → Ibrahim Malik emailed back the next day")
        ws4.cell(row=r, column=6, value="HIGHEST-LEVERAGE channel so far. First inbound. Zoom session pending.")
        for c in range(1, 7):
            ws4.cell(row=r, column=c).fill = fill_gold_light
        break
else:
    # If not found, add a new row
    for r in range(5, 30):
        if not ws4.cell(row=r, column=1).value:
            ws4.cell(row=r, column=1, value="CUHK MSA")
            ws4.cell(row=r, column=2, value="Instagram DM")
            ws4.cell(row=r, column=3, value="ACTIVE — Ibrahim Malik responded")
            ws4.cell(row=r, column=4, value="2026-05-31")
            ws4.cell(row=r, column=5, value="DM sent → Ibrahim Malik emailed back")
            ws4.cell(row=r, column=6, value="HIGHEST-LEVERAGE channel so far. First inbound.")
            for c in range(1, 7):
                cell = ws4.cell(row=r, column=c)
                cell.alignment = left
                cell.border = border
                cell.font = font_body
                cell.fill = fill_gold_light
            break

wb.save(PATH)
print(f"Updated: {PATH}")
