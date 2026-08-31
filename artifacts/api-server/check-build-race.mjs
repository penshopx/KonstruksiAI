import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(artifactDir, "dist");
const testDistDir = path.join(artifactDir, ".test-dist");
const packageJson = await import("./package.json", { with: { type: "json" } });
const testScripts = Object.entries(packageJson.default.scripts)
  .filter(([name]) => name.startsWith("test:"))
  .map(([name, command]) => ({ name, command }));

if (testScripts.length === 0) {
  throw new Error("No API test scripts were found for the build-race check.");
}

function commandUsesProductionDist(command) {
  return /(?:^|[\s"'=])(?:\.\.\/)?(?:\.\/)?dist(?:[/"'\s;&]|$)/.test(command);
}

function isTestBundle(filePath) {
  return /(?:^|[./\\])[^/\\]*\.test\.(?:m?js|cjs)$/.test(filePath);
}

async function findTestBundles(directory) {
  const matches = [];

  async function walk(currentDirectory) {
    let entries;
    try {
      entries = await readdir(currentDirectory, { withFileTypes: true });
    } catch (error) {
      if (error?.code === "ENOENT") return;
      throw error;
    }

    await Promise.all(entries.map(async (entry) => {
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile() && isTestBundle(entryPath)) {
        matches.push(path.relative(artifactDir, entryPath));
      }
    }));
  }

  await walk(directory);
  return matches.sort();
}

function runScript(name, args) {
  return new Promise((resolve) => {
    const child = spawn(process.platform === "win32" ? "pnpm.cmd" : "pnpm", args, {
      cwd: artifactDir,
      env: { ...process.env, CI: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";

    child.stdout.on("data", (chunk) => {
      output += chunk;
      process.stdout.write(`[${name}] ${chunk}`);
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
      process.stderr.write(`[${name}] ${chunk}`);
    });
    child.on("error", (error) => {
      resolve({ name, code: null, output: `${output}${error.stack ?? error}` });
    });
    child.on("close", (code, signal) => {
      resolve({
        name,
        code,
        output: signal ? `${output}\nTerminated by ${signal}` : output,
      });
    });
  });
}

await rm(testDistDir, { recursive: true, force: true });

const configuredViolations = testScripts
  .filter(({ command }) => commandUsesProductionDist(command))
  .map(({ name, command }) => `${name}: ${command}`);
if (configuredViolations.length > 0) {
  throw new Error(
    `API test scripts must write bundles outside dist:\n${configuredViolations.join("\n")}`,
  );
}

const results = await Promise.all([
  runScript("build", ["run", "build"]),
  ...testScripts.map(({ name }) => runScript(name, ["run", name])),
]);

const failedResults = results.filter(({ code }) => code !== 0);
const testBundlesInDist = await findTestBundles(distDir);

if (failedResults.length > 0 || testBundlesInDist.length > 0) {
  const failures = [];
  if (failedResults.length > 0) {
    failures.push(
      `Commands failed:\n${failedResults
        .map(({ name, code }) => `- ${name} (exit ${code})`)
        .join("\n")}`,
    );
  }
  if (testBundlesInDist.length > 0) {
    failures.push(
      `Test bundles were written into dist:\n${testBundlesInDist
        .map((filePath) => `- ${filePath}`)
        .join("\n")}`,
    );
  }
  throw new Error(failures.join("\n\n"));
}

console.log(
  `Build-race check passed: production build and ${testScripts.length} API test bundles completed in parallel.`,
);