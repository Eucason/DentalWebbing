#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '../progress.json');
const LOCK_PATH = path.join(__dirname, '../.tracker.lock');

// --- 1. CONCURRENCY CONTROL ---
function acquireLock() {
  if (fs.existsSync(LOCK_PATH)) {
    const lockTime = fs.readFileSync(LOCK_PATH, 'utf8');
    if (Date.now() - parseInt(lockTime, 10) < 300000) {
      console.error("🔒 [MUTEX LOCK] Operational state modification map locked by another active context session.");
      process.exit(1);
    }
  }
  fs.writeFileSync(LOCK_PATH, Date.now().toString());
}

function releaseLock() {
  if (fs.existsSync(LOCK_PATH)) {
    fs.unlinkSync(LOCK_PATH);
  }
}

process.on('SIGINT', () => { releaseLock(); process.exit(0); });
process.on('uncaughtException', (err) => {
  console.error("❌ Thread Fault Encountered:\n", err);
  releaseLock();
  process.exit(1);
});

// --- 2. MULTI-TENANT IMMUNE CONTROLS ---
function runArchitecturalAudits(taskId) {
  console.log(`🛡️  Evaluating architectural compliance metrics for task [${taskId}]...`);

  try {
    // Audit working directories for hardcoded patterns in git diff
    const diff = execSync('git diff HEAD -- "src/components/**" "src/pages/**"').toString();
    
    if (diff.trim().length === 0) {
      console.log("ℹ️  Staging area clean in presentational components. Bypassing regex verification grid.");
      return true;
    }

    // Rule 1 Verification: Ban static URL structures/IP addresses
    const domainPattern = /(https?:\/\/(?!localhost|127\.0\.0\.1)[a-zA-Z0-9-]+\.[a-zA-Z]{2,})|((?:\d{1,3}\.){3}\d{1,3})/gi;
    if (domainPattern.test(diff)) {
      throw new Error("CRITICAL VULNERABILITY DETECTED: Hardcoded URL patterns located. Multi-tenant components must construct request boundaries dynamically using useTenant().");
    }

    // Rule 4 Verification: Ban static Hex values inside visual components
    const hexColorPattern = /(#[0-9a-fA-F]{3,6})\b/g;
    if (hexColorPattern.test(diff)) {
      throw new Error("CRITICAL VULNERABILITY DETECTED: Inline raw HEX declarations mapped directly within presentational layers. Implement CSS variables mapping cleanly to Tailwind roots.");
    }

    console.log("✅ Code integrity matching multi-tenant operational philosophy parameters.");
  } catch (error) {
    console.error(`\n🛑 ARCHITECTURAL GATE KEEPER REJECTION:`);
    console.error(error.message);
    releaseLock();
    process.exit(1);
  }

  // Sanity check build consistency
  try {
    console.log("⚙️  Verifying build engine matrix compilation pass...");
    execSync('npm run build', { stdio: 'ignore' });
    console.log("✅ Application compilation passes.");
  } catch (buildError) {
    console.error("🛑 COMPLIANCE REJECTION: Component changes break typescript compilation vectors or tree-shaking properties.");
    releaseLock();
    process.exit(1);
  }

  return true;
}

// --- 3. EXECUTIVE ENTRY MATRIX ---
const args = process.argv.slice(2);
const command = args[0];

acquireLock();

try {
  if (!fs.existsSync(JSON_PATH)) {
    throw new Error("Missing state engine configuration dataset.");
  }
  const state = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  switch (command) {
    case 'status': {
      const activeTasks = state.tasks.filter(t => t.status !== 'complete');
      const compressedPayload = {
        activePhase: state.status.phase,
        blockers: state.blockers,
        remainingMilestones: activeTasks
      };
      console.log(JSON.stringify(compressedPayload, null, 2));
      break;
    }

    case 'update': {
      const targetId = args[1]?.toUpperCase();
      const targetStatus = args[2]?.toLowerCase();

      if (!targetId || !['pending', 'in_progress', 'complete'].includes(targetStatus)) {
        console.error("❌ System parameters syntax exception. Template context: node progress-tracker.js update T_XXX complete");
        break;
      }

      let located = false;
      for (let task of state.tasks) {
        if (task.id === targetId) {
          located = true;
          if (targetStatus === 'complete') {
            runArchitecturalAudits(task.id);
          }
          task.status = targetStatus;
          console.log(`🚀 Task State Mutation Complete: [${targetId}] transitioned to [${targetStatus}].`);
          break;
        }
      }

      if (!located) {
        console.error(`❌ Tracking validation match failure: Milestone token [${targetId}] is absent from tracking directories.`);
      } else {
        fs.writeFileSync(JSON_PATH, JSON.stringify(state, null, 2), 'utf8');
      }
      break;
    }

    default:
      console.log("⚙️  Usage commands list: 'status' | 'update <TASK_ID> <status>'");
  }
} finally {
  releaseLock();
}