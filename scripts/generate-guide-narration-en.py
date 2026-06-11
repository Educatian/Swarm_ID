"""Generate English narration MP3s for the DTS guides via ElevenLabs.
Voice: Matilda (XrExE9yKIg1WjnnlVkGX, informative/educational), eleven_multilingual_v2.
Usage: py scripts/generate-guide-narration-en.py
"""
import json, time, urllib.request, pathlib

KEY = pathlib.Path(r"C:\Users\jewoo\Desktop\_Personal\_Credentials\elevanlabs_API.txt").read_text().strip()
VOICE = "XrExE9yKIg1WjnnlVkGX"
URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128"

STUDENT = {
  "00-intro": "Welcome to the Design Tension Studio student guide. You'll receive one instructional design case and your job is to uncover the tensions around it. The same case looks different through four lenses: teacher, student, edtech, and administration. Follow this guide one step at a time.",
  "01-landing": "Step one: getting in. Open the address your instructor shared. If this is your first time, tap 'First time here? Join with a course code' below the card, and enter your email, a password, and the course code. On an iPad, tap the share button in Safari and choose 'Add to Home Screen' to use the studio like an app.",
  "02-welcome": "Step two: your first visit. Four short welcome slides explain what the tool is, what the four lenses are, and what to do today. On the last slide you can start a guided tour that points out each part of the screen. Skipping is fine — the 'Show Tutorial' button at the top reopens it anytime.",
  "03-home": "Step three: the home screen. If you have a case in progress, one tap on 'Continue' takes you straight back to the map. Remember one thing: tensions don't resolve neatly. Your goal today is to pick the one that matters most and build your reasoning on evidence.",
  "04-task-banner": "Step four: the what-to-do-now banner. Above the map you'll see five steps: open a case, read issues by tapping nodes, switch lenses, ask or add a node, and write your reflection. Steps check off automatically as you do them, so whenever you feel lost, look at the banner.",
  "05-map-read": "Step five: reading the map. One node is one issue. Tap a node to see its explanation — on an iPad the tooltip stays pinned until you tap the background. Colors carry meaning too: purple for instructional signals, red for constraint friction, green for evidence. Dashed lines between stakeholders mark where one side's decision becomes the other side's burden.",
  "06-lens-bar": "Step six: switching lenses. The lens buttons under the map re-read the same case through the eyes of the teacher, students, edtech, or administration. Try at least two lenses — tensions stay invisible when you only look from one side.",
  "07-swarm-round": "Step seven: asking questions. Type a question and five stakeholder agents answer at the same time. Their responses appear as new nodes, and when agents disagree, a red edge marks the spot — that's exactly where a discussion is worth having. Check the activity feed on the right to see how your actions changed the map.",
  "08-add-node": "Step eight: adding your own node. Tap the plus icon on the left to open the add-node panel. Add a concern you think the original case is missing. Your node joins the map with a 'Me' badge, and the AI links related issues to it. With a node selected, you can also leave notes.",
  "09-list-view": "Step nine: list view. If the map feels overwhelming, tap the List button. The same issues become a searchable list you can sort by lens, type, name, or origin. Tapping a row selects that node.",
  "10-class-view": "Step ten: class view. Switch the map layer to class view to see the issues your classmates added. Issues raised by several people are grouped with a count. When a classmate has the same case open, you'll see who's viewing, and their nodes appear on your map in real time.",
  "12-critique": "Step twelve: sharpening with swarm feedback. After drafting your reflection, press 'Get swarm feedback' and five lenses read your draft and push back with challenges. They never hand you answers — they point at the tensions your argument missed. The studio also checks whether you cited map nodes as evidence. Revise to answer the challenges, then submit. And the 'One-page export' button bundles your nodes, notes, reflection, and the critiques you received into a single printable page.",
  "11-report": "Final step: your reflection. The report view gathers the issues and evidence you found. Answer the reflection prompt and submit it to your instructor. There's one standard for a good reflection: did you pick the single most important tension, and explain your choice with evidence from the map? Nice work!",
}

INSTRUCTOR = {
  "00-intro": "Welcome to the Design Tension Studio instructor guide. The operating model is simple: you create and publish a case, students join with a course code, explore the map, and leave nodes, questions, and reflections. You manage cases and watch engagement from the My Course view.",
  "01-create-case": "Step one: creating a case. Sign in with your instructor account, paste a course brief into the intake panel on the left, and click create. The AI converts the brief into a structured case — stakeholders, constraints, and issues become a map. New cases start as drafts; publish to make them visible to students.",
  "02-manage": "Step two: the My Course view. This is your management hub. Copy the join code for your students, and review every case with its status and participation summary at a glance.",
  "03-actions": "Step three: curating cases. Each case has open, rename, publish, archive, and delete actions. Cases with student activity can only be archived, never deleted — that guard keeps semester data safe. Archived cases can be restored anytime.",
  "04-analytics": "Step four: reading the engagement analytics. In the funnel, the drop between stages is your intervention point — if students opened the case but contributed little, run a node-adding activity in class. In the lens distribution, under-visited lenses are good candidates for explicit discussion. The per-student table helps you spot quiet students early.",
  "06-guide": "Step six: the discussion guide. In My Course, press a case's 'Discussion guide' button and a printable one-pager is generated automatically: the case constraints, the stakeholder interlock points worth projecting, the issues your class repeated, the minority voices, and the under-visited lens — each scene paired with a ready-to-use talk move. One minute before class, and your discussion script for the day is ready.",
  "05-realtime": "Step five: live classroom use. Project your screen, switch to class view, and ask students to add the concerns the case is missing. Watch nodes accumulate in real time, then discuss the recurring issues and the minority voices together.",
}

def tts(text, out_path):
    body = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.2},
    }).encode("utf-8")
    req = urllib.request.Request(URL, data=body, headers={
        "xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg",
    })
    with urllib.request.urlopen(req, timeout=120) as resp:
        audio = resp.read()
    pathlib.Path(out_path).write_bytes(audio)
    print(f"ok {out_path} ({len(audio)//1024} KB)")

pathlib.Path("guides/audio/student-en").mkdir(parents=True, exist_ok=True)
pathlib.Path("guides/audio/instructor-en").mkdir(parents=True, exist_ok=True)
for name, text in STUDENT.items():
    tts(text, f"guides/audio/student-en/{name}.mp3"); time.sleep(0.6)
for name, text in INSTRUCTOR.items():
    tts(text, f"guides/audio/instructor-en/{name}.mp3"); time.sleep(0.6)
print("done")
