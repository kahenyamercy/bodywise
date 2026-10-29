"""BodyWise browser acceptance tests (Playwright, headless Chromium).
Run:  python3 -m http.server 8765 --directory .   (in another terminal)
      python3 tests/e2e.py [base_url] [screenshot_dir]
"""
import sys, os
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8765/index.html"
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None
results = []

def check(name, fn):
    try:
        fn(); results.append((True, name)); print("  ✓", name)
    except Exception as e:  # noqa
        results.append((False, name)); print("  ✗", name, "\n   ", (str(e).splitlines() or [repr(e)])[0][:300])

def shot(page, name):
    if SHOTS:
        os.makedirs(SHOTS, exist_ok=True); page.screenshot(path=os.path.join(SHOTS, name + ".png"), full_page=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    for label, vp in [("desktop", {"width": 1280, "height": 860}), ("mobile", {"width": 390, "height": 844})]:
        print(f"\n[{label}]")
        ctx = browser.new_context(viewport=vp)
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "fonts.g" not in m.text and "Failed to load resource" not in m.text else None)
        page.goto(BASE + "#home"); page.wait_for_selector("h1")
        shot(page, f"{label}-home")

        def nav_all():
            for route, text in [("home", "machine you live in"), ("learn", "Learn"), ("explore", "Body explorer"), ("connections", "Body Connection Map"), ("scenarios", "Follow a situation"), ("paths", "learning paths"), ("tutor", "physiology tutor"), ("practice", "Quizzes and revision"), ("progress", "progress"), ("notes", "notes"), ("preferences", "Settings"), ("sources", "Sources")]:
                page.goto(BASE + "#" + route); page.wait_for_timeout(80)
                expect(page.locator("h1")).to_contain_text(text, ignore_case=True)
        check("every main page opens", nav_all)

        def no_hscroll():
            for route in ["home", "learn", "lesson-m3-l4", "explore", "connections", "tutor", "practice", "progress", "preferences"]:
                page.goto(BASE + "#" + route); page.wait_for_timeout(80)
                w = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                assert w <= 1, f"{route} overflows by {w}px"
        check("no horizontal page scroll", no_hscroll)

        def nav_click():
            page.goto(BASE + "#home")
            if label == "desktop":
                page.locator(".sidebar a[data-nav='practice']").click()
            else:
                page.locator(".tabbar [data-act='sheet']").click(); page.locator(".sheet a[href='#practice']").click()
            expect(page.locator("h1")).to_contain_text("Quizzes")
        check("navigation controls work", nav_click)

        def lesson_flow():
            page.goto(BASE + "#learn"); page.locator("a[href='#module-1']").click()
            page.locator("a[href='#lesson-m1-l3']").click()
            expect(page.locator("h1")).to_contain_text("homeostasis", ignore_case=True)
            for sel in ["#s-diagram svg.diagram", "#s-related .rel", ".reflist a[href^='https://']", "#s-summary"]:
                assert page.locator(sel).count() > 0, sel
            page.locator("[data-act='level'][data-lv='advanced']").click()
            expect(page.locator("details.more").first).to_have_attribute("open", "")
            page.locator("[data-act='walk-start']").click(); page.locator("[data-act='walk-next']").click()
            expect(page.locator(".process .pcard.now")).to_have_count(1)
            expect(page.locator(".tutor-line")).to_contain_text("slow this down")
            page.locator("[data-act='alt-analogy']").click()
            expect(page.locator(".analogy .quote")).to_contain_text("matatu")
            shot(page, f"{label}-lesson")
        check("open a module and study a lesson (diagram, related systems, references)", lesson_flow)

        def quiz_flow():
            page.goto(BASE + "#lesson-m1-l3"); page.locator("[data-act='lesson-check']").click()
            c = page.locator("[data-check]")
            c.locator("[data-q='check']").click()
            expect(c.locator("[data-err]")).to_contain_text("first")
            c.get_by_text("The fluid that surrounds cells (extracellular fluid)").click()
            c.locator("[data-q='check']").click()
            expect(c.locator(".feedback.good")).to_be_visible()
            expect(c.locator(".feedback")).to_contain_text("interstitial")
            c.locator("[data-q='next']").click()
            c.locator(".opt[data-k='true']").click(); c.locator("[data-q='check']").click()
            expect(c.locator(".feedback.bad")).to_be_visible()
            c.locator("[data-q='next']").click()
            ans = {"1": "Stimulus", "2": "Receptor", "3": "Control centre", "4": "Effector", "5": "Response"}
            for n, v in ans.items(): c.locator(f".labelgrid [data-n='{n}'] select").select_option(v)
            c.locator("[data-q='check']").click(); expect(c.locator(".feedback.good")).to_be_visible()
            shot(page, f"{label}-quiz-label")
            c.locator("[data-q='next']").click()
            c.get_by_text("Effectors", exact=True).click(); c.locator("[data-q='check']").click(); c.locator("[data-q='next']").click()
            c.locator("textarea[id^='qs']").fill("Enzymes only work properly in a narrow range"); c.locator("[data-q='check']").click()
            expect(c.locator(".feedback")).to_contain_text("Model answer")
            c.locator("[data-q='next']").click()
            expect(c.locator(".statline .n")).to_have_text("4/5")
        check("quiz evaluates answers and explains them", quiz_flow)

        def complete_and_persist():
            page.goto(BASE + "#lesson-m1-l3"); page.locator("[data-act='complete']").first.click()
            expect(page.locator(".chip.good")).to_contain_text("Completed")
            page.goto(BASE + "#progress"); expect(page.locator(".statline .n").first).to_have_text("1/17")
            page.reload(); page.wait_for_selector("h1")
            expect(page.locator(".statline .n").first).to_have_text("1/17")
            page.goto(BASE + "#home"); expect(page.locator(".statstrip")).to_contain_text("1/17")
            shot(page, f"{label}-home-after")
        check("progress updates and persists after refresh", complete_and_persist)

        def flashcards():
            page.goto(BASE + "#practice-cards"); page.locator("[data-act='card-show']").click(); page.locator("[data-act='card-yes']").click()
            expect(page.locator("[data-cards]")).to_contain_text("Card 2")
        check("flashcard review works", flashcards)

        def tutor_flow():
            page.goto(BASE + "#tutor")
            if page.locator("[data-act='tutor-clear']").count(): page.locator("[data-act='tutor-clear']").click()
            page.locator("form[data-form='tutor'] button[type='submit']").click()
            expect(page.locator("[data-terr]")).to_contain_text("Type a question")
            page.fill("#tq", "Explain the relationship between the heart and kidneys"); page.keyboard.press("Enter")
            bot = page.locator(".msg.bot").last
            expect(bot).to_contain_text("Demo tutor"); expect(bot).to_contain_text("fifth"); expect(bot).to_contain_text("What each system gives the other")
            # answer the check wrongly: misconception handling then a simpler question
            right = page.evaluate("BW.store.state.tutor.pending.q.answer")
            n = page.locator(".msg.bot").last.locator(".topt").count()
            page.locator(".msg.bot").last.locator(".topt").nth((right + 1) % n).click()
            expect(page.locator(".msg.bot").last).to_contain_text("The missing step")
            expect(page.locator(".msg.bot").last.locator(".tcheck")).to_contain_text("smaller piece")
            page.locator(".msg.bot").last.locator(".topt").first.click()   # simpler TF: True is correct
            expect(page.locator(".msg.bot").last).to_contain_text("revisit the original")
            right = page.evaluate("BW.store.state.tutor.pending.q.answer")
            page.locator(".msg.bot").last.locator(".topt").nth(right).click()
            expect(page.locator(".msg.bot").last).to_contain_text("original question makes sense")
            # switch mode without restarting
            page.locator(".msg.bot").last.locator("[data-act='ask']", has_text="Show me the visual version").click()
            expect(page.locator(".msg.bot").last).to_contain_text("Visual mode")
            # the connection rule on a process question
            page.fill("#tq", "Why does heart rate increase during exercise?"); page.keyboard.press("Enter")
            expect(page.locator(".msg.bot").last.locator(".chain li")).to_have_count(7)
            expect(page.locator(".msg.bot").last).to_contain_text("And afterwards")
            page.locator(".msg.bot").last.locator("[data-act='tutor-remode'][data-mode='interactive']").click()
            expect(page.locator(".msg.bot").last).to_contain_text("step 1 of 7")
            page.locator("[data-act='teach-mode'][data-mode='exam']").click()
            expect(page.locator("[data-act='teach-mode'][data-mode='exam']")).to_have_attribute("aria-pressed", "true")
            page.fill("#tq", "Explain quantum chromodynamics"); page.keyboard.press("Enter")
            expect(page.locator(".msg.bot").last).to_contain_text("do not have a prepared explanation")
            page.locator("[data-act='teach-mode'][data-mode='auto']").click()
            shot(page, f"{label}-tutor")
        check("tutor answers with a clearly labelled demo response", tutor_flow)

        def voice_fallback():
            page.goto(BASE + "#tutor"); page.locator("[data-act='mic']").click(); page.wait_for_timeout(600)
            txt = page.locator("[data-terr]").inner_text() + page.locator("[data-listen]").inner_text()
            assert txt.strip(), "no feedback after pressing the microphone"
            page.goto(BASE + "#preferences"); expect(page.locator("text=Read-aloud:")).to_be_visible()
        check("voice controls give feedback or a graceful fallback", voice_fallback)

        def connections():
            page.goto(BASE + "#explore"); page.locator(".syspick [data-sys='re']").click()
            expect(page.locator(".explorer h2").first).to_contain_text("Renal")
            page.locator(".explorer .rel a[href^='#lesson-']").first.click()
            expect(page.locator("h1")).not_to_contain_text("explorer")
            page.goto(BASE + "#connections"); page.locator(".syspick [data-sys='cv']").click()
            expect(page.locator(".map .edge.on").first).to_be_visible()
            page.goto(BASE + "#connections-cv-re")
            op = page.locator("details.conn[open]"); expect(op).to_contain_text("Receives from Renal"); expect(op).to_contain_text("How it works")
            expect(page.locator(".map .edge.pair")).to_have_count(1)
            page.locator("[data-act='map-quiz']").click(); expect(page.locator("[data-mapquiz] .quiz")).to_be_visible()
            op.locator("a[href^='#lesson-']").first.click(); expect(page.locator("h1")).to_contain_text("renin", ignore_case=True)
            page.goto(BASE + "#connections-cv"); shot(page, f"{label}-connections")
            page.goto(BASE + "#scenarios"); expect(page.locator(".scncard")).to_have_count(7)
            page.locator(".scncard[href='#scenario-running']").click()
            page.locator(".scnbtn[data-i='2']").click(); expect(page.locator("h2").filter(has_text="Local signals")).to_be_visible()
            page.locator(".scn-node[data-i='4']").click(); expect(page.locator("h2").filter(has_text="Breathing increases")).to_be_visible()
            expect(page.locator(".loopslist li")).to_have_count(2)
            shot(page, f"{label}-scenario")
            page.goto(BASE + "#path-bleed-to-rbc"); expect(page.locator(".pathsteps li")).to_have_count(5)
            page.goto(BASE + "#explore-cv"); shot(page, f"{label}-explore")
        check("navigate from a concept to related systems and lessons", connections)

        def keyboard():
            page.goto(BASE + "#explore")
            page.locator("g.hot[data-sys='rs']").focus(); page.keyboard.press("Enter")
            expect(page.locator(".explorer h2").first).to_contain_text("Respiratory")
            page.goto(BASE + "#home"); page.reload(); page.wait_for_selector("h1"); page.keyboard.press("Tab")
            focused = page.evaluate("document.activeElement.textContent")
            assert "Skip" in focused, focused
        check("keyboard navigation works", keyboard)

        def interactive():
            page.goto(BASE + "#lesson-m3-l4"); page.wait_for_selector("[data-cardiac]")
            page.locator(".term-btn[data-act='term']:visible").first.click()
            expect(page.locator("#termpop")).to_be_visible(); page.keyboard.press("Escape")
            expect(page.locator("#termpop")).to_have_count(0)
            right = page.evaluate("BW.ui.predictQuestion(BW.lessonIndex['m3-l4']).options[0]")
            pr = page.locator("[data-mini='predict']"); pr.locator(".opt", has_text=right[:40]).click(); pr.locator("[data-q='check']").click()
            expect(pr.locator(".feedback.good")).to_be_visible()
            my = page.locator("[data-mini='myth']"); my.locator(".opt[data-k='false']").click(); my.locator("[data-q='check']").click()
            expect(my.locator(".feedback.good")).to_be_visible()
            page.locator("[data-act='cc-next']").click(); page.locator("[data-act='cc-next']").click()
            expect(page.locator("[data-cinfo]")).to_contain_text("Isovolumetric contraction"); expect(page.locator("[data-cinfo]")).to_contain_text("lub")
            page.locator("[data-cardiac]").focus(); page.keyboard.press("ArrowRight")
            expect(page.locator("[data-cinfo]")).to_contain_text("Ventricular ejection")
            page.locator("#s-cardiac").scroll_into_view_if_needed(); shot(page, f"{label}-cardiac")
            page.locator("[data-act='enlarge']").click(); expect(page.locator(".dlg")).to_be_visible()
            page.locator("[data-act='dlg-zoom'][data-z='1']").click(); expect(page.locator("[data-zl]")).to_have_text("150%")
            page.keyboard.press("Escape"); expect(page.locator(".dlg")).to_have_count(0)
            page.goto(BASE + "#lesson-m6-l4"); expect(page.locator(".pathstrip .pstep")).to_have_count(6)
            expect(page.locator(".pathstrip")).to_contain_text("Simplified pathway")
            page.locator(".rel-link").first.click(); expect(page.locator("h1")).not_to_contain_text("Insulin and glucagon")
        check("interactive lesson parts (terms, predict, mini checks, cardiac cycle, zoom, pathways)", interactive)

        def dashboard():
            page.goto(BASE + "#home")
            page.locator("[data-act='mystery']").click(); expect(page.locator(".mystery .reveal")).to_be_visible()
            page.locator("[data-act='joke-science']").click(); expect(page.locator(".jokecard .reveal")).to_contain_text("real science")
            for sel in [".continue-card", ".statstrip", ".minibody", ".links-list, .home .empty"]: assert page.locator(sel).count() > 0, sel
            shot(page, f"{label}-dashboard")
            page.fill("#askq", "Why do I get hiccups?"); page.locator("form[data-form='ask'] button").click()
            expect(page.locator("h1")).to_contain_text("tutor", ignore_case=True); expect(page.locator(".msg.me").last).to_contain_text("hiccups")
        check("dashboard mystery, joke science and Ask BodyWise", dashboard)

        def audit():
            page.goto(BASE + "#sources"); expect(page.locator(".costtable tbody tr")).to_have_count(13)
            expect(page.locator("#cost")).to_contain_text("Paid service")
        check("KES 0 audit table is shown in the app", audit)

        def dead_buttons():
            for route in ["home", "lesson-m8-l6", "explore", "practice", "preferences", "notes"]:
                page.goto(BASE + "#" + route); page.wait_for_timeout(60)
                bad = page.evaluate("""() => [...document.querySelectorAll('main button')].filter(b => !b.dataset.act && !b.dataset.q && b.type !== 'submit' && !b.closest('form') && !b.closest('[data-tquiz]') && !b.closest('.quiz')).map(b => b.outerHTML.slice(0,80))""")
                assert not bad, route + ": " + str(bad)
        check("no decorative buttons", dead_buttons)

        def dark_mode():
            page.goto(BASE + "#preferences"); page.locator("[data-act='pref'][data-k='theme'][data-v='dark']").click()
            bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
            assert bg == "rgb(12, 20, 36)", bg
            page.goto(BASE + "#lesson-m3-l4"); shot(page, f"{label}-lesson-dark")
            page.goto(BASE + "#preferences"); page.locator("[data-act='pref'][data-k='theme'][data-v='system']").click()
        check("dark theme applies", dark_mode)

        check("no JavaScript errors", lambda: (_ for _ in ()).throw(AssertionError("; ".join(errors[:5]))) if errors else None)
        ctx.close()
    browser.close()

failed = [n for ok, n in results if not ok]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
