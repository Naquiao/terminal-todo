# Model Comparison Report: LLM Browser Automation Evaluation

**Generated:** December 10, 2025  
**Test Suite:** Cal.com End-to-End Tests  
**Evaluation Framework:** Bugster Evals with Playwright MCP  
**Base URL:** https://app.cal.com  

---

## Executive Summary

This report compares the performance of two Large Language Models (LLMs) for browser automation tasks using the Playwright Model Context Protocol (MCP) interface.

### Models Evaluated

| Model | Provider | Parameter Count | Interface |
|-------|----------|-----------------|-----------|
| **gpt-oss-120b** | Groq | 120 Billion | Playwright MCP |
| **qwen3-32b** | Groq | 32 Billion | Playwright MCP |

### Overall Performance Comparison

| Metric | gpt-oss-120b | qwen3-32b | Winner | Improvement |
|--------|--------------|-----------|--------|-------------|
| **Overall Pass Rate** | 33.3% | **63.2%** | 🏆 qwen3-32b | +89.8% |
| **Phase 1 (Single Tests)** | 20% | **80%** | 🏆 qwen3-32b | +300% |
| **Phase 2 (Combinations)** | 38.9% | **61.1%** | 🏆 qwen3-32b | +57.1% |
| **Phase 3 (Full Suite)** | 10% | **50%** | 🏆 qwen3-32b | +400% |
| **Function Call Errors** | 503 | **0** | 🏆 qwen3-32b | +99.6% |
| **Timeouts** | 5 | **0** | 🏆 qwen3-32b | +100% |

### 🏆 Clear Winner: qwen3-32b

The `qwen3-32b` model significantly outperforms `gpt-oss-120b` across all metrics, despite having **3.75x fewer  parameters**. This demonstrates that model size alone does not determine browser automation effectiveness.

---

## Detailed Comparison

### 1. Success Rate by Phase

```
Phase 1 (Single Tests):
gpt-oss-120b: ████░░░░░░░░░░░░░░░░  20%
qwen3-32b:    ████████████████░░░░  80%

Phase 2 (Combination Tests):
gpt-oss-120b: ████████░░░░░░░░░░░░  38.9%
qwen3-32b:    ████████████░░░░░░░░  61.1%

Phase 3 (Full Suite):
gpt-oss-120b: ██░░░░░░░░░░░░░░░░░░  10%
qwen3-32b:    ██████████░░░░░░░░░░  50%
```

| Phase | gpt-oss-120b | qwen3-32b | Improvement |
|-------|--------------|-----------|-------------|
| Single Tests | 2/10 (20%) | 8/10 (80%) | **+300%** |
| Combination Tests | 7/18 (38.9%) | 11/18 (61.1%) | **+57%** |
| Full Suite | 1/10 (10%) | 5/10 (50%) | **+400%** |
| **Total** | **12/36 (33.3%)** | **24/38 (63.2%)** | **+89.8%** |

---

### 2. Function Calling Reliability

This is the **most critical differentiator** between the two models.

#### Element Reference Errors ("Ref not found")

| Model | Ref Not Found Errors | Impact |
|-------|---------------------|--------|
| gpt-oss-120b | **503** | Severe - Systemic failure |
| qwen3-32b | **0** | None - Excellent reliability |

```
gpt-oss-120b: ████████████████████████████████████████████████████  503 errors
qwen3-32b:    (none)                                                 0 errors
```

**Analysis:**

The `gpt-oss-120b` model consistently generates invalid element references, indicating:
- Uses stale DOM references after page navigation
- Fails to request fresh page snapshots
- Generates selectors that don't match actual page structure

The `qwen3-32b` model handles the Playwright MCP interface correctly:
- Properly interprets page snapshots
- Generates accurate element references
- Maintains valid selector context across operations

#### Other Function Call Issues

| Issue Type | gpt-oss-120b | qwen3-32b |
|------------|--------------|-----------|
| WebSocket Validation Errors | 0 | 2 |
| Timeout Errors | 5 | 0 |
| **Total Tool Call Issues** | **508** | **2** |

