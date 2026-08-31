import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(artifactDir, "dist");
const testDistDir = path.join(artifactDir, `.test-dist-build-race-${process.pid}`);
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

async function findSourceTests(directory) {
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
      } else if (entry.isFile() && entry.name.endsWith(".test.ts")) {
        matches.push(path.relative(artifactDir, entryPath).split(path.sep).join("/"));
      }
    }));
  }

  await walk(directory);
  return matches.sort();
}

function normalizeSourceTestPath(filePath) {
  return filePath.replace(/^\.\//, "").split(path.sep).join("/");
}

function sourceTestsFromCommand(command) {
  return [...command.matchAll(
    /(?:^|[\s"'=])((?:\.\/)?src\/[^"'`\s;&|]+\.test\.ts)(?=$|[\s"';&|])/g,
  )].map((match) => normalizeSourceTestPath(match[1]));
}

function executedTestCases(output) {
  const summaries = [...output.matchAll(/^\s*# tests (\d+)\s*$/gm)];
  if (summaries.length === 0) return null;
  return Number(summaries.at(-1)[1]);
}

function runScript(name, args) {
  return new Promise((resolve) => {
    const child = spawn(process.platform === "win32" ? "pnpm.cmd" : "pnpm", args, {
      cwd: artifactDir,
      env: {
        ...process.env,
        CI: "1",
        API_TEST_DIST_DIR: path.basename(testDistDir),
      },
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

const sourceTestFiles = await findSourceTests(path.join(artifactDir, "src"));
const sourceTestFileSet = new Set(sourceTestFiles);
const testScriptsWithEntries = testScripts.map(({ name, command }) => ({
  name,
  command,
  sourceTestFiles: sourceTestsFromCommand(command),
}));
const configuredSourceTestFiles = [
  ...new Set(testScriptsWithEntries.flatMap(({ sourceTestFiles: files }) => files)),
];
const unregisteredSourceTests = sourceTestFiles.filter(
  (filePath) => !configuredSourceTestFiles.includes(filePath),
);
const staleConfiguredSourceTests = configuredSourceTestFiles.filter(
  (filePath) => !sourceTestFileSet.has(filePath),
);
const scriptsWithoutSourceTests = testScriptsWithEntries
  .filter(({ sourceTestFiles: files }) => files.length === 0)
  .map(({ name }) => name);

const coverageViolations = [];
if (unregisteredSourceTests.length > 0) {
  coverageViolations.push(
    `Source test files have no registered test runner:\n${unregisteredSourceTests
      .map((filePath) => `- ${filePath}`)
      .join("\n")}`,
  );
}
if (staleConfiguredSourceTests.length > 0) {
  coverageViolations.push(
    `Test runners reference source files that do not exist:\n${staleConfiguredSourceTests
      .map((filePath) => `- ${filePath}`)
      .join("\n")}`,
  );
}
if (scriptsWithoutSourceTests.length > 0) {
  coverageViolations.push(
    `Test scripts must bundle at least one src/**/*.test.ts file:\n${scriptsWithoutSourceTests
      .map((name) => `- ${name}`)
      .join("\n")}`,
  );
}
if (coverageViolations.length > 0) {
  throw new Error(`API test runner coverage check failed:\n${coverageViolations.join("\n\n")}`);
}

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
const testResults = results
  .filter(({ name }) => testScripts.some((script) => script.name === name))
  .map((result) => ({
    ...result,
    executedTestCases: executedTestCases(result.output),
  }));
const emptyTestResults = testResults.filter(
  ({ executedTestCases: count }) => count === null || count === 0,
);
const testBundlesInDist = await findTestBundles(distDir);

if (failedResults.length > 0 || emptyTestResults.length > 0 || testBundlesInDist.length > 0) {
  const failures = [];
  if (failedResults.length > 0) {
    failures.push(
      `Commands failed:\n${failedResults
        .map(({ name, code }) => `- ${name} (exit ${code})`)
        .join("\n")}`,
    );
  }
  if (emptyTestResults.length > 0) {
    failures.push(
      `API test runners must execute at least one test case:\n${emptyTestResults
        .map(({ name, executedTestCases: count }) => (
          `- ${name} (${count === null ? "no TAP test summary reported" : "reported 0 tests"})`
        ))
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
  const failureMessage = failures.join("\n\n");
  await rm(testDistDir, { recursive: true, force: true });
  throw new Error(failureMessage);
}

await rm(testDistDir, { recursive: true, force: true });
console.log(
  `Build-race check passed: production build and ${testScripts.length} API test bundles completed in parallel.`,
);