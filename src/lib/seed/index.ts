import type Database from "better-sqlite3";
import { newId, certUid } from "../ids";
import { now, toJson, slugify } from "../utils";
import bcrypt from "bcryptjs";
import { SEED_COURSES } from "./courses";
import { SEED_ROLEPLAYS } from "./roleplay";
import { SEED_TOOLKIT } from "./toolkit";
import { SEED_BADGES } from "./badges";
import { SEED_FLOOR_TASKS, SEED_KPI_DEFINITIONS } from "./misc";
import { SEED_USERS } from "./users";

const TRACK_META: Record<string, { title: string; order: number }> = {
  foundations: { title: "Foundations", order: 1 },
  specialist: { title: "Specialist", order: 2 },
  leadership: { title: "Leadership", order: 3 },
  trainer: { title: "Trainer", order: 4 },
};

export function runSeed(db: Database.Database) {
  const insertMany = db.transaction(() => {
    const ts = now();

    // --- Organization & Locations ---
    const orgId = newId("org");
    db.prepare(
      "INSERT INTO organizations (id, name, description, created_at) VALUES (?,?,?,?)"
    ).run(
      orgId,
      "Aurelia Fine Jewelry Academy",
      "A demo fine-jewelry retail organization used to power learning and sales-coaching training content.",
      ts
    );

    const locations = [
      { key: "harbour_view", name: "Harbour View Fine Jewelry", type: "luxury_boutique", city: "Harbour City", region: "North America" },
      { key: "bridal_house", name: "Bridal House by Aurelia", type: "bridal_showroom", city: "Harbour City", region: "North America" },
      { key: "ocean_passage", name: "Ocean Passage Jewelry", type: "cruise_travel", city: "Port Calis", region: "Caribbean" },
    ];
    const locationIds: Record<string, string> = {};
    for (const loc of locations) {
      const id = newId("loc");
      locationIds[loc.key] = id;
      db.prepare(
        "INSERT INTO locations (id, org_id, name, location_type, city, region, created_at) VALUES (?,?,?,?,?,?,?)"
      ).run(id, orgId, loc.name, loc.type, loc.city, loc.region, ts);
    }

    // --- Teams ---
    const teams = [
      { key: "harbour_view_sales", name: "Harbour View Sales Team", locationKey: "harbour_view" },
      { key: "bridal_house_sales", name: "Bridal House Sales Team", locationKey: "bridal_house" },
      { key: "ocean_passage_sales", name: "Ocean Passage Sales Team", locationKey: "ocean_passage" },
    ];
    const teamIds: Record<string, string> = {};
    for (const team of teams) {
      const id = newId("team");
      teamIds[team.key] = id;
      db.prepare(
        "INSERT INTO teams (id, org_id, location_id, name, created_at) VALUES (?,?,?,?,?)"
      ).run(id, orgId, locationIds[team.locationKey], team.name, ts);
    }

    // --- Users ---
    const userIds: Record<string, string> = {};
    for (const u of SEED_USERS) {
      const id = newId("usr");
      userIds[u.key] = id;
      const passwordHash = bcrypt.hashSync(u.password, 10);
      db.prepare(
        `INSERT INTO users (id, org_id, location_id, team_id, name, email, password_hash, role, title, avatar_seed, experience_level, onboarded, weekly_availability_hours, region, market, career_goal, primary_skill_goal, retail_environment, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).run(
        id,
        orgId,
        u.locationKey ? locationIds[u.locationKey] : null,
        u.teamKey ? teamIds[u.teamKey] : null,
        u.name,
        u.email,
        passwordHash,
        u.role,
        u.title,
        u.key,
        u.experienceLevel,
        u.onboarded ? 1 : 0,
        u.weeklyAvailabilityHours,
        u.region,
        u.market,
        u.careerGoal,
        u.primarySkillGoal,
        u.retailEnvironment,
        ts
      );
    }
    // set team manager
    db.prepare("UPDATE teams SET manager_id = ? WHERE id = ?").run(
      userIds["store_manager"],
      teamIds["harbour_view_sales"]
    );

    // --- Learning Paths ---
    const pathIds: Record<string, string> = {};
    let pathOrder = 0;
    for (const trackKey of Object.keys(TRACK_META)) {
      const id = newId("path");
      pathIds[trackKey] = id;
      pathOrder += 1;
      db.prepare(
        "INSERT INTO learning_paths (id, key, title, track, description, order_index, created_at) VALUES (?,?,?,?,?,?,?)"
      ).run(
        id,
        trackKey,
        TRACK_META[trackKey].title,
        trackKey,
        `The ${TRACK_META[trackKey].title} learning track for Aurelia Fine Jewelry Academy.`,
        TRACK_META[trackKey].order,
        ts
      );
    }

    // --- Courses, Modules, Lessons, Flashcards, Quizzes ---
    const courseIds: Record<string, string> = {};
    const lessonIdsByCourse: Record<string, string[]> = {};
    const floorTaskIdsByCourseKey: Record<string, string[]> = {};
    let courseOrder = 0;
    for (const c of SEED_COURSES) {
      courseOrder += 1;
      const courseId = newId("course");
      courseIds[c.key] = courseId;
      lessonIdsByCourse[c.key] = [];
      db.prepare(
        `INSERT INTO courses (id, path_id, title, slug, description, outcomes, estimated_minutes, skill_tags, kpi_areas, level, order_index, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      ).run(
        courseId,
        pathIds[c.track],
        c.title,
        c.slug,
        c.description,
        toJson(c.outcomes),
        c.estimatedMinutes,
        toJson(c.skillTags),
        toJson(c.kpiAreas),
        c.track,
        courseOrder,
        ts
      );

      let moduleOrder = 0;
      for (const mod of c.modules) {
        moduleOrder += 1;
        const moduleId = newId("mod");
        db.prepare(
          "INSERT INTO modules (id, course_id, title, order_index, created_at) VALUES (?,?,?,?,?)"
        ).run(moduleId, courseId, mod.title, moduleOrder, ts);

        let lessonOrder = 0;
        for (const lesson of mod.lessons) {
          lessonOrder += 1;
          const lessonId = newId("lsn");
          lessonIdsByCourse[c.key].push(lessonId);
          db.prepare(
            `INSERT INTO lessons (id, module_id, title, slug, summary, sections, key_terms, client_language, floor_tasks, scripts, compliance_notes, estimated_minutes, order_index, created_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
          ).run(
            lessonId,
            moduleId,
            lesson.title,
            slugify(lesson.title),
            lesson.summary,
            toJson(lesson.sections),
            toJson(lesson.keyTerms),
            toJson(lesson.clientLanguage),
            toJson(lesson.floorTaskHints),
            toJson(lesson.scripts),
            toJson(lesson.complianceNotes),
            lesson.estimatedMinutes,
            lessonOrder,
            ts
          );
        }
      }

      // Flashcard deck for the course
      const deckId = newId("deck");
      db.prepare(
        "INSERT INTO flashcard_decks (id, course_id, title, created_at) VALUES (?,?,?,?)"
      ).run(deckId, courseId, `${c.title} Flashcards`, ts);
      let cardOrder = 0;
      for (const card of c.flashcards) {
        cardOrder += 1;
        db.prepare(
          "INSERT INTO flashcards (id, deck_id, front, back, order_index, created_at) VALUES (?,?,?,?,?,?)"
        ).run(newId("card"), deckId, card.front, card.back, cardOrder, ts);
      }

      // Final assessment quiz for the course
      const quizId = newId("quiz");
      db.prepare(
        "INSERT INTO quizzes (id, course_id, title, quiz_type, passing_score, created_at) VALUES (?,?,?,?,?,?)"
      ).run(quizId, courseId, c.quizTitle, "final_assessment", 70, ts);
      let qOrder = 0;
      for (const q of c.quizQuestions) {
        qOrder += 1;
        db.prepare(
          `INSERT INTO quiz_questions (id, quiz_id, question_type, prompt, options, correct_answer, explanation, skill_tag, order_index, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)`
        ).run(
          newId("q"),
          quizId,
          q.type,
          q.prompt,
          toJson(q.options ?? []),
          toJson(q.correct),
          q.explanation,
          q.skillTag,
          qOrder,
          ts
        );
      }
    }

    // --- Floor tasks (linked loosely to courses) ---
    const floorTaskIds: string[] = [];
    for (const t of SEED_FLOOR_TASKS) {
      const id = newId("task");
      floorTaskIds.push(id);
      const courseId = t.courseKey ? courseIds[t.courseKey] : null;
      if (t.courseKey) {
        floorTaskIdsByCourseKey[t.courseKey] = floorTaskIdsByCourseKey[t.courseKey] || [];
        floorTaskIdsByCourseKey[t.courseKey].push(id);
      }
      db.prepare(
        "INSERT INTO floor_tasks (id, course_id, title, description, skill_tag, created_at) VALUES (?,?,?,?,?,?)"
      ).run(id, courseId, t.title, t.description, t.skillTag, ts);
    }

    // --- Role-play scenarios + rubrics ---
    const rubricCriteria = [
      { key: "discovery_questions", label: "Discovery Questions", description: "Asked relevant, open-ended questions to understand the client.", weight: 15 },
      { key: "product_accuracy", label: "Product Accuracy", description: "Provided accurate, non-exaggerated product information.", weight: 15 },
      { key: "plain_language", label: "Plain-Language Explanation", description: "Explained concepts in clear, jargon-free language.", weight: 10 },
      { key: "empathy_trust", label: "Empathy & Client Trust", description: "Demonstrated empathy and built rapport with the client.", weight: 15 },
      { key: "feature_benefit_emotion", label: "Feature-Benefit-Emotion", description: "Connected product features to benefits and emotional value.", weight: 10 },
      { key: "objection_handling", label: "Objection Handling", description: "Responded to objections with empathy and confidence.", weight: 15 },
      { key: "ethical_closing", label: "Ethical Closing", description: "Closed (or advanced) the conversation without pressure tactics.", weight: 10 },
      { key: "compliance_awareness", label: "Compliance Awareness", description: "Avoided unverified claims about value, approval, or guarantees.", weight: 10 },
    ];
    const scenarioIds: string[] = [];
    for (const rp of SEED_ROLEPLAYS) {
      const id = newId("rps");
      scenarioIds.push(id);
      db.prepare(
        `INSERT INTO role_play_scenarios (id, title, category, difficulty, client_opening, situation, persona, skill_tags, guardrails, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).run(
        id,
        rp.title,
        rp.category,
        rp.difficulty,
        rp.clientOpening,
        rp.situation,
        rp.persona,
        toJson(rp.skillTags),
        toJson(rp.guardrails),
        ts
      );
      const rubricId = newId("rub");
      db.prepare(
        "INSERT INTO role_play_rubrics (id, scenario_id, title, criteria, created_at) VALUES (?,?,?,?,?)"
      ).run(rubricId, id, `${rp.title} Rubric`, toJson(rubricCriteria), ts);
    }

    // --- Toolkit resources ---
    const toolkitIds: string[] = [];
    for (const r of SEED_TOOLKIT) {
      const id = newId("tool");
      toolkitIds.push(id);
      db.prepare(
        `INSERT INTO toolkit_resources (id, title, category, resource_type, summary, content, tags, created_at)
         VALUES (?,?,?,?,?,?,?,?)`
      ).run(id, r.title, r.category, r.resourceType, r.summary, toJson(r.content), toJson(r.tags), ts);
    }

    // --- Badges ---
    const badgeIds: Record<string, string> = {};
    for (const b of SEED_BADGES) {
      const id = newId("badge");
      badgeIds[b.key] = id;
      db.prepare(
        "INSERT INTO badges (id, key, title, description, level, icon, criteria, created_at) VALUES (?,?,?,?,?,?,?,?)"
      ).run(id, b.key, b.title, b.description, b.level, b.icon, b.criteria, ts);
    }

    // --- KPI definitions ---
    for (const k of SEED_KPI_DEFINITIONS) {
      db.prepare(
        "INSERT INTO kpi_definitions (id, key, title, description, formula, unit, created_at) VALUES (?,?,?,?,?,?,?)"
      ).run(newId("kpi"), k.key, k.title, k.description, k.formula, k.unit, ts);
    }

    // --- Team KPI demo records (3 team dashboards, last 6 months) ---
    const periods = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];
    const teamKpiBase: Record<string, Record<string, [number, number]>> = {
      harbour_view_sales: {
        conversion: [28, 34], average_ticket: [3200, 4100], units_per_transaction: [1.3, 1.7],
        client_book_growth: [2, 7], repeat_client_rate: [22, 31], sales_vs_plan: [88, 104],
        shrink: [0.4, 0.9], staff_turnover: [4, 11], bridal_conversion: [30, 42], band_attachment: [40, 58],
      },
      bridal_house_sales: {
        conversion: [35, 46], average_ticket: [5200, 6800], units_per_transaction: [1.6, 2.1],
        client_book_growth: [4, 10], repeat_client_rate: [18, 27], sales_vs_plan: [90, 112],
        shrink: [0.3, 0.7], staff_turnover: [2, 8], bridal_conversion: [45, 62], band_attachment: [55, 74],
      },
      ocean_passage_sales: {
        conversion: [18, 27], average_ticket: [1800, 2600], units_per_transaction: [1.1, 1.5],
        client_book_growth: [-1, 4], repeat_client_rate: [4, 9], sales_vs_plan: [80, 101],
        shrink: [0.6, 1.4], staff_turnover: [6, 15], bridal_conversion: [10, 18], band_attachment: [15, 25],
      },
    };
    function pseudoRandom(seed: number) {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
    let seedCounter = 1;
    for (const teamKey of Object.keys(teamKpiBase)) {
      const teamId = teamIds[teamKey];
      for (const [kpiKey, [min, max]] of Object.entries(teamKpiBase[teamKey])) {
        periods.forEach((period, idx) => {
          seedCounter += 1;
          const progress = idx / (periods.length - 1);
          const rand = pseudoRandom(seedCounter * 17.7);
          const value = Math.round((min + (max - min) * progress + (rand - 0.5) * (max - min) * 0.15) * 10) / 10;
          const target = Math.round(((min + max) / 2) * 1.05 * 10) / 10;
          db.prepare(
            "INSERT INTO team_kpi_records (id, team_id, kpi_key, period, value, target, created_at) VALUES (?,?,?,?,?,?,?)"
          ).run(newId("tkpi"), teamId, kpiKey, period, value, target, ts);
        });
      }
    }

    // --- Announcements ---
    const announcements = [
      { title: "Welcome to Aurelia Fine Jewelry Academy", body: "We're excited to launch your personalized learning journey. Start with the Foundations path to build core product and conversation skills.", audience: "all" },
      { title: "New Role-Play Scenario: Travel Retail Time Pressure", body: "Practice the new cruise/travel-retail scenario, 'We only have 20 minutes before boarding,' in Practice Role-Play.", audience: "learner" },
      { title: "Q3 Coaching Focus: Ethical Closing", body: "Store managers: this quarter's coaching focus is ethical closing techniques. Review the updated rubric in Team Coaching.", audience: "store_manager" },
    ];
    for (const a of announcements) {
      db.prepare(
        "INSERT INTO announcements (id, org_id, title, body, audience_role, created_at) VALUES (?,?,?,?,?,?)"
      ).run(newId("ann"), orgId, a.title, a.body, a.audience, ts);
    }

    // --- Content categories & tags ---
    const categories = ["Product Knowledge", "Sales Conversation", "Bridal", "Compliance", "Operations", "Leadership", "Clienteling"];
    for (const cat of categories) {
      db.prepare(
        "INSERT INTO content_categories (id, name, kind, created_at) VALUES (?,?,?,?)"
      ).run(newId("cat"), cat, "course", ts);
    }
    const tagSet = new Set<string>();
    SEED_TOOLKIT.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
    for (const tag of tagSet) {
      db.prepare("INSERT INTO tags (id, name, created_at) VALUES (?,?,?)").run(newId("tag"), tag, ts);
    }

    // --- Path enrollments: enroll all learners in Foundations, specialists into their specialist path ---
    const learnerKeys = SEED_USERS.filter((u) => u.role === "learner").map((u) => u.key);
    for (const key of learnerKeys) {
      db.prepare(
        "INSERT OR IGNORE INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
      ).run(newId("penr"), userIds[key], pathIds["foundations"], ts);
    }
    // specialists also enrolled in specialist track
    for (const key of ["bridal_specialist", "gemologist_seller", "cruise_specialist", "learner_extra_3"]) {
      db.prepare(
        "INSERT OR IGNORE INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
      ).run(newId("penr2"), userIds[key], pathIds["specialist"], ts);
    }
    db.prepare(
      "INSERT OR IGNORE INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
    ).run(newId("penr3"), userIds["store_manager"], pathIds["leadership"], ts);
    db.prepare(
      "INSERT OR IGNORE INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
    ).run(newId("penr4"), userIds["district_leader"], pathIds["leadership"], ts);
    db.prepare(
      "INSERT OR IGNORE INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
    ).run(newId("penr5"), userIds["trainer"], pathIds["trainer"], ts);

    // --- Course enrollments & lesson progress for demo learners (make platform feel active) ---
    const foundationCourseKeys = ["diamond-gemstone-fluency", "fine-jewelry-sales-conversation"];
    const activityLog: { userKey: string; type: string; refId: string; summary: string }[] = [];

    function enroll(userKey: string, courseKey: string, progressPercent: number, status: string) {
      const courseId = courseIds[courseKey];
      const userId = userIds[userKey];
      db.prepare(
        `INSERT OR IGNORE INTO course_enrollments (id, user_id, course_id, status, progress_percent, started_at, completed_at)
         VALUES (?,?,?,?,?,?,?)`
      ).run(
        newId("enr"),
        userId,
        courseId,
        status,
        progressPercent,
        ts,
        status === "completed" ? ts : null
      );
      // mark lesson progress proportionally
      const lessonIds = lessonIdsByCourse[courseKey];
      const completeCount = Math.round((progressPercent / 100) * lessonIds.length);
      lessonIds.forEach((lessonId, idx) => {
        const lessonStatus = idx < completeCount ? "completed" : idx === completeCount ? "in_progress" : "not_started";
        const lessonPct = lessonStatus === "completed" ? 100 : lessonStatus === "in_progress" ? 40 : 0;
        db.prepare(
          `INSERT OR IGNORE INTO lesson_progress (id, user_id, lesson_id, status, progress_percent, completed_at, updated_at)
           VALUES (?,?,?,?,?,?,?)`
        ).run(newId("lp"), userId, lessonId, lessonStatus, lessonPct, lessonStatus === "completed" ? ts : null, ts);
      });
    }

    enroll("new_associate", "diamond-gemstone-fluency", 60, "in_progress");
    enroll("new_associate", "fine-jewelry-sales-conversation", 20, "in_progress");
    enroll("luxury_advisor", "fine-jewelry-sales-conversation", 100, "completed");
    enroll("luxury_advisor", "diamond-gemstone-fluency", 100, "completed");
    enroll("bridal_specialist", "bridal-engagement-mastery", 80, "in_progress");
    enroll("bridal_specialist", "diamond-gemstone-fluency", 100, "completed");
    enroll("cruise_specialist", "fine-jewelry-sales-conversation", 45, "in_progress");
    enroll("gemologist_seller", "diamond-gemstone-fluency", 100, "completed");
    enroll("store_manager", "store-operations-retail-kpis", 100, "completed");
    enroll("trainer", "training-design-roleplay-facilitation", 100, "completed");
    enroll("learner_extra_1", "fine-jewelry-sales-conversation", 30, "in_progress");
    enroll("learner_extra_2", "diamond-gemstone-fluency", 15, "in_progress");
    enroll("learner_extra_3", "bridal-engagement-mastery", 50, "in_progress");

    // --- Quiz attempts (demo) ---
    function findQuiz(courseKey: string) {
      return db
        .prepare("SELECT id FROM quizzes WHERE course_id = ?")
        .get(courseIds[courseKey]) as { id: string } | undefined;
    }
    const quizAttemptSeeds = [
      { userKey: "new_associate", courseKey: "diamond-gemstone-fluency", score: 8, total: 10 },
      { userKey: "luxury_advisor", courseKey: "fine-jewelry-sales-conversation", score: 9, total: 10 },
      { userKey: "luxury_advisor", courseKey: "diamond-gemstone-fluency", score: 10, total: 10 },
      { userKey: "bridal_specialist", courseKey: "diamond-gemstone-fluency", score: 9, total: 10 },
      { userKey: "gemologist_seller", courseKey: "diamond-gemstone-fluency", score: 10, total: 10 },
      { userKey: "store_manager", courseKey: "store-operations-retail-kpis", score: 9, total: 10 },
      { userKey: "trainer", courseKey: "training-design-roleplay-facilitation", score: 10, total: 10 },
      { userKey: "learner_extra_1", courseKey: "fine-jewelry-sales-conversation", score: 6, total: 10 },
    ];
    for (const attempt of quizAttemptSeeds) {
      const quiz = findQuiz(attempt.courseKey);
      if (!quiz) continue;
      db.prepare(
        `INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, answers, passed, started_at, completed_at)
         VALUES (?,?,?,?,?,?,?,?,?)`
      ).run(
        newId("qa"),
        quiz.id,
        userIds[attempt.userKey],
        attempt.score,
        attempt.total,
        toJson({}),
        attempt.score / attempt.total >= 0.7 ? 1 : 0,
        ts,
        ts
      );
      activityLog.push({ userKey: attempt.userKey, type: "quiz_completed", refId: quiz.id, summary: `Scored ${attempt.score}/${attempt.total} on a quiz` });
    }

    // --- Role-play attempts (demo) ---
    function scenarioByIndex(i: number) {
      return scenarioIds[i % scenarioIds.length];
    }
    const roleplayAttemptSeeds = [
      { userKey: "new_associate", scenarioIdx: 0, overall: 72 },
      { userKey: "luxury_advisor", scenarioIdx: 1, overall: 91 },
      { userKey: "cruise_specialist", scenarioIdx: 8, overall: 84 },
      { userKey: "bridal_specialist", scenarioIdx: 5, overall: 88 },
      { userKey: "learner_extra_2", scenarioIdx: 2, overall: 65 },
    ];
    for (const rp of roleplayAttemptSeeds) {
      const scenarioId = scenarioByIndex(rp.scenarioIdx);
      const transcript = [
        { role: "client", text: SEED_ROLEPLAYS[rp.scenarioIdx % SEED_ROLEPLAYS.length].clientOpening, ts },
        { role: "learner", text: "Thanks for sharing that — tell me a bit more about what you're looking for today.", ts },
        { role: "client", text: "I suppose I could use some help narrowing things down.", ts },
      ];
      const scores = {
        discovery_questions: Math.round(rp.overall / 10),
        product_accuracy: Math.round(rp.overall / 10) - 1,
        plain_language: Math.round(rp.overall / 10),
        empathy_trust: Math.round(rp.overall / 10),
        feature_benefit_emotion: Math.round(rp.overall / 10) - 1,
        objection_handling: Math.round(rp.overall / 10) - 1,
        ethical_closing: Math.round(rp.overall / 10),
        compliance_awareness: Math.round(rp.overall / 10),
      };
      db.prepare(
        `INSERT INTO role_play_attempts (id, scenario_id, user_id, transcript, scores, overall_score, strengths, improvements, recommended_next, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).run(
        newId("rpa"),
        scenarioId,
        userIds[rp.userKey],
        toJson(transcript),
        toJson(scores),
        rp.overall,
        toJson(["Warm, genuine tone", "Good use of open-ended discovery question"]),
        toJson(["Could tie product features back to the client's stated needs more explicitly"]),
        "Practice a feature-benefit-emotion focused scenario next.",
        ts
      );
      activityLog.push({ userKey: rp.userKey, type: "roleplay_completed", refId: scenarioId, summary: `Completed a role-play with a score of ${rp.overall}` });
    }

    // --- Floor task logs (demo) ---
    const floorTaskLogSeeds = [
      { userKey: "new_associate", taskIdx: 0, status: "completed" },
      { userKey: "new_associate", taskIdx: 1, status: "practiced" },
      { userKey: "luxury_advisor", taskIdx: 3, status: "completed" },
      { userKey: "luxury_advisor", taskIdx: 4, status: "used_with_client" },
      { userKey: "bridal_specialist", taskIdx: 5, status: "needs_manager_feedback" },
      { userKey: "cruise_specialist", taskIdx: 2, status: "planned" },
      { userKey: "gemologist_seller", taskIdx: 11, status: "completed" },
      { userKey: "store_manager", taskIdx: 6, status: "completed" },
      { userKey: "store_manager", taskIdx: 7, status: "completed" },
      { userKey: "learner_extra_1", taskIdx: 0, status: "not_started" },
      { userKey: "learner_extra_2", taskIdx: 10, status: "planned" },
      { userKey: "learner_extra_3", taskIdx: 8, status: "used_with_client" },
    ];
    for (const log of floorTaskLogSeeds) {
      const taskId = floorTaskIds[log.taskIdx];
      const isVerified = log.status === "completed" && Math.random() > 0.5;
      db.prepare(
        `INSERT INTO floor_task_logs (id, task_id, user_id, status, reflection_notes, evidence, manager_verified_by, manager_verified_at, due_date, completed_at, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      ).run(
        newId("ftl"),
        taskId,
        userIds[log.userKey],
        log.status,
        log.status === "completed" || log.status === "used_with_client" ? "Applied this successfully with a real client and felt confident." : null,
        null,
        isVerified ? userIds["store_manager"] : null,
        isVerified ? ts : null,
        ts,
        log.status === "completed" ? ts : null,
        ts,
        ts
      );
      if (log.status === "completed") {
        activityLog.push({ userKey: log.userKey, type: "task_completed", refId: taskId, summary: "Completed a floor-application task" });
      }
    }

    // --- Learner assignments ---
    const assignmentSeeds: { userKey: string; type: string; refKey: string; title: string; due: string; status: string }[] = [
      { userKey: "new_associate", type: "course", refKey: "diamond-gemstone-fluency", title: "Complete Diamond & Gemstone Fluency", due: "2026-09-20", status: "in_progress" },
      { userKey: "new_associate", type: "course", refKey: "fine-jewelry-sales-conversation", title: "Complete Fine-Jewelry Sales Conversation", due: "2026-09-30", status: "in_progress" },
      { userKey: "learner_extra_1", type: "course", refKey: "fine-jewelry-sales-conversation", title: "Complete Fine-Jewelry Sales Conversation", due: "2026-09-15", status: "in_progress" },
      { userKey: "learner_extra_2", type: "course", refKey: "diamond-gemstone-fluency", title: "Complete Diamond & Gemstone Fluency", due: "2026-09-10", status: "overdue" },
      { userKey: "learner_extra_3", type: "course", refKey: "bridal-engagement-mastery", title: "Complete Bridal & Engagement Mastery", due: "2026-09-25", status: "in_progress" },
      { userKey: "bridal_specialist", type: "course", refKey: "bridal-engagement-mastery", title: "Complete Bridal & Engagement Mastery", due: "2026-09-18", status: "in_progress" },
      { userKey: "cruise_specialist", type: "course", refKey: "fine-jewelry-sales-conversation", title: "Complete Fine-Jewelry Sales Conversation", due: "2026-09-22", status: "in_progress" },
      { userKey: "gemologist_seller", type: "course", refKey: "bridal-engagement-mastery", title: "Explore Bridal & Engagement Mastery", due: "2026-10-05", status: "not_started" },
      { userKey: "new_associate", type: "roleplay", refKey: "", title: "Practice 'Is lab-grown a real diamond?' role-play", due: "2026-09-12", status: "not_started" },
      { userKey: "learner_extra_1", type: "roleplay", refKey: "", title: "Practice 'I need to think about it.' role-play", due: "2026-09-14", status: "not_started" },
      { userKey: "luxury_advisor", type: "task", refKey: "", title: "Use one ethical closing technique", due: "2026-09-08", status: "completed" },
      { userKey: "cruise_specialist", type: "task", refKey: "", title: "Practice the travel-retail time-pressure scenario", due: "2026-09-11", status: "in_progress" },
      { userKey: "learner_extra_2", type: "task", refKey: "", title: "Explain the 4Cs using two products", due: "2026-09-09", status: "overdue" },
      { userKey: "learner_extra_3", type: "quiz", refKey: "", title: "Retake the Bridal & Engagement Mastery final assessment", due: "2026-09-19", status: "not_started" },
      { userKey: "bridal_specialist", type: "task", refKey: "", title: "Complete a bridal appointment-preparation checklist", due: "2026-09-16", status: "in_progress" },
    ];

    for (const a of assignmentSeeds) {
      const refId = a.type === "course" && a.refKey ? courseIds[a.refKey] : newId("ref");
      db.prepare(
        `INSERT INTO learner_assignments (id, user_id, assigned_by, assignment_type, ref_id, title, due_date, status, created_at)
         VALUES (?,?,?,?,?,?,?,?,?)`
      ).run(newId("asg"), userIds[a.userKey], userIds["store_manager"], a.type, refId, a.title, a.due, a.status, ts);
    }

    // --- Coaching notes (8+) ---
    const coachingNotes = [
      { learnerKey: "new_associate", skill: "diamond_gemstone_knowledge", note: "Mia is progressing well through the 4Cs lesson. Recommend she practices explaining clarity in plain language during her next floor shift.", visibility: "shared_with_learner" },
      { learnerKey: "new_associate", skill: "objection_handling", note: "Observed Mia handle a light price objection reasonably well but could use more confidence — schedule a role-play practice session.", visibility: "manager" },
      { learnerKey: "luxury_advisor", skill: "clienteling", note: "Julian's CRM notes are excellent — detailed and thoughtful. Great model for newer associates.", visibility: "shared_with_learner" },
      { learnerKey: "bridal_specialist", skill: "bridal", note: "Priya ran a strong bridal appointment this week; client specifically praised her patience with the partner-approval conversation.", visibility: "shared_with_learner" },
      { learnerKey: "cruise_specialist", skill: "sales_conversations", note: "Ana handled a time-pressured client well but could tighten her discovery questions to save even more time.", visibility: "manager" },
      { learnerKey: "gemologist_seller", skill: "diamond_gemstone_knowledge", note: "Devon continues to be the strongest resource for technical gemstone questions on the floor.", visibility: "shared_with_learner" },
      { learnerKey: "learner_extra_1", skill: "sales_conversations", note: "Grace needs more practice with the feature-benefit-emotion structure — recommend the specific lesson and a follow-up role-play.", visibility: "manager" },
      { learnerKey: "learner_extra_2", skill: "product_accuracy", note: "Owen is behind on the Diamond & Gemstone Fluency course; check in on his weekly availability and offer support.", visibility: "manager" },
    ];
    for (const c of coachingNotes) {
      db.prepare(
        "INSERT INTO coaching_notes (id, manager_id, learner_id, skill_area, note, visibility, created_at) VALUES (?,?,?,?,?,?,?)"
      ).run(newId("note"), userIds["store_manager"], userIds[c.learnerKey], c.skill, c.note, c.visibility, ts);
    }

    // --- Manager observations ---
    const observations = [
      { learnerKey: "luxury_advisor", skill: "Ethical Closing", score: 92, verified: 1, taskIdx: 4 },
      { learnerKey: "new_associate", skill: "4Cs Client Explanation", score: 78, verified: 1, taskIdx: 1 },
      { learnerKey: "gemologist_seller", skill: "GIA Report Walkthrough", score: 95, verified: 1, taskIdx: 11 },
      { learnerKey: "bridal_specialist", skill: "Bridal Appointment Readiness", score: 88, verified: 0, taskIdx: 5 },
    ];
    for (const o of observations) {
      db.prepare(
        `INSERT INTO manager_observations (id, manager_id, learner_id, skill, rubric, score, notes, verified, related_task_id, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).run(
        newId("obs"),
        userIds["store_manager"],
        userIds[o.learnerKey],
        o.skill,
        toJson({ accuracy: 4, confidence: 4, clientRapport: 5 }),
        o.score,
        "Observed directly on the sales floor during a live client interaction.",
        o.verified,
        floorTaskIds[o.taskIdx],
        ts
      );
    }

    // --- Badges earned + certificates ---
    function awardBadge(userKey: string, badgeKey: string, verified: boolean) {
      db.prepare(
        "INSERT INTO user_badges (id, user_id, badge_id, earned_at, verified_by) VALUES (?,?,?,?,?)"
      ).run(newId("ub"), userIds[userKey], badgeIds[badgeKey], ts, verified ? userIds["store_manager"] : null);
      activityLog.push({ userKey, type: "badge_earned", refId: badgeIds[badgeKey], summary: `Earned the "${SEED_BADGES.find((b) => b.key === badgeKey)?.title}" badge` });
    }
    awardBadge("luxury_advisor", "ethical-objection-handler", true);
    awardBadge("luxury_advisor", "diamond-report-interpreter", false);
    awardBadge("bridal_specialist", "bridal-appointment-ready", false);
    awardBadge("gemologist_seller", "gemstone-terminology-master", false);
    awardBadge("gemologist_seller", "diamond-report-interpreter", false);
    awardBadge("new_associate", "4cs-client-explainer", true);
    awardBadge("store_manager", "store-operations-ready", false);
    awardBadge("store_manager", "coach-roleplay-facilitator", true);
    awardBadge("trainer", "coach-roleplay-facilitator", true);
    awardBadge("cruise_specialist", "high-ticket-travel-retail-closer", false);

    function issueCertificate(userKey: string, courseKey: string | null, badgeKey: string | null, level: string, title: string, status: string) {
      db.prepare(
        `INSERT INTO certificates (id, cert_uid, user_id, course_id, badge_id, level, title, verification_status, issued_at)
         VALUES (?,?,?,?,?,?,?,?,?)`
      ).run(
        newId("cert"),
        certUid(),
        userIds[userKey],
        courseKey ? courseIds[courseKey] : null,
        badgeKey ? badgeIds[badgeKey] : null,
        level,
        title,
        status,
        ts
      );
      activityLog.push({ userKey, type: "cert_issued", refId: courseKey || badgeKey || "", summary: `Earned certificate: ${title}` });
    }
    issueCertificate("luxury_advisor", "fine-jewelry-sales-conversation", null, "course_completion", "Fine-Jewelry Sales Conversation — Course Completion", "issued");
    issueCertificate("luxury_advisor", "diamond-gemstone-fluency", null, "course_completion", "Diamond & Gemstone Fluency — Course Completion", "issued");
    issueCertificate("luxury_advisor", null, "ethical-objection-handler", "manager_verified", "Ethical Objection Handler — Manager Verified", "manager_verified");
    issueCertificate("gemologist_seller", "diamond-gemstone-fluency", null, "course_completion", "Diamond & Gemstone Fluency — Course Completion", "issued");
    issueCertificate("bridal_specialist", "diamond-gemstone-fluency", null, "course_completion", "Diamond & Gemstone Fluency — Course Completion", "issued");
    issueCertificate("store_manager", "store-operations-retail-kpis", null, "course_completion", "Store Operations & Retail KPIs — Course Completion", "issued");
    issueCertificate("trainer", "training-design-roleplay-facilitation", null, "course_completion", "Training Design & Role-Play Facilitation — Course Completion", "issued");
    issueCertificate("store_manager", null, "coach-roleplay-facilitator", "manager_verified", "Coach & Role-Play Facilitator — Manager Verified", "manager_verified");

    // --- Toolkit favorites & recent views ---
    const favSeeds = [
      { userKey: "new_associate", toolIdx: 0 },
      { userKey: "new_associate", toolIdx: 4 },
      { userKey: "luxury_advisor", toolIdx: 10 },
      { userKey: "bridal_specialist", toolIdx: 12 },
      { userKey: "cruise_specialist", toolIdx: 11 },
      { userKey: "store_manager", toolIdx: 16 },
    ];
    for (const f of favSeeds) {
      db.prepare(
        "INSERT INTO toolkit_favorites (id, user_id, resource_id, note, created_at) VALUES (?,?,?,?,?)"
      ).run(newId("fav"), userIds[f.userKey], toolkitIds[f.toolIdx], null, ts);
      db.prepare(
        "INSERT INTO toolkit_recent_views (id, user_id, resource_id, viewed_at) VALUES (?,?,?,?)"
      ).run(newId("view"), userIds[f.userKey], toolkitIds[f.toolIdx], ts);
    }

    // --- Lesson notes & bookmarks (demo) ---
    const firstLessonId = lessonIdsByCourse["diamond-gemstone-fluency"][0];
    db.prepare(
      "INSERT INTO lesson_notes (id, user_id, lesson_id, content, created_at, updated_at) VALUES (?,?,?,?,?,?)"
    ).run(newId("lnote"), userIds["new_associate"], firstLessonId, "Remember: lead with cut, not carat, when a client seems price-sensitive.", ts, ts);
    db.prepare(
      "INSERT INTO lesson_bookmarks (id, user_id, lesson_id, created_at) VALUES (?,?,?,?)"
    ).run(newId("lbm"), userIds["new_associate"], firstLessonId, ts);

    // --- Activity log (ensure at least 10 entries) ---
    for (const a of activityLog) {
      db.prepare(
        "INSERT INTO activity_log (id, user_id, activity_type, ref_id, summary, created_at) VALUES (?,?,?,?,?,?)"
      ).run(newId("act"), userIds[a.userKey], a.type, a.refId, a.summary, ts);
    }
  });

  insertMany();
}
