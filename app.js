"use strict";

const CONFIG = window.SNT_SENIOR_CONFIG || {};
const ENGINE = window.SNTSeniorQuestionEngine;
const GROUP_ID = CONFIG.groupId || "snt-dynamic-math-grades-7-12";
const SUBJECT_LABELS = ENGINE?.SUBJECT_LABELS || {};
let db = null;
let publicStudents = [];
let learnerSession = null;
let learnerPortalData = null;
let activeAssignment = null;
let elapsedSeconds = 0;
let timerInterval = null;
let submissionInProgress = false;
let currentAttemptToken = null;
let lastSubmissionPayload = null;
let lastFocusedInput = null;
let teacherStudents = [];
let teacherAssignments = [];
let teacherResults = [];
let assignmentPreview = null;
let repeatSourceId = null;

function el(id) { return document.getElementById(id); }
function cleanText(value, max = 200) { return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max); }
function normalizeCode(value) { return cleanText(value, 40).toUpperCase().replace(/\s+/g, ""); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c])); }
function formatDuration(seconds) { const s = Math.max(0, Number(seconds) || 0); const m = Math.floor(s / 60); return m ? `${m}m ${s % 60}s` : `${s}s`; }
function formatDate(value) { if (!value) return "—"; return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function uuid() { return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`; }
function subjectLabel(track) { return SUBJECT_LABELS[track] || track || "—"; }
function topicLabel(topic) { return ENGINE?.TOPIC_LABELS?.[topic] || topic || "—"; }
function subtopicLabel(subtopic) { return ENGINE?.SUBTOPIC_LABELS?.[subtopic] || subtopic || "—"; }
function setMessage(id, text, type = "") { const node = el(id); if (!node) return; node.textContent = text || ""; node.className = `form-message${type ? ` ${type}` : ""}`; }
function csvCell(value) { let text = String(value ?? ""); if (/^[=+\-@]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; }
function safeJson(value, fallback) { if (value && typeof value === "object") return value; try { return JSON.parse(value); } catch { return fallback; } }

function initialiseSupabase() {
  const configured = /^https:\/\//.test(CONFIG.supabaseUrl || "") && !String(CONFIG.supabaseUrl).includes("PASTE_") && String(CONFIG.supabasePublishableKey || "").length > 20 && !String(CONFIG.supabasePublishableKey).includes("PASTE_");
  if (!configured || !window.supabase) {
    el("setupWarning").classList.remove("hidden");
    el("setupWarning").innerHTML = "<strong>Setup needed:</strong> create the separate Supabase project, run the numbered SQL scripts, then paste its URL and publishable key into <code>config.js</code>.";
    el("connectionBadge").textContent = "Setup needed";
    el("connectionBadge").classList.add("bad");
    return false;
  }
  db = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey);
  el("connectionBadge").textContent = "Supabase connected";
  el("connectionBadge").classList.add("ok");
  return true;
}

function showPage(page) {
  el("learnerPage").classList.toggle("hidden", page !== "learner");
  el("teacherPage").classList.toggle("hidden", page !== "teacher");
  document.querySelectorAll(".main-nav-btn").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
  if (page === "teacher") checkTeacherSession();
}

async function loadPublicStudents() {
  if (!db) return;
  const select = el("studentSelect");
  select.disabled = true;
  select.innerHTML = '<option value="">Loading learners…</option>';
  try {
    const { data, error } = await db.rpc("senior_list_public_learners", { p_group_id: GROUP_ID });
    if (error) throw error;
    publicStudents = data || [];
    select.innerHTML = '<option value="">Choose your nickname</option>';
    publicStudents.forEach((student) => {
      const option = document.createElement("option");
      option.value = student.student_id;
      option.textContent = `${student.display_name} — Grade ${student.grade} ${student.subject_track === "math_literacy" ? "Math Lit" : "Math"}`;
      select.appendChild(option);
    });
    if (!publicStudents.length) select.innerHTML = '<option value="">No active learners yet</option>';
    select.disabled = !publicStudents.length;
  } catch (error) {
    console.error(error);
    select.innerHTML = '<option value="">Learner list could not load</option>';
    setMessage("learnerLoginMessage", error.message || "Learner list could not load.", "error");
  }
}

async function openLearnerPortal() {
  const studentId = el("studentSelect").value;
  const code = normalizeCode(el("studentCode").value);
  if (!studentId) return setMessage("learnerLoginMessage", "Choose your nickname.", "error");
  if (code.length < 2) return setMessage("learnerLoginMessage", "Enter your private learner code.", "error");
  el("openLearnerBtn").disabled = true;
  setMessage("learnerLoginMessage", "Opening your quiz plan…");
  try {
    const { data, error } = await db.rpc("senior_open_learner_portal", { p_student_id: studentId, p_student_code: code, p_group_id: GROUP_ID });
    if (error) throw error;
    if (!data?.student) throw new Error("Nickname and code did not match.");
    learnerSession = { studentId, code, student: data.student };
    learnerPortalData = data;
    el("learnerLoginPanel").classList.add("hidden");
    el("learnerPortal").classList.remove("hidden");
    el("learnerStatus").textContent = "Logged in";
    showLearnerTab("plan");
    renderLearnerPortal();
  } catch (error) {
    console.error(error);
    setMessage("learnerLoginMessage", error.message || "Learner login failed.", "error");
  } finally { el("openLearnerBtn").disabled = false; }
}

function learnerLogout() {
  clearInterval(timerInterval);
  learnerSession = null;
  learnerPortalData = null;
  activeAssignment = null;
  currentAttemptToken = null;
  lastSubmissionPayload = null;
  el("studentCode").value = "";
  el("learnerPortal").classList.add("hidden");
  el("learnerLoginPanel").classList.remove("hidden");
  el("learnerStatus").textContent = "Not logged in";
  el("timerDisplay").classList.add("hidden");
  setMessage("learnerLoginMessage", "");
}

function showLearnerTab(tab) {
  el("learnerPlanTab").classList.toggle("hidden", tab !== "plan");
  el("learnerResultsTab").classList.toggle("hidden", tab !== "results");
  el("learnerLeaderboardTab").classList.toggle("hidden", tab !== "leaderboard");
  document.querySelectorAll(".learner-tab").forEach((button) => button.classList.toggle("active", button.dataset.learnerTab === tab));
  if (tab === "results") loadMyResults();
  if (tab === "leaderboard") loadLeaderboard();
}

async function refreshLearnerPortal() {
  if (!learnerSession) return;
  try {
    const { data, error } = await db.rpc("senior_open_learner_portal", { p_student_id: learnerSession.studentId, p_student_code: learnerSession.code, p_group_id: GROUP_ID });
    if (error) throw error;
    learnerPortalData = data;
    learnerSession.student = data.student;
    renderLearnerPortal();
  } catch (error) { alert(error.message || "Could not refresh your quiz plan."); }
}

function renderLearnerPortal() {
  const student = learnerSession.student;
  el("learnerWelcome").textContent = student.display_name;
  el("learnerProfile").textContent = `Grade ${student.grade} • ${subjectLabel(student.subject_track)}`;
  const assignments = learnerPortalData.assignments || [];
  activeAssignment = assignments.find((item) => item.status === "waiting") || null;
  el("learnerQueue").innerHTML = assignments.map((item, index) => `<article class="queue-card ${activeAssignment?.assignment_id === item.assignment_id ? "active" : ""}"><div class="queue-order">${item.position || index + 1}</div><div><strong>${escapeHtml(item.title)}</strong><div class="queue-meta">Grade ${item.grade} • ${escapeHtml(topicLabel(item.topic))} • ${escapeHtml(subtopicLabel(item.subtopic))} • ${item.question_count} questions • ${escapeHtml(item.difficulty)}</div></div><span class="status-pill ${item.status === "completed" ? "completed" : "waiting"}">${item.status === "completed" ? "Completed" : activeAssignment?.assignment_id === item.assignment_id ? "Next" : "Waiting"}</span></article>`).join("");
  el("queueMessage").classList.toggle("hidden", assignments.length > 0);
  el("queueMessage").textContent = assignments.length ? "" : "No quizzes have been allocated yet.";
  el("resultsPanel").classList.add("hidden");
  if (activeAssignment) renderActiveAssignment();
  else {
    clearInterval(timerInterval);
    el("activeAssignmentPanel").classList.add("hidden");
    el("learnerNoQuiz").classList.remove("hidden");
    el("timerDisplay").classList.add("hidden");
  }
}

function renderActiveAssignment() {
  clearInterval(timerInterval);
  currentAttemptToken = uuid();
  lastSubmissionPayload = null;
  submissionInProgress = false;
  el("activeAssignmentPanel").classList.remove("hidden");
  el("learnerNoQuiz").classList.add("hidden");
  el("activeAssignmentTitle").textContent = activeAssignment.title;
  el("activeAssignmentMeta").textContent = `${subjectLabel(activeAssignment.subject_track)} • Grade ${activeAssignment.grade}`;
  el("activeAssignmentInfo").textContent = `${topicLabel(activeAssignment.topic)} • ${subtopicLabel(activeAssignment.subtopic)} • ${activeAssignment.quiz_type} • ${activeAssignment.difficulty} • ${activeAssignment.total_marks} marks${activeAssignment.time_limit_minutes ? ` • ${activeAssignment.time_limit_minutes} min limit` : ""}`;
  const questions = safeJson(activeAssignment.question_payload, []);
  renderQuestionForm(questions);
  el("submitQuizBtn").disabled = false;
  el("submitQuizBtn").textContent = "Submit and Mark";
  el("retrySaveBtn").classList.add("hidden");
  el("nextQuizBtn").classList.remove("hidden");
  startTimer();
}

function renderQuestionForm(questions) {
  const form = el("quizForm");
  form.innerHTML = "";
  questions.forEach((question) => {
    const card = document.createElement("section");
    card.className = "question-card";
    card.dataset.questionId = question.id;
    card.innerHTML = `<div class="question-number">Question ${question.number} • ${question.marks} mark${question.marks === 1 ? "" : "s"}</div>${question.contextHtml ? `<div class="question-context">${question.contextHtml}</div>` : ""}<div class="question-prompt">${question.promptHtml}</div><div class="answer-row">${renderQuestionInput(question)}</div><div class="correction"></div>`;
    form.appendChild(card);
  });
  form.querySelectorAll("input,select").forEach((input) => {
    input.addEventListener("input", updateProgress);
    input.addEventListener("change", updateProgress);
    input.addEventListener("focus", () => { lastFocusedInput = input; });
  });
  updateProgress();
}

function renderQuestionInput(question) {
  const id = escapeHtml(question.id);
  if (question.responseType === "fraction") return `<div class="fraction-input"><input data-qid="${id}" data-part="num" inputmode="numeric" aria-label="Numerator"><div class="fraction-line"></div><input data-qid="${id}" data-part="den" inputmode="numeric" aria-label="Denominator"></div>`;
  if (question.responseType === "choice") return `<select data-qid="${id}" data-part="value"><option value="">Choose an answer</option>${(question.choices || []).map((choice) => `<option value="${escapeHtml(choice)}">${escapeHtml(choice)}</option>`).join("")}</select>`;
  if (question.responseType === "pair") return (question.fields || []).map((field) => `<label class="field-stack">${escapeHtml(field.label)}<input data-qid="${id}" data-part="${escapeHtml(field.key)}" inputmode="decimal"></label>`).join("");
  if (question.responseType === "coefficient_map") return `<div class="coefficient-grid">${(question.fields || []).map((field) => `<label class="field-stack">${escapeHtml(field.label)}<input data-qid="${id}" data-part="${escapeHtml(field.key)}" inputmode="numeric" placeholder="0"></label>`).join("")}</div>`;
  if (question.responseType === "factor_pair") return `<div class="factor-template">(x + <input data-qid="${id}" data-part="p" inputmode="numeric" aria-label="First constant">)(x + <input data-qid="${id}" data-part="q" inputmode="numeric" aria-label="Second constant">)</div>`;
  return `<label class="field-stack">${escapeHtml(question.answerLabel || "Answer")}<input data-qid="${id}" data-part="value" inputmode="${question.inputMode || "decimal"}"></label>${question.unit ? `<span class="soft-badge">${escapeHtml(question.unit)}</span>` : ""}`;
}

function collectResponses() {
  const questions = safeJson(activeAssignment.question_payload, []);
  return questions.map((question) => {
    const inputs = [...el("quizForm").querySelectorAll(`[data-qid="${CSS.escape(question.id)}"]`)];
    const response = {};
    inputs.forEach((input) => { response[input.dataset.part || "value"] = input.value.trim(); });
    return { id: question.id, response };
  });
}

function updateProgress() {
  const cards = [...el("quizForm").querySelectorAll(".question-card")];
  let answered = 0;
  cards.forEach((card) => {
    const inputs = [...card.querySelectorAll("input,select")];
    const complete = inputs.length > 0 && inputs.every((input) => input.value.trim() !== "");
    card.classList.toggle("answered", complete);
    if (complete) answered += 1;
  });
  el("progressText").textContent = `${answered} of ${cards.length} answered`;
  el("progressBar").style.width = `${cards.length ? answered / cards.length * 100 : 0}%`;
}

function insertSymbol(symbol) {
  if (!lastFocusedInput || !el("quizForm").contains(lastFocusedInput)) return;
  const start = lastFocusedInput.selectionStart ?? lastFocusedInput.value.length;
  const end = lastFocusedInput.selectionEnd ?? start;
  lastFocusedInput.value = `${lastFocusedInput.value.slice(0, start)}${symbol}${lastFocusedInput.value.slice(end)}`;
  lastFocusedInput.focus();
  lastFocusedInput.setSelectionRange?.(start + symbol.length, start + symbol.length);
  updateProgress();
}

function startTimer() {
  elapsedSeconds = 0;
  updateTimerDisplay();
  el("timerDisplay").classList.remove("hidden");
  timerInterval = setInterval(() => { elapsedSeconds += 1; updateTimerDisplay(); }, 1000);
}
function updateTimerDisplay() { const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0"), s = String(elapsedSeconds % 60).padStart(2, "0"); el("timerDisplay").textContent = `⏱ ${m}:${s}`; }

async function submitActiveQuiz() {
  if (!activeAssignment || !learnerSession || submissionInProgress) return;
  const responses = collectResponses();
  const unanswered = responses.filter((item) => Object.values(item.response).some((value) => value === "")).length;
  if (unanswered && !confirm(`${unanswered} question(s) are incomplete. Submit anyway?`)) return;
  lastSubmissionPayload = { attemptToken: currentAttemptToken, assignmentId: activeAssignment.assignment_id, responses, durationSeconds: elapsedSeconds };
  await performSave();
}

async function retrySave() { if (!lastSubmissionPayload || submissionInProgress) return; lastSubmissionPayload.responses = collectResponses(); lastSubmissionPayload.durationSeconds = elapsedSeconds; await performSave(); }

async function performSave() {
  submissionInProgress = true;
  el("submitQuizBtn").disabled = true;
  el("submitQuizBtn").textContent = "Saving and marking…";
  el("retrySaveBtn").classList.add("hidden");
  try {
    const { data, error } = await db.rpc("senior_submit_assignment", {
      p_attempt_token: lastSubmissionPayload.attemptToken,
      p_assignment_id: lastSubmissionPayload.assignmentId,
      p_student_id: learnerSession.studentId,
      p_student_code: learnerSession.code,
      p_group_id: GROUP_ID,
      p_duration_seconds: lastSubmissionPayload.durationSeconds,
      p_responses: lastSubmissionPayload.responses
    });
    if (error) throw error;
    clearInterval(timerInterval);
    el("timerDisplay").classList.add("hidden");
    markQuestionCards(data.details || []);
    el("quizForm").querySelectorAll("input,select").forEach((input) => { input.disabled = true; });
    el("submitQuizBtn").textContent = "Result Saved";
    el("resultScore").textContent = `${data.percentage}%`;
    el("resultHeading").textContent = data.percentage >= 80 ? "Excellent work!" : data.percentage >= 60 ? "Good work!" : "Keep practising!";
    el("resultSummary").textContent = `${data.score}/${data.total_marks} marks • ${formatDuration(lastSubmissionPayload.durationSeconds)}`;
    el("resultRank").textContent = data.leaderboard_position ? `Overall leaderboard position: ${data.leaderboard_position}` : "";
    el("saveStatus").textContent = data.already_saved ? "This attempt was already saved safely." : "✓ Result saved securely.";
    el("resultsPanel").classList.remove("hidden");
    el("activeAssignmentPanel").classList.add("hidden");
  } catch (error) {
    console.error(error);
    el("submitQuizBtn").disabled = false;
    el("submitQuizBtn").textContent = "Submit and Mark";
    el("retrySaveBtn").classList.remove("hidden");
    el("nextQuizBtn").classList.add("hidden");
    el("saveStatus").textContent = `Saving failed: ${error.message || "Please try again."} Your answers are still here.`;
    el("resultsPanel").classList.remove("hidden");
    el("resultScore").textContent = "Not saved";
    el("resultHeading").textContent = "Your answers are safe";
    el("resultSummary").textContent = "Check your connection and press Retry Saving.";
  } finally { submissionInProgress = false; }
}

function markQuestionCards(details) {
  const map = new Map((details || []).map((detail) => [detail.id, detail]));
  el("quizForm").querySelectorAll(".question-card").forEach((card) => {
    const detail = map.get(card.dataset.questionId);
    if (!detail) return;
    card.classList.add("marked", detail.is_correct ? "correct" : "incorrect");
    card.querySelector(".correction").innerHTML = `<strong>${detail.is_correct ? "✓ Correct" : "✗ Incorrect"}</strong><br>Correct answer: ${escapeHtml(detail.correct_answer || "—")}<br>${detail.explanation_html || ""}`;
  });
}

async function continueToNextQuiz() {
  el("resultsPanel").classList.add("hidden");
  el("submitQuizBtn").disabled = false;
  el("submitQuizBtn").textContent = "Submit and Mark";
  await refreshLearnerPortal();
}

async function loadMyResults() {
  if (!learnerSession) return;
  try {
    const { data, error } = await db.rpc("senior_get_my_results", { p_student_id: learnerSession.studentId, p_student_code: learnerSession.code, p_group_id: GROUP_ID });
    if (error) throw error;
    const summary = data.summary || {};
    el("myLatest").textContent = `${summary.latest || 0}%`;
    el("myBest").textContent = `${summary.best || 0}%`;
    el("myAverage").textContent = `${summary.average || 0}%`;
    el("myCompleted").textContent = String(summary.completed || 0);
    el("myRank").textContent = `Overall position: ${summary.rank || "—"}`;
    const body = el("myResultsBody"); body.innerHTML = "";
    (data.history || []).forEach((row) => { const tr = document.createElement("tr"); [formatDate(row.completed_at), row.title, `Grade ${row.grade}`, topicLabel(row.topic), subtopicLabel(row.subtopic), `${row.percentage}%`, formatDuration(row.duration_seconds)].forEach((value) => addCell(tr, value)); body.appendChild(tr); });
    el("myResultsMessage").classList.toggle("hidden", (data.history || []).length > 0);
  } catch (error) { alert(error.message || "Could not load your results."); }
}

async function loadLeaderboard() {
  if (!learnerSession) return;
  const grade = el("leaderboardGrade").value || "all";
  const topic = el("leaderboardTopic").value || "all";
  try {
    const { data, error } = await db.rpc("senior_get_leaderboard", { p_student_id: learnerSession.studentId, p_student_code: learnerSession.code, p_group_id: GROUP_ID, p_grade: grade === "all" ? null : Number(grade), p_topic: topic === "all" ? null : topic });
    if (error) throw error;
    const body = el("leaderboardBody"); body.innerHTML = "";
    (data || []).forEach((row) => { const tr = document.createElement("tr"); const medal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : row.rank; [medal, row.display_name, `Grade ${row.grade}`, `${row.best_score}%`, `${row.average_score}%`, row.quizzes_completed].forEach((value) => addCell(tr, value)); body.appendChild(tr); });
    el("leaderboardMessage").classList.toggle("hidden", (data || []).length > 0);
  } catch (error) { alert(error.message || "Could not load the leaderboard."); }
}

async function checkTeacherSession() {
  if (!db) return;
  const { data: { session } } = await db.auth.getSession();
  if (!session) return;
  const { data, error } = await db.rpc("senior_is_current_teacher");
  if (!error && data === true) openTeacherDashboard();
}

async function teacherSignIn() {
  const email = cleanText(el("teacherEmail").value, 150), password = el("teacherPassword").value;
  if (!email || !password) return setMessage("teacherLoginMessage", "Enter email and password.", "error");
  el("teacherLoginBtn").disabled = true;
  setMessage("teacherLoginMessage", "Signing in…");
  try {
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const check = await db.rpc("senior_is_current_teacher");
    if (check.error || check.data !== true) { await db.auth.signOut(); throw new Error("This Auth user is not registered as an active senior maths teacher."); }
    await openTeacherDashboard();
  } catch (error) { setMessage("teacherLoginMessage", error.message || "Sign-in failed.", "error"); }
  finally { el("teacherLoginBtn").disabled = false; }
}

async function openTeacherDashboard() {
  const { data: { user } } = await db.auth.getUser();
  el("teacherWelcome").textContent = `Welcome, ${user?.email || "Teacher"}`;
  el("teacherLoginPanel").classList.add("hidden");
  el("teacherDashboard").classList.remove("hidden");
  showTeacherTab("scores");
  await loadTeacherDashboardData();
}

async function teacherSignOut() { await db.auth.signOut(); el("teacherDashboard").classList.add("hidden"); el("teacherLoginPanel").classList.remove("hidden"); setMessage("teacherLoginMessage", "Signed out.", "success"); }

function showTeacherTab(tab) {
  el("teacherScoresTab").classList.toggle("hidden", tab !== "scores");
  el("teacherLearnersTab").classList.toggle("hidden", tab !== "learners");
  el("teacherAssignTab").classList.toggle("hidden", tab !== "assign");
  document.querySelectorAll(".teacher-tab").forEach((button) => button.classList.toggle("active", button.dataset.teacherTab === tab));
}

async function loadTeacherDashboardData() {
  try {
    const { data, error } = await db.rpc("senior_teacher_dashboard", { p_group_id: GROUP_ID });
    if (error) throw error;
    teacherStudents = data.students || [];
    teacherAssignments = data.assignments || [];
    teacherResults = data.results || [];
    populateTeacherSelectors();
    renderLearners();
    renderTeacherAssignments();
    renderTeacherScores();
  } catch (error) { alert(error.message || "Could not load teacher dashboard data."); }
}

function populateTeacherSelectors() {
  // Preserve selections before rebuilding dropdown options. Rebuilding a <select>
  // automatically selects its first item, which previously reset allocations to Grade 7.
  const currentStudentId = el("assignStudent").value;
  const currentEditGrade = el("editGrade").value;
  const currentScoreGrade = el("scoreGradeFilter").value;
  const currentLeaderboardGrade = el("leaderboardGrade").value;
  const currentScoreTopic = el("scoreTopicFilter").value;
  const currentLeaderboardTopic = el("leaderboardTopic").value;

  el("assignStudent").innerHTML = '<option value="">Choose learner</option>' + teacherStudents.filter((s) => s.active).map((s) => `<option value="${s.id}">${escapeHtml(s.display_name)} — Grade ${s.grade} ${s.subject_track === "math_literacy" ? "Math Lit" : "Math"}</option>`).join("");
  const selectedStudent = teacherStudents.find((s) => s.id === currentStudentId && s.active);
  if (selectedStudent) el("assignStudent").value = selectedStudent.id;

  const grades = [7,8,9,10,11,12];
  el("editGrade").innerHTML = grades.map((g) => `<option value="${g}">Grade ${g}</option>`).join("");
  if (grades.includes(Number(currentEditGrade))) el("editGrade").value = currentEditGrade;

  el("assignGrade").innerHTML = grades.map((g) => `<option value="${g}">Grade ${g}</option>`).join("");
  el("scoreGradeFilter").innerHTML = '<option value="all">All grades</option>' + grades.map((g) => `<option value="${g}">Grade ${g}</option>`).join("");
  el("leaderboardGrade").innerHTML = '<option value="all">All grades</option>' + grades.map((g) => `<option value="${g}">Grade ${g}</option>`).join("");
  if (["all", ...grades.map(String)].includes(currentScoreGrade)) el("scoreGradeFilter").value = currentScoreGrade;
  if (["all", ...grades.map(String)].includes(currentLeaderboardGrade)) el("leaderboardGrade").value = currentLeaderboardGrade;

  const allTopics = new Map();
  ["mathematics", "math_literacy"].forEach((subject) => grades.forEach((grade) => ENGINE.getTopics(subject, grade).forEach((topic) => allTopics.set(topic.id, topic.label))));
  const topicOptions = [...allTopics.entries()].sort((a,b) => a[1].localeCompare(b[1])).map(([id,label]) => `<option value="${id}">${escapeHtml(label)}</option>`).join("");
  el("scoreTopicFilter").innerHTML = '<option value="all">All topics</option>' + topicOptions;
  el("leaderboardTopic").innerHTML = '<option value="all">All topics</option>' + topicOptions;
  if ([...el("scoreTopicFilter").options].some((o) => o.value === currentScoreTopic)) el("scoreTopicFilter").value = currentScoreTopic;
  if ([...el("leaderboardTopic").options].some((o) => o.value === currentLeaderboardTopic)) el("leaderboardTopic").value = currentLeaderboardTopic;

  if (selectedStudent) {
    // Always restore the selected learner's actual grade and subject after a dashboard reload.
    el("assignGrade").value = String(selectedStudent.grade);
    el("assignSubjectTrack").value = selectedStudent.subject_track;
    el("assignGrade").disabled = true;
    el("assignSubjectTrack").disabled = true;
    syncAssignmentCatalog();
  } else {
    el("assignGrade").disabled = false;
    el("assignSubjectTrack").disabled = false;
    if (!el("assignGrade").value) el("assignGrade").value = "7";
    syncAssignmentCatalog();
  }
}

function syncLearnerSubjectOptions() {
  const grade = Number(el("editGrade").value || 7);
  const current = el("editSubjectTrack").value;
  const options = grade >= 10 ? [{ id: "mathematics", label: "Mathematics" }, { id: "math_literacy", label: "Mathematical Literacy" }] : [{ id: "mathematics", label: "Mathematics" }];
  el("editSubjectTrack").innerHTML = options.map((o) => `<option value="${o.id}">${o.label}</option>`).join("");
  if (options.some((o) => o.id === current)) el("editSubjectTrack").value = current;
}

function clearLearnerEditor() { el("editStudentId").value = ""; el("editFullName").value = ""; el("editDisplayName").value = ""; el("editGrade").value = "7"; syncLearnerSubjectOptions(); el("editCode").value = ""; el("editActive").checked = true; setMessage("learnerEditorMessage", ""); }
function editLearner(id) { const s = teacherStudents.find((item) => item.id === id); if (!s) return; el("editStudentId").value = s.id; el("editFullName").value = s.full_name; el("editDisplayName").value = s.display_name; el("editGrade").value = String(s.grade); syncLearnerSubjectOptions(); el("editSubjectTrack").value = s.subject_track; el("editCode").value = ""; el("editActive").checked = s.active; el("teacherLearnersTab").scrollIntoView({ behavior: "smooth" }); }

async function saveLearner() {
  const id = el("editStudentId").value || null, fullName = cleanText(el("editFullName").value, 100), displayName = cleanText(el("editDisplayName").value, 60), code = normalizeCode(el("editCode").value), grade = Number(el("editGrade").value), subjectTrack = el("editSubjectTrack").value;
  if (!fullName || !displayName) return setMessage("learnerEditorMessage", "Full name and nickname are required.", "error");
  if (!id && code.length < 2) return setMessage("learnerEditorMessage", "A private code is required for a new learner.", "error");
  try {
    const { error } = await db.rpc("senior_teacher_save_learner", { p_student_id: id, p_group_id: GROUP_ID, p_full_name: fullName, p_display_name: displayName, p_grade: grade, p_subject_track: subjectTrack, p_new_code: code, p_active: el("editActive").checked });
    if (error) throw error;
    setMessage("learnerEditorMessage", "✓ Learner saved.", "success");
    clearLearnerEditor();
    await loadTeacherDashboardData();
    await loadPublicStudents();
  } catch (error) { setMessage("learnerEditorMessage", error.message || "Could not save learner.", "error"); }
}

function renderLearners() {
  const search = el("learnerSearch").value.trim().toLowerCase();
  const rows = teacherStudents.filter((s) => !search || `${s.full_name} ${s.display_name}`.toLowerCase().includes(search));
  el("learnersBody").innerHTML = rows.map((s) => `<tr><td>${escapeHtml(s.full_name)}</td><td>${escapeHtml(s.display_name)}</td><td>Grade ${s.grade}</td><td>${escapeHtml(subjectLabel(s.subject_track))}</td><td><span class="status-pill ${s.active ? "completed" : "cancelled"}">${s.active ? "Active" : "Inactive"}</span></td><td><button class="ghost-btn small-btn" type="button" onclick="editLearner('${s.id}')">Edit</button></td></tr>`).join("");
  el("learnersMessage").classList.toggle("hidden", rows.length > 0);
}

function syncAssignmentLearner() {
  const student = teacherStudents.find((s) => s.id === el("assignStudent").value);
  if (!student) return renderTeacherAssignments();
  el("assignGrade").value = String(student.grade);
  el("assignSubjectTrack").value = student.subject_track;
  el("assignGrade").disabled = true;
  el("assignSubjectTrack").disabled = true;
  syncAssignmentCatalog();
  renderTeacherAssignments();
}
function syncAssignmentCatalog() {
  const subject = el("assignSubjectTrack").value, grade = Number(el("assignGrade").value || 7);
  if (subject === "math_literacy" && grade < 10) el("assignSubjectTrack").value = "mathematics";
  const topics = ENGINE.getTopics(el("assignSubjectTrack").value, grade);
  el("assignTopic").innerHTML = topics.map((t) => `<option value="${t.id}">${escapeHtml(t.label)}</option>`).join("");
  syncAssignmentSubtopics();
}
function syncAssignmentSubtopics() {
  const subs = ENGINE.getSubtopics(el("assignSubjectTrack").value, Number(el("assignGrade").value), el("assignTopic").value);
  el("assignSubtopic").innerHTML = subs.map((s) => `<option value="${s.id}">${escapeHtml(s.label)}</option>`).join("");
  renderTopicSettings();
}
function renderTopicSettings() {
  const schema = ENGINE.getSettingSchema(el("assignTopic").value, el("assignSubtopic").value);
  el("topicSettings").innerHTML = schema.map((field) => {
    if (field.type === "checkbox") return `<label class="checkbox-label"><input type="checkbox" data-setting="${field.key}" ${field.default ? "checked" : ""}> ${escapeHtml(field.label)}</label>`;
    const options = field.options.map((value) => `<option value="${value}" ${String(value) === String(field.default) ? "selected" : ""}>${escapeHtml(field.optionLabels?.[value] || value)}</option>`).join("");
    return `<label>${escapeHtml(field.label)}<select data-setting="${field.key}">${options}</select></label>`;
  }).join("");
}
function collectTopicSettings() { const settings = {}; el("topicSettings").querySelectorAll("[data-setting]").forEach((node) => { settings[node.dataset.setting] = node.type === "checkbox" ? node.checked : (/^-?\d+(\.\d+)?$/.test(node.value) ? Number(node.value) : node.value); }); return settings; }

function generateAssignmentPreview() {
  const student = teacherStudents.find((s) => s.id === el("assignStudent").value);
  if (!student) return setMessage("assignmentMessage", "Choose a learner first.", "error");
  try {
    assignmentPreview = ENGINE.generateAssignment({ subjectTrack: el("assignSubjectTrack").value, grade: Number(el("assignGrade").value), topic: el("assignTopic").value, subtopic: el("assignSubtopic").value, quizType: el("assignQuizType").value, difficulty: el("assignDifficulty").value, questionCount: Number(el("assignQuestionCount").value), settings: collectTopicSettings(), seed: uuid() });
    el("previewTitle").textContent = cleanText(el("assignTitle").value, 120) || assignmentPreview.title;
    el("previewMeta").textContent = `${assignmentPreview.questionCount} questions • ${assignmentPreview.totalMarks} marks`;
    el("previewQuestions").innerHTML = assignmentPreview.questions.map((q) => `<article class="preview-question"><strong>${q.number}.</strong> ${q.contextHtml || ""}${q.promptHtml} <span class="soft-badge">${q.marks} mark${q.marks === 1 ? "" : "s"}</span></article>`).join("");
    el("assignmentPreview").classList.remove("hidden");
    el("saveAssignmentBtn").disabled = false;
    setMessage("assignmentMessage", "Preview generated. Check it before saving.", "success");
  } catch (error) { setMessage("assignmentMessage", error.message || "Could not generate quiz.", "error"); }
}

async function saveAssignment() {
  if (!assignmentPreview) return;
  const studentId = el("assignStudent").value, title = cleanText(el("assignTitle").value, 120) || assignmentPreview.title, editingId = el("editingAssignmentId").value || null;
  const common = { p_group_id: GROUP_ID, p_student_id: studentId, p_title: title, p_grade: assignmentPreview.grade, p_subject_track: assignmentPreview.subjectTrack, p_topic: assignmentPreview.topic, p_subtopic: assignmentPreview.subtopic, p_quiz_type: assignmentPreview.quizType, p_difficulty: assignmentPreview.difficulty, p_question_count: assignmentPreview.questionCount, p_time_limit_minutes: Number(el("assignTimeLimit").value || 0), p_settings: assignmentPreview.settings, p_seed: assignmentPreview.seed, p_generator_version: assignmentPreview.generatorVersion, p_question_payload: assignmentPreview.questions, p_answer_key: assignmentPreview.answerKey, p_total_marks: assignmentPreview.totalMarks };
  try {
    let result;
    if (editingId) result = await db.rpc("senior_teacher_edit_assignment", { p_assignment_id: editingId, ...common });
    else if (repeatSourceId) result = await db.rpc("senior_teacher_repeat_assignment", { p_source_assignment_id: repeatSourceId, ...common });
    else result = await db.rpc("senior_teacher_create_assignment", common);
    if (result.error) throw result.error;
    setMessage("assignmentMessage", editingId ? "✓ Waiting allocation updated without changing its queue position." : "✓ Quiz added to the end of the learner queue.", "success");
    cancelAssignmentEdit(false);
    await loadTeacherDashboardData();
  } catch (error) { setMessage("assignmentMessage", error.message || "Could not save allocation.", "error"); }
}

function cancelAssignmentEdit(clearMessage = true) {
  el("editingAssignmentId").value = ""; repeatSourceId = null; assignmentPreview = null; el("assignmentPreview").classList.add("hidden"); el("saveAssignmentBtn").disabled = true; el("saveAssignmentBtn").textContent = "Add to queue"; el("cancelEditBtn").classList.add("hidden"); el("assignStudent").disabled = false; el("assignGrade").disabled = false; el("assignSubjectTrack").disabled = false; if (el("assignStudent").value) syncAssignmentLearner(); if (clearMessage) setMessage("assignmentMessage", "");
}

function startEditAssignment(id) {
  const a = teacherAssignments.find((item) => item.id === id && item.status === "waiting"); if (!a) return;
  el("editingAssignmentId").value = a.id; repeatSourceId = null; el("assignStudent").value = a.student_id; el("assignStudent").disabled = true; el("assignGrade").value = String(a.grade); el("assignSubjectTrack").value = a.subject_track; el("assignGrade").disabled = true; el("assignSubjectTrack").disabled = true; syncAssignmentCatalog(); el("assignTopic").value = a.topic; syncAssignmentSubtopics(); el("assignSubtopic").value = a.subtopic; renderTopicSettings(); applySettingsToForm(a.settings); el("assignQuizType").value = a.quiz_type; el("assignDifficulty").value = a.difficulty; el("assignQuestionCount").value = String(a.question_count); el("assignTimeLimit").value = String(a.time_limit_minutes || 0); el("assignTitle").value = a.title; assignmentPreview = { generatorVersion: a.generator_version, seed: a.seed, subjectTrack: a.subject_track, grade: a.grade, topic: a.topic, subtopic: a.subtopic, quizType: a.quiz_type, difficulty: a.difficulty, settings: a.settings || {}, questionCount: a.question_count, totalMarks: a.total_marks, title: a.title, questions: safeJson(a.question_payload, []), answerKey: safeJson(a.answer_key, []) }; renderExistingPreview(); el("saveAssignmentBtn").disabled = false; el("saveAssignmentBtn").textContent = "Save changes"; el("cancelEditBtn").classList.remove("hidden"); el("teacherAssignTab").scrollIntoView({ behavior: "smooth" });
}
function applySettingsToForm(settings) { Object.entries(settings || {}).forEach(([key, value]) => { const node = el("topicSettings").querySelector(`[data-setting="${CSS.escape(key)}"]`); if (!node) return; if (node.type === "checkbox") node.checked = Boolean(value); else node.value = String(value); }); }
function renderExistingPreview() { el("previewTitle").textContent = assignmentPreview.title; el("previewMeta").textContent = `${assignmentPreview.questionCount} questions • ${assignmentPreview.totalMarks} marks`; el("previewQuestions").innerHTML = assignmentPreview.questions.map((q) => `<article class="preview-question"><strong>${q.number}.</strong> ${q.contextHtml || ""}${q.promptHtml}</article>`).join(""); el("assignmentPreview").classList.remove("hidden"); }

function prepareRepeatAssignment(id) {
  const a = teacherAssignments.find((item) => item.id === id); if (!a) return;
  cancelAssignmentEdit(false); repeatSourceId = a.id; el("assignStudent").value = a.student_id; syncAssignmentLearner(); el("assignTopic").value = a.topic; syncAssignmentSubtopics(); el("assignSubtopic").value = a.subtopic; renderTopicSettings(); applySettingsToForm(a.settings); el("assignQuizType").value = a.quiz_type; el("assignDifficulty").value = a.difficulty; el("assignQuestionCount").value = String(a.question_count); el("assignTimeLimit").value = String(a.time_limit_minutes || 0); el("assignTitle").value = `Repeat: ${a.title}`.slice(0,120); generateAssignmentPreview(); el("cancelEditBtn").classList.remove("hidden"); el("teacherAssignTab").scrollIntoView({ behavior: "smooth" });
}

async function moveAssignment(id, direction) { const { error } = await db.rpc("senior_teacher_move_assignment", { p_assignment_id: id, p_direction: Number(direction) }); if (error) return alert(error.message); await loadTeacherDashboardData(); }
async function removeAssignment(id) { if (!confirm("Remove this waiting quiz?")) return; const { error } = await db.rpc("senior_teacher_remove_assignment", { p_assignment_id: id }); if (error) return alert(error.message); await loadTeacherDashboardData(); }

function renderTeacherAssignments() {
  const studentId = el("assignStudent").value;
  const rows = teacherAssignments.filter((a) => a.student_id === studentId);
  const waiting = rows.filter((a) => a.status === "waiting").sort((a,b) => a.queue_position - b.queue_position);
  const completed = rows.filter((a) => a.status === "completed").sort((a,b) => new Date(b.completed_at) - new Date(a.completed_at));
  el("waitingAssignmentsBody").innerHTML = waiting.map((a) => `<tr><td>${a.queue_position}</td><td>${escapeHtml(a.title)}</td><td>${escapeHtml(topicLabel(a.topic))}</td><td>${escapeHtml(subtopicLabel(a.subtopic))}</td><td>${escapeHtml(a.quiz_type)}</td><td>${a.question_count}</td><td>${escapeHtml(a.difficulty)}<br><small>${escapeHtml(JSON.stringify(a.settings || {}))}</small></td><td><span class="status-pill waiting">Waiting</span></td><td><div class="action-row"><button class="ghost-btn small-btn" onclick="moveAssignment('${a.id}',-1)">↑</button><button class="ghost-btn small-btn" onclick="moveAssignment('${a.id}',1)">↓</button><button class="ghost-btn small-btn" onclick="startEditAssignment('${a.id}')">Edit</button><button class="ghost-btn small-btn" onclick="removeAssignment('${a.id}')">Remove</button><button class="ghost-btn small-btn" onclick="printAllocatedQuiz('${a.id}')">PDF</button></div></td></tr>`).join("");
  el("completedAssignmentsBody").innerHTML = completed.map((a) => `<tr><td>${escapeHtml(a.title)}</td><td>${escapeHtml(topicLabel(a.topic))}</td><td>${escapeHtml(subtopicLabel(a.subtopic))}</td><td>${a.result_percentage == null ? "—" : `${a.result_percentage}%`}</td><td>${formatDate(a.completed_at)}</td><td><button class="ghost-btn small-btn" onclick="prepareRepeatAssignment('${a.id}')">Allocate again</button> <button class="ghost-btn small-btn" onclick="printAllocatedQuiz('${a.id}')">Quiz PDF</button>${a.result_id ? ` <button class="ghost-btn small-btn" onclick="printCompletedAttempt('${a.result_id}')">Attempt PDF</button>` : ""}</td></tr>`).join("");
  el("waitingAssignmentsMessage").classList.toggle("hidden", Boolean(studentId) && waiting.length > 0); el("waitingAssignmentsMessage").textContent = studentId ? (waiting.length ? "" : "No waiting quizzes for this learner.") : "Choose a learner.";
  el("completedAssignmentsMessage").classList.toggle("hidden", completed.length > 0);
}

function syncScoreSubtopics() {
  const topic = el("scoreTopicFilter").value; const values = new Map(); teacherAssignments.filter((a) => topic === "all" || a.topic === topic).forEach((a) => values.set(a.subtopic, subtopicLabel(a.subtopic)));
  el("scoreSubtopicFilter").innerHTML = '<option value="all">All subtopics</option>' + [...values.entries()].map(([id,label]) => `<option value="${id}">${escapeHtml(label)}</option>`).join("");
}
function filteredTeacherResults() {
  const search = el("scoreSearch").value.trim().toLowerCase(), grade = el("scoreGradeFilter").value, subject = el("scoreSubjectFilter").value, topic = el("scoreTopicFilter").value, subtopic = el("scoreSubtopicFilter").value, quizType = el("scoreQuizTypeFilter").value;
  return teacherResults.filter((r) => (!search || `${r.full_name} ${r.display_name}`.toLowerCase().includes(search)) && (grade === "all" || String(r.grade) === grade) && (subject === "all" || r.subject_track === subject) && (topic === "all" || r.topic === topic) && (subtopic === "all" || r.subtopic === subtopic) && (quizType === "all" || r.quiz_type === quizType));
}
function renderTeacherScores() {
  const rows = filteredTeacherResults(); const groups = new Map(); rows.forEach((r) => { if (!groups.has(r.student_id)) groups.set(r.student_id, []); groups.get(r.student_id).push(r); });
  const summaries = [...groups.values()].map((attempts) => { attempts.sort((a,b) => new Date(b.completed_at) - new Date(a.completed_at)); const p = attempts.map((a) => Number(a.percentage)); return { latest: attempts[0], best: Math.max(...p), average: Math.round(p.reduce((a,b) => a+b,0)/p.length), attempts: attempts.length }; });
  el("teacherSummaryBody").innerHTML = summaries.map((s) => `<tr><td>${escapeHtml(s.latest.full_name)}</td><td>Grade ${s.latest.grade}</td><td>${escapeHtml(subjectLabel(s.latest.subject_track))}</td><td>${s.latest.percentage}%</td><td>${s.best}%</td><td>${s.average}%</td><td>${s.attempts}</td><td>${escapeHtml(topicLabel(s.latest.topic))}</td></tr>`).join("");
  el("teacherAttemptsBody").innerHTML = rows.map((r) => `<tr><td>${escapeHtml(r.full_name)}</td><td>Grade ${r.grade}</td><td>${escapeHtml(r.title)}</td><td>${escapeHtml(topicLabel(r.topic))}</td><td>${escapeHtml(subtopicLabel(r.subtopic))}</td><td>${escapeHtml(r.quiz_type)}</td><td>${r.score}/${r.total_marks} (${r.percentage}%)</td><td>${formatDuration(r.duration_seconds)}</td><td>${formatDate(r.completed_at)}</td><td><button class="ghost-btn small-btn" onclick="printCompletedAttempt('${r.result_id}')">PDF</button></td></tr>`).join("");
  const percentages = rows.map((r) => Number(r.percentage)); el("teacherStudentCount").textContent = String(summaries.length); el("teacherAttemptCount").textContent = String(rows.length); el("teacherAttemptAverage").textContent = rows.length ? `${Math.round(percentages.reduce((a,b) => a+b,0)/rows.length)}%` : "0%"; el("teacherLearnerAverage").textContent = summaries.length ? `${Math.round(summaries.reduce((a,b) => a+b.average,0)/summaries.length)}%` : "0%"; el("teacherHighest").textContent = rows.length ? `${Math.max(...percentages)}%` : "0%"; el("teacherSummaryMessage").classList.toggle("hidden", summaries.length > 0); el("teacherAttemptsMessage").classList.toggle("hidden", rows.length > 0);
}
function addCell(row, value) { const td = document.createElement("td"); td.textContent = value == null || value === "" ? "—" : String(value); row.appendChild(td); }
function downloadScoresCsv() { const rows = filteredTeacherResults(); if (!rows.length) return alert("No scores to export."); const header = ["Learner","Nickname","Grade","Subject","Title","Topic","Subtopic","Quiz Type","Difficulty","Score","Total","Percentage","Time Seconds","Completed"]; const lines = [header.map(csvCell).join(",")]; rows.forEach((r) => lines.push([r.full_name,r.display_name,r.grade,subjectLabel(r.subject_track),r.title,topicLabel(r.topic),subtopicLabel(r.subtopic),r.quiz_type,r.difficulty,r.score,r.total_marks,r.percentage,r.duration_seconds,r.completed_at].map(csvCell).join(","))); const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `snt-dynamic-math-senior-scores-${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

function printAllocatedQuiz(id) {
  const a = teacherAssignments.find((item) => item.id === id); if (!a) return;
  const questions = safeJson(a.question_payload, []);
  const html = `<h1>${escapeHtml(a.title)}</h1><p>Grade ${a.grade} • ${escapeHtml(subjectLabel(a.subject_track))}<br>${escapeHtml(topicLabel(a.topic))} • ${escapeHtml(subtopicLabel(a.subtopic))}<br>${a.question_count} questions • ${a.total_marks} marks</p>${questions.map((q) => `<section><h3>Question ${q.number} [${q.marks}]</h3>${q.contextHtml || ""}<p>${q.promptHtml}</p><div class="answer-space"></div></section>`).join("")}`;
  openPrintDocument(`${a.title} — Allocated Quiz`, html);
}

async function printCompletedAttempt(resultId) {
  try {
    const { data, error } = await db.rpc("senior_teacher_attempt_pdf_data", { p_result_id: resultId }); if (error) throw error;
    const html = `<h1>${escapeHtml(data.title)}</h1><p><strong>Learner:</strong> ${escapeHtml(data.display_name)}<br><strong>Grade:</strong> ${data.grade}<br><strong>Topic:</strong> ${escapeHtml(topicLabel(data.topic))}<br><strong>Subtopic:</strong> ${escapeHtml(subtopicLabel(data.subtopic))}<br><strong>Quiz type:</strong> ${escapeHtml(data.quiz_type)}<br><strong>Score:</strong> ${data.score}/${data.total_marks} (${data.percentage}%)<br><strong>Time:</strong> ${formatDuration(data.duration_seconds)}<br><strong>Completed:</strong> ${formatDate(data.completed_at)}</p>${(data.questions || []).map((q, i) => { const d = (data.details || []).find((x) => x.id === q.id) || {}; const r = (data.responses || []).find((x) => x.id === q.id)?.response || {}; return `<section><h3>Question ${i + 1} ${d.is_correct ? "✓" : "✗"}</h3>${q.contextHtml || ""}<p>${q.promptHtml}</p><p><strong>Learner answer:</strong> ${escapeHtml(formatResponse(r))}<br><strong>Correct answer:</strong> ${escapeHtml(d.correct_answer || "—")}</p></section>`; }).join("")}`;
    openPrintDocument(`${data.title} — Completed Attempt`, html);
  } catch (error) { alert(error.message || "Could not prepare the completed-attempt PDF."); }
}
function formatResponse(response) { if (!response || typeof response !== "object") return String(response || "—"); return Object.values(response).filter((v) => v !== "").join("; ") || "Blank"; }
function openPrintDocument(title, content) { const w = window.open("", "_blank"); if (!w) return alert("Allow pop-ups to export the PDF."); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;color:#111;max-width:850px;margin:25px auto;line-height:1.5}h1{border-bottom:3px solid #4f46e5;padding-bottom:8px}section{page-break-inside:avoid;margin:22px 0;padding-bottom:12px;border-bottom:1px solid #ddd}.fraction{display:inline-grid;grid-template-rows:auto auto;text-align:center;line-height:1}.fraction>span:first-child{border-bottom:1px solid #000}.answer-space{height:55px;border-bottom:1px dotted #aaa}@media print{button{display:none}}</style></head><body>${content}<p><button onclick="window.print()">Print / Save as PDF</button></p></body></html>`); w.document.close(); }


function populateStaticFilters() {
  const grades = [7,8,9,10,11,12];
  el("leaderboardGrade").innerHTML = '<option value="all">All grades</option>' + grades.map((g) => `<option value="${g}">Grade ${g}</option>`).join("");
  const allTopics = new Map();
  ["mathematics", "math_literacy"].forEach((subject) => grades.forEach((grade) => ENGINE.getTopics(subject, grade).forEach((topic) => allTopics.set(topic.id, topic.label))));
  const options = [...allTopics.entries()].sort((a,b) => a[1].localeCompare(b[1])).map(([id,label]) => `<option value="${id}">${escapeHtml(label)}</option>`).join("");
  el("leaderboardTopic").innerHTML = '<option value="all">All topics</option>' + options;
}

async function init() {
  if (!ENGINE) { el("setupWarning").classList.remove("hidden"); el("setupWarning").textContent = "Question engine could not load."; return; }
  populateStaticFilters();
  syncLearnerSubjectOptions();
  if (!initialiseSupabase()) return;
  await loadPublicStudents();
  await checkTeacherSession();
}

init();
