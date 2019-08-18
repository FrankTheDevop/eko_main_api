const dev = 'nodemon server/server.js --watch common --watch server --ext js,json |bunyan'
const lint = 'eslint .'
const lbSDK = 'lb-sdk ./server/server ../site/src/lib/lb-sdk'
const start = 'pm2 start process.yml --only instagram-api'

const test = {
  default: 'nps lint',
}

const coverage = {
  default: 'true',

  combine: {
    description: 'Combine coverage reports from all test suites',
    script: 'lcov-result-merger "coverage/*/lcov.info" coverage/lcov.info',
  },
  codecov: {
    description: 'Send coverage report to codecov',
    script: 'codecov',
  },
}

const getTestType = testType => ({
  default: {
    description: `Run ${testType} tests`,
    script: `NODE_ENV=test mocha --full-trace server/test/${testType}/**/*.test.js`,
  },
  watch: `nps test.${testType} --watch`,
})

const getCoverageType = testType => ({
  default: {
    description: `Run ${testType} tests with coverage reports`,
    script: `NODE_ENV=test nyc --report-dir coverage/acl --reporter=lcov --reporter=text --reporter=text-summary --include=**/* mocha --timeout 600000 'server/test/${testType}/**/*.test.js'`,
  },
  watch: `nps test.${testType} --watch`,
})

const testTypes = ['acl', 'unit']

testTypes.forEach(testType => {
  test.default = `${test.default} && nps test.${testType}`
  test[testType] = getTestType(testType)

  coverage.default = `${coverage.default} && nps coverage.${testType}`
  coverage[testType] = getCoverageType(testType)
})

const tag = process.env.TAG || 'latest'
const dockerOrg = 'socialgrowth'
const dockerImage = 'api'
const dockerPath = `${dockerOrg}/instagram-${dockerImage}:${tag}`

const docker = {
  build: `docker build --no-cache -t ${dockerPath} .`,
  push: `docker push ${dockerPath}`,
  run: `docker-compose -f docker-compose.yml up`,
}

// Export the Scripts object
module.exports = {scripts: { dev, lint, test, coverage, lbSDK, start, docker }}
