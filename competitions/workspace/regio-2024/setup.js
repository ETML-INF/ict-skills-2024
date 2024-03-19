// This script sets up the competition.
(async function main() {
  const diagnosticContext = {
    startTime: new Date().toISOString(),
  };

  try {
    await setup(diagnosticContext);
    writeDiagnostics(diagnosticContext);
  } catch (err) {
    diagnosticContext['error'] = err;
    writeDiagnostics(diagnosticContext);
  }
})();

async function setup(diagnosticContext) {
  process.chdir(__dirname);

  console.log('Setting up competition...');

  const shouldPHPBeInstalled = await askShouldPHPBeInstalled();
  initializeDiagnosticContext(diagnosticContext);
  diagnosticContext['shouldPHPBeInstalled'] = shouldPHPBeInstalled;

  // == Check versions ==
  console.log('Checking versions...');
  verifyVersions('Node.js', process.versions.node, '20.0.0', diagnosticContext);
  verifyVersions('NPM', runCommand('npm -v', diagnosticContext), '9.0.0', diagnosticContext);
  verifyVersions('Docker', runCommand('docker version --format \'{{.Client.Version}}\'', diagnosticContext), '25.0.0', diagnosticContext);
  verifyVersions('Docker Compose', runCommand('docker compose version --short', diagnosticContext), '2.24.0', diagnosticContext);
  if (shouldPHPBeInstalled) {
    const phpVersion = runCommand('php -v', diagnosticContext).split(' ')[1];
    verifyVersions('PHP', phpVersion, '8.3.0', diagnosticContext);
    verifyPhpExtensionIsInstalled('mbstring', diagnosticContext);
    verifyPhpExtensionIsInstalled('curl', diagnosticContext);
    verifyPhpExtensionIsInstalled('openssl', diagnosticContext);
    verifyPhpExtensionIsInstalled('pdo_mysql', diagnosticContext);

    const composerVersion = runCommand('composer -V', diagnosticContext).split(' ')[2];
    verifyVersions('Composer', composerVersion, '2.5.0', diagnosticContext);
  }

  // == Install dependencies ==
  console.log('Installing dependencies...');
  console.log('  Installing README server dependencies...');
  runCommand('npm install', diagnosticContext);
  console.log('  Installing backend task dependencies...');
  runCommand('npm --prefix work/backend install', diagnosticContext);
  if (shouldPHPBeInstalled) {
    runCommand('composer --working-dir=work/backend install', diagnosticContext);
  }
  console.log('  Installing frontend task dependencies...');
  runCommand('npm --prefix work/frontend install', diagnosticContext);
  console.log('  Installing htmlcss task dependencies...');
  runCommand('npm --prefix work/htmlcss install', diagnosticContext);

  // == Build readme ==
  console.log('Building readme...');
  runCommand('npm run build', diagnosticContext);

  // == Pulling docker images ==
  console.log('Pulling docker images...');
  runCommand('docker compose pull', diagnosticContext);

  // == Building docker images ==
  console.log('Building docker images...');
  runCommand('docker compose build', diagnosticContext);

  // == Done ==
  console.log('Setup complete! You can now run "npm start"');
}


function initializeDiagnosticContext(diagnosticContext) {
  const os = require('os');
  diagnosticContext['startTime'] = new Date().toISOString();
  diagnosticContext['os'] = {
    type: os.type(),
    platform: os.platform(),
    release: os.release(),
    userInfo: os.userInfo(),
    cpus: os.cpus(),
    totalmem: os.totalmem(),
    uptime: os.uptime(),
    machine: os.machine(),
  };
}

