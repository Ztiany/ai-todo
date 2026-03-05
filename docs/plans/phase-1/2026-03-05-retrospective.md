# Phase 1 Retrospective - AI Todo

**Date:** 2026-03-05
**Duration:** ~3 hours
**Participants:** User + Claude Code (with Superpowers)

---

## 1. Project Summary

Successfully built an AI-powered todo list application with task breakdown capability.

**Final Deliverables:**
- Next.js 16 + React 19 + Tailwind CSS 4 frontend
- Supabase (PostgreSQL) backend
- MiniMax API integration for AI task breakdown
- 22 passing unit tests
- Clean git history (after security fix)

---

## 2. Interaction Timeline

### Phase 2.1: Initial Setup
- User provided requirements via /init command
- Brainstormed UI/UX preferences (dedicated AI input, parent-child task hierarchy, modern clean design)
- Created design document and implementation plan

### Phase 2.2: Implementation
- Initialized Next.js project
- Set up Supabase and OpenAI clients
- Created database table via Supabase MCP
- Implemented all API endpoints
- Built frontend components

### Phase 2.3: Debugging & Fixes
- Fixed multiple issues during E2E testing
- Hydration errors → Fixed by removing dynamic object keys
- API 405 errors → Added missing GET handler
- MiniMax model errors → Changed from gpt-4o-mini to MiniMax-M2.5
- AI response parsing → Added extractJsonFromResponse() for thinking tags

### Phase 2.4: Cleanup
- Discovered API keys exposed in documentation
- Removed sensitive info and reset git history
- Organized docs by phase

---

## 3. Pitfalls & Solutions

### Pitfall 1: Hydration Mismatch

**Problem:** React hydration error on page load
```
A tree hydrated but some attributes of the server rendered HTML didn't match
```

**Root Cause:**
- Dynamic object key access in LoadingSpinner: `sizeClasses[size]`
- Google Fonts in layout.tsx causing SSR/client mismatch
- Browser extension (Grammarly) injecting attributes

**Solution:**
- Replaced dynamic object access with ternary expressions
- Removed Google Fonts from layout.tsx
- Added `suppressHydrationWarning` to body tag

### Pitfall 2: API 405 Method Not Allowed

**Problem:** GET /api/todos returned 405 error

**Root Cause:** Only implemented POST handler, forgot GET

**Solution:** Added GET handler to /api/todos/route.ts

### Pitfall 3: MiniMax Model Name

**Problem:** `unknown model 'gpt-4o-mini'`

**Root Cause:** Using OpenAI model names with MiniMax proxy

**Solution:** Changed to MiniMax model: `MiniMax-M2.5`

### Pitfall 4: AI Response with Thinking Tags

**Problem:** JSON parse error - AI returned `<thinking>...</thinking>` before JSON

**Root Cause:** MiniMax AI includes reasoning/thinking in response

**Solution:** Created `extractJsonFromResponse()` function to extract JSON from various formats:
- Pure JSON
- Markdown code blocks
- Text with thinking tags

### Pitfall 5: API Key Exposure

**Problem:** Real API keys in documentation, committed to git

**Root Cause:** Added real keys to plan document

**Solution:**
- Replaced with placeholder values
- Deleted .git and reinitialized
- Added .env.local to .gitignore

---

## 4. Skills Used

| Skill | Purpose | When Used |
|-------|---------|-----------|
| brainstorming | Explore requirements before implementation | Initial design phase |
| systematic-debugging | Root cause analysis before fixing | Every bug encountered |
| verification-before-completion | Verify fixes before claiming success | After each bug fix |

---

## 5. Tools Used

### Claude Code Tools
- **Bash** - Terminal commands
- **Read/Write/Edit** - File operations
- **Glob/Grep** - Code search
- **Skill** - Invoke specialized skills
- **MCP Tools**:
  - `mcp__supabase__list_tables` - Database inspection
  - `mcp__supabase__execute_sql` - SQL execution

### External Tools
- **Git** - Version control
- **npm** - Package management
- **Vitest** - Unit testing

---

## 6. Key Learnings

### For the User

1. **Provide API details early**: Having real API keys in .env.local from the start would have avoided guesswork on model names

2. **Test incrementally**: Testing after each feature would catch issues faster

3. **Browser extension interference**: Be aware that extensions like Grammarly can cause hydration issues

4. **Git hygiene**: Never commit sensitive data, even to private repos

### For Future Sessions

1. **MiniMax API specifics**:
   - Model names: `MiniMax-M2.5`, `MiniMax-M2.1`, `MiniMax-M2`
   - Response may include `<thinking>` tags
   - Need to extract JSON manually

2. **Next.js 16 quirks**:
   - Turbopack lock errors common when dev server crashes
   - Fix: `rm -rf .next/dev/lock`
   - Hydration warnings common with dynamic content

3. **Supabase MCP**:
   - Use `execute_sql` for database setup
   - Use `list_tables` to verify structure

---

## 7. Communication Patterns That Worked

- **Clear requirement statements**: "I want X, not Y" helped avoid over-engineering
- **Step-by-step verification**: Testing after each fix prevented regression
- **Sharing error logs**: User sharing console errors helped debug faster
- **Using skills appropriately**: Invoking brainstorming before design, debugging before fixing

---

## 8. Areas for Improvement

1. **Earlier environment validation**: Should have verified MiniMax API model compatibility at setup phase

2. **More comprehensive tests**: Add E2E tests for critical user flows

3. **Error handling**: Better error messages to users (currently generic errors)

4. **Documentation**: Update CLAUDE.md with MiniMax-specific learnings

---

## 9. Recommendations for Phase 2

1. **Add environment validation script** - Check API keys and model compatibility on startup
2. **Add E2E tests** - Use Playwright or similar for critical flows
3. **Improve error messages** - Show user-friendly errors instead of generic ones
4. **Add loading states** - Better UX during API calls

---

## 10. Commands Reference

```bash
# Start dev server
npm run dev

# Run tests
npm run test:run

# Fix Turbopack lock
rm -rf .next/dev/lock

# Kill stuck process
taskkill //F //PID <process-id>
```

---

**This document will be updated in each phase retrospective.**