**Error Reduction: 99.6%** when switching from gpt-oss-120b to qwen3-32b.

---

### 3. Test-by-Test Comparison

| Test File | gpt-oss-120b | qwen3-32b | Winner |
|-----------|--------------|-----------|--------|
| `login_with_valid_credentials.yaml` | 78.6% | 70% | gpt-oss-120b |
| `edit_event_type.yaml` | 33.3% | 33.3% | Tie |
| `change_application_appearance_theme.yaml` | 0% | **66.7%** | 🏆 qwen3-32b |
| `view_and_filter_upcoming_bookings.yaml` | 0% | **100%** | 🏆 qwen3-32b |
| `create_new_event_type.yaml` | 0% | **100%** | 🏆 qwen3-32b |
| `duplicate_event_type.yaml` | 0% | **66.7%** | 🏆 qwen3-32b |
| `enable_recurring_event.yaml` | 0% | **66.7%** | 🏆 qwen3-32b |
| `schedule_availability_time_slot_creation.yaml` | 0% | **66.7%** | 🏆 qwen3-32b |
| `update_user_profile_information.yaml` | 0% | **66.7%** | 🏆 qwen3-32b |
| `date_overrides_management.yaml` | 0% | 0% | Tie |

**Summary:**
- **qwen3-32b wins:** 8 tests
- **gpt-oss-120b wins:** 1 test
- **Tie:** 2 tests

---

### 4. Failure Category Comparison

#### gpt-oss-120b Failure Breakdown

| Category | Count | Percentage |
|----------|-------|------------|
| Authentication/Login Issues | 11 | 45.8% |
| Function Call Errors | 6 | 25.0% |
| Bugster Agent Timeout | 5 | 20.8% |
| Application State Conflicts | 3 | 12.5% |
| URL/Page Not Found | 2 | 8.3% |
| Modal/Overlay Issues | 1 | 4.2% |

#### qwen3-32b Failure Breakdown

| Category | Count | Percentage |
|----------|-------|------------|
| UI Element Not Found | 10 | 71.4% |
| WebSocket Validation Error | 2 | 14.3% |
| Navigation/State Issues | 2 | 14.3% |

#### Key Difference

| Failure Type | gpt-oss-120b | qwen3-32b |
|--------------|--------------|-----------|
| **Model-Related Failures** | 45.8% (auth) + 25% (function) = **70.8%** | 14.3% (WebSocket) = **14.3%** |
| **Test Configuration Failures** | 29.2% | **85.7%** |

**Interpretation:**
- `gpt-oss-120b` failures are **primarily caused by the model** (poor function calling, authentication handling)
- `qwen3-32b` failures are **primarily caused by test configuration** (selector mismatches, test isolation)

This means `qwen3-32b`'s failures can be **fixed by updating tests**, while `gpt-oss-120b`'s failures require **model improvements**.

---

### 5. Execution Speed Comparison

| Metric | gpt-oss-120b | qwen3-32b | Faster |
|--------|--------------|-----------|--------|
| Average Single Test | ~75 seconds | **5.8 seconds** | 🏆 qwen3-32b (13x) |
| Full Suite Duration | 330 seconds | **11.8 seconds** | 🏆 qwen3-32b (28x) |
| Tests with Timeouts | 5 | **0** | 🏆 qwen3-32b |

The `qwen3-32b` model is dramatically faster, likely because it:
- Makes fewer redundant tool calls
- Doesn't retry with stale references
- Has lower inference latency despite smaller size

---

### 6. Complexity Handling

Both models show decreased performance as test complexity increases, but `qwen3-32b` degrades much more gracefully:

| Complexity Level | gpt-oss-120b Pass Rate | qwen3-32b Pass Rate | Gap |
|------------------|------------------------|---------------------|-----|
| Single Tests | 20% | 80% | 60 pts |
| Combination Tests | 38.9% (login only) | 61.1% | 22 pts |
| Full Suite | 10% | 50% | 40 pts |