function writeDiagnostics(diagnosticContext) {
  diagnosticContext['duration'] = Date.now() - new Date(diagnosticContext['startTime']);
  diagnosticContext['endTime'] = new Date().toISOString();

  function convertBuffersToStrings(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Buffer.isBuffer(obj[key])) {
          obj[key] = obj[key].toString();
        } else if (typeof obj[key] === 'object') {
          convertBuffersToStrings(obj[key]); // Recursively convert buffers in nested objects
        }
      }
    }
  }

  try {
    convertBuffersToStrings(diagnosticContext);
  } catch (err) {
    console.error('Error converting buffers to strings: ', err);
  }
  require('fs').writeFileSync('work/diagnostic.json', JSON.stringify(diagnosticContext, null, 2));
}

/**
 * Run command and return output. Only if there is an error, stdout and stderr are printed and the process is exited.
 */
function runCommand(command, diagnosticContext) {
  if (!diagnosticContext['timings']) {
    diagnosticContext['timings'] = {};
  }
  return measureTime(() => {
    const execSync = require('child_process').execSync;
    try {
      return execSync(command, { stdio: 'pipe' }).toString().trim();
    } catch (error) {
      console.error(error.stdout.toString());
      console.error(error.stderr.toString());
      throw error;
    }
  }, diagnosticContext['timings'], command);
}

function parseVersion(version) {
  return version
    .split('.')
    .map((part) => part.replace(/\D/g, ''))
    .map((part) => parseInt(part));
}

function compareVersions(a, b) {
  if (a.length < b.length) {
    throw new Error('Semantic versions do not match: ' + a.join('.') + ' vs ' + b.join('.'));
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

function verifyVersions(program, actualVersion, minVersion, diagnosticContext) {
  const actualVersionParsed = parseVersion(actualVersion);
  const minVersionParsed = parseVersion(minVersion);

  if (!diagnosticContext['versions']) {
    diagnosticContext['versions'] = {};
  }
  if (!diagnosticContext['versions'][program]) {
    diagnosticContext['versions'][program] = {};
  }

  const actualVersionStr = actualVersionParsed.join('.');
  const minVersionStr = minVersionParsed.join('.');

  diagnosticContext['versions'][program]['actual'] = actualVersionStr;
  diagnosticContext['versions'][program]['required'] = minVersionStr;

  if (compareVersions(actualVersionParsed, minVersionParsed) === -1) {
    console.error('\x1b[31m%s\x1b[0m', `  FAILED REQUIREMENT: ${program} version ${minVersionStr} or higher is required. Actual: ${actualVersionStr}`);
    throw new Error(`Failed requirement: ${program} version ${minVersionStr} or higher is required. Actual: ${actualVersionStr}`);
  } else {
    console.log('\x1b[32m%s\x1b[0m', `  ${`${program} version`.padEnd(25, ' ')} ${actualVersionStr.padEnd(20, ' ')} OK. Required: ${minVersionStr}`);
  }
}

async function askShouldPHPBeInstalled() {
  return new Promise((resolve) => {
    // prompt if php should be used or not
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question('Do you want to use PHP? (Y/n) ', (answer) => {
      if (answer === '' || answer.trim().toLowerCase() === 'y') {
        resolve(true);
      } else {
        resolve(false);
      }
      readline.close();
    });
  });
}

function verifyPhpExtensionIsInstalled(extension, diagnosticContext) {
  const execSync = require('child_process').execSync;
  const phpCommand = `php -r "echo extension_loaded(\'${extension}\') ? \'${extension} extension is installed.\' : exit(1);"`;

  if (!diagnosticContext['php']) {
    diagnosticContext['php'] = {};
  }

  try {
    const output = execSync(phpCommand);
    diagnosticContext['php'][extension] = true;
    console.log('\x1b[32m    %s\x1b[0m', output.toString());
  } catch (error) {
    diagnosticContext['php'][extension] = false;
    console.log('\x1b[31m    %s\x1b[0m', `${extension} extension is not installed`);
    throw error;
  }
}

function measureTime(callback, timings, key) {
  const startTime = Date.now();
  const retVal = callback();
  const endTime = Date.now();
  timings[key] = endTime - startTime;
  return retVal;
}