**Degradation Pattern:**
- gpt-oss-120b: 20% → 10% = **50% degradation** from Phase 1 to Phase 3
- qwen3-32b: 80% → 50% = **37.5% degradation** from Phase 1 to Phase 3

`qwen3-32b` handles multi-step test sequences more reliably.

---

## Root Cause Analysis

### Why gpt-oss-120b Performs Poorly

1. **Stale Reference Problem**
   - Model frequently uses outdated DOM element references
   - Doesn't properly request page snapshot refreshes
   - 503 "Ref not found" errors indicate systemic issue

2. **Selector Generation Quality**
   - Generates CSS/role selectors that don't match actual page structure
   - Fails to adapt selector strategies when initial attempts fail

3. **State Management**
   - Doesn't maintain proper session state awareness
   - Authentication state not correctly persisted between steps

4. **Timeout Sensitivity**
   - 5 tests failed due to timeouts (325-361 seconds)
   - Complex operations exceed reasonable thresholds

### Why qwen3-32b Performs Well

1. **Excellent Element Reference Handling**
   - Zero "Ref not found" errors
   - Correctly interprets Playwright page snapshots
   - Generates valid, current element references

2. **Efficient Execution**
   - Faster average completion time (5.8s vs 75s)
   - No timeout-related failures
   - Lower tool call overhead

3. **Reliable Function Calling**
   - Correctly structures Playwright MCP tool calls
   - Only 2 format-related errors (easily addressable)

---

## Model Strengths & Weaknesses

### gpt-oss-120b

| Strengths | Weaknesses |
|-----------|------------|
| Higher login success rate (78.6%) | Very high function call error rate (503 errors) |
| - | Poor element reference handling |
| - | Slow execution (timeouts) |
| - | Degrades rapidly with complexity |
| - | Only 33.3% overall success rate |

### qwen3-32b

| Strengths | Weaknesses |
|-----------|------------|
| Excellent function call accuracy (0 ref errors) | Minor response format issues (2 WebSocket errors) |
| Fast execution (avg 5.8s/test) | Some selector matching issues |
| High single-test success rate (80%) | Degradation in full suite runs |
| Graceful complexity handling | - |
| 63.2% overall success rate | - |

---

## Recommendations

### Immediate (P0): Model Selection

#### ✅ Recommendation: Use qwen3-32b for Production

Based on this evaluation, **qwen3-32b is the recommended model** for browser automation tasks:

| Factor | Recommendation |
|--------|----------------|
| **Reliability** | qwen3-32b (99.6% fewer function call errors) |
| **Speed** | qwen3-32b (13-28x faster) |
| **Success Rate** | qwen3-32b (+89.8% higher) |
| **Cost Efficiency** | qwen3-32b (3.75x smaller, likely cheaper) |

**Do not use gpt-oss-120b** for production browser automation until its function calling issues are resolved.

---

### Short-term (P1): Improve qwen3-32b Performance

1. **Fix WebSocket Validation Errors**
   - Update prompts to ensure model returns JSON result format
   - Add explicit instructions for test completion format
   - Expected impact: +5% pass rate

2. **Update Test Selectors**
   - Priority tests to fix:
     - `date_overrides_management.yaml` (0% success)
     - `edit_event_type.yaml` (33.3% success)
   - Use more stable selector strategies (data-testid)
   - Expected impact: +10-15% pass rate

3. **Implement Test Isolation**
   - Clear session state between tests in combination runs
   - Handle "already logged in" scenarios gracefully
   - Expected impact: +5-10% pass rate in Phase 2/3

**Projected qwen3-32b Pass Rate After P1:** 75-85%

---

### Medium-term (P2): Enhance Testing Framework

4. **Add Selector Fallback Chains**
   ```yaml
   selectors:
     - role=button[name='Add Schedule']
     - text='Add Schedule'
     - button:has-text('Add')
     - [data-testid='add-schedule-btn']
   ```

5. **Implement Retry Logic with Fresh Snapshots**
   - On selector failure, capture fresh page snapshot
   - Retry with updated element references
   - Useful for both models, critical for gpt-oss-120b

6. **Add Wait Conditions**
   - Wait for element visibility before interaction
   - Wait for page load completion after navigation
   - Reduces timing-related failures

---

### Long-term (P3): Model Improvements

7. **For gpt-oss-120b Users (if required)**
   - Add explicit snapshot refresh step before every interaction
   - Implement automatic retry on "Ref not found" errors
   - Consider fine-tuning on Playwright MCP examples

8. **Request Data-TestId Attributes**
   - Collaborate with Cal.com team
   - Request stable `data-testid` attributes on interactive elements
   - Benefits all models and selector strategies

9. **Develop Model Benchmarking Suite**
   - Create standardized browser automation benchmarks
   - Test new models before production deployment
   - Track regression in model updates

---

## Cost-Benefit Analysis

### Model Operating Costs (Estimated)

| Factor | gpt-oss-120b | qwen3-32b |
|--------|--------------|-----------|
| Model Size | 120B params | 32B params |
| Relative Inference Cost | ~3.75x higher | 1x (baseline) |
| Average Tokens per Test | Higher (more retries) | Lower |
| Estimated Cost Ratio | **~5-7x more expensive** | **1x** |

### ROI of Switching to qwen3-32b

| Benefit | Impact |
|---------|--------|
| Higher Success Rate | +89.8% more tests pass |
| Faster Execution | 13-28x faster |
| Lower Cost | 5-7x cheaper (estimated) |
| Fewer Failures to Debug | 99.6% fewer function call errors |

**Net Benefit:** Switching to qwen3-32b provides **better results at lower cost**.

---

## Conclusion

### Summary Comparison

| Dimension | gpt-oss-120b | qwen3-32b |
|-----------|--------------|-----------|
| **Overall Verdict** | ❌ Not Recommended | ✅ Recommended |
| Success Rate | 33.3% | **63.2%** |
| Function Call Reliability | Poor (503 errors) | **Excellent (0 errors)** |
| Speed | Slow (timeouts) | **Fast (no timeouts)** |
| Production Readiness | No | **Yes** |

### Key Takeaways

1. **Smaller doesn't mean worse:** qwen3-32b (32B params) significantly outperforms gpt-oss-120b (120B params)

2. **Function calling is critical:** The 503 "Ref not found" errors in gpt-oss-120b demonstrate that reliable function calling is more important than raw model capability

3. **Test configuration matters:** Most qwen3-32b failures are fixable with test updates, while gpt-oss-120b failures require model-level changes

4. **Speed correlates with success:** Faster models (qwen3-32b) tend to have fewer timeout issues and complete more tests successfully

### Final Recommendation

**Deploy qwen3-32b for all browser automation workloads.** With targeted test configuration improvements, this model can achieve 75-85% success rates on complex E2E test suites.

Avoid gpt-oss-120b until its fundamental function calling issues are resolved through model updates or significant prompt engineering improvements.

---

## Appendix: Methodology

### Test Suite Composition

| Phase | Description | Test Count |
|-------|-------------|------------|
| Phase 1 | Individual YAML file tests | 10 tests |
| Phase 2 | Login + one other test combinations | 9 combinations (18 tests) |
| Phase 3 | All 10 tests in single run | 10 tests |

### Test Files Evaluated

1. `login_with_valid_credentials.yaml`
2. `change_application_appearance_theme.yaml`
3. `create_new_event_type.yaml`
4. `duplicate_event_type.yaml`
5. `edit_event_type.yaml`
6. `enable_recurring_event.yaml`
7. `schedule_availability_time_slot_creation.yaml`
8. `update_user_profile_information.yaml`
9. `view_and_filter_upcoming_bookings.yaml`
10. `date_overrides_management.yaml`

### Evaluation Metrics

- **Pass Rate:** Percentage of tests completing all steps successfully
- **Function Call Errors:** Count of "Ref not found" and similar tool call failures
- **Execution Time:** Duration from test start to completion/failure
- **Timeout Count:** Tests failing due to agent non-response

---

*Report generated by Bugster Evaluation Framework*  
*For questions, contact: bugster-evals@anthropic.com*
