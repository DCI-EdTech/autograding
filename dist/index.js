var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("octokit", ["require", "exports", "@actions/core", "@actions/github", "@sentry/node"], function (require, exports, core, github, Sentry) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.repo = exports.owner = exports.createOctokit = void 0;
    // The environment contains a variable for current repository. The repository
    // will be formatted as a name with owner (`nwo`); e.g., jeffrafter/example
    // We'll split this into two separate variables for later use
    var nwo = process.env['GITHUB_REPOSITORY'] || '/';
    var _a = nwo.split('/'), owner = _a[0], repo = _a[1];
    exports.owner = owner;
    exports.repo = repo;
    function createOctokit(preferredToken) {
        var origGHToken = '';
        if (preferredToken === 'gh')
            origGHToken = core.getInput('ghtoken');
        var token = origGHToken || process.env['GITHUB_TOKEN'] || core.getInput('token') || core.getInput('ghtoken');
        if (!token || token === '')
            return;
        // Create the octokit client
        var octokit = github.getOctokit(token);
        if (!octokit)
            return;
        if (!owner)
            return;
        if (!repo)
            return;
        // add commit method
        function commit(files, branch, message, force) {
            return __awaiter(this, void 0, void 0, function () {
                var lastCommitSHA, lastCommitTreeSHA, treeData, err_1, blobs_1, tree, commit_1, error_1;
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, octokit.rest.repos.listCommits({
                                    owner: owner,
                                    repo: repo,
                                    sha: branch,
                                })];
                        case 1:
                            (_a = (_b.sent()).data[0], lastCommitSHA = _a.sha, lastCommitTreeSHA = _a.commit.tree.sha);
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _b.sent();
                            return [3 /*break*/, 3];
                        case 3:
                            if (!lastCommitTreeSHA) return [3 /*break*/, 5];
                            return [4 /*yield*/, octokit.rest.git.getTree({
                                    owner: owner,
                                    repo: repo,
                                    tree_sha: lastCommitTreeSHA
                                })];
                        case 4:
                            // get tree
                            (treeData = (_b.sent()).data);
                            return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, octokit.rest.repos.listCommits({
                                owner: owner,
                                repo: repo
                            })];
                        case 6:
                            // get sha of default branch
                            (lastCommitSHA = (_b.sent()).data[0].sha);
                            // create branch
                            return [4 /*yield*/, octokit.rest.git.createRef({
                                    owner: owner,
                                    repo: repo,
                                    ref: "refs/heads/".concat(branch),
                                    sha: lastCommitSHA,
                                })];
                        case 7:
                            // create branch
                            _b.sent();
                            _b.label = 8;
                        case 8:
                            _b.trys.push([8, 13, , 14]);
                            return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, octokit.rest.git.createBlob({
                                                    owner: owner,
                                                    repo: repo,
                                                    content: file.content,
                                                    encoding: file.encoding
                                                })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                }); }))
                                // create tree
                            ];
                        case 9:
                            blobs_1 = _b.sent();
                            return [4 /*yield*/, octokit.rest.git.createTree(__assign({ owner: owner, repo: repo, tree: files.map(function (file, index) {
                                        return {
                                            path: file.path,
                                            mode: '100644',
                                            type: 'blob',
                                            sha: blobs_1[index].data.sha
                                        };
                                    }) }, (lastCommitTreeSHA && { base_tree: lastCommitTreeSHA })))
                                // create commit
                            ];
                        case 10:
                            tree = _b.sent();
                            return [4 /*yield*/, octokit.rest.git.createCommit({
                                    owner: owner,
                                    repo: repo,
                                    message: message,
                                    tree: tree.data.sha,
                                    parents: [lastCommitSHA],
                                    author: {
                                        name: 'github-actions',
                                        email: 'action@github.com'
                                    },
                                })
                                // update head
                            ];
                        case 11:
                            commit_1 = _b.sent();
                            // update head
                            return [4 /*yield*/, octokit.rest.git.updateRef({
                                    owner: owner,
                                    repo: repo,
                                    ref: "heads/".concat(branch),
                                    sha: commit_1.data.sha,
                                    force: force || false
                                })];
                        case 12:
                            // update head
                            _b.sent();
                            return [3 /*break*/, 14];
                        case 13:
                            error_1 = _b.sent();
                            Sentry.captureException(error_1);
                            console.log(error_1);
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        }
        octokit.commit = commit;
        return octokit;
    }
    exports.createOctokit = createOctokit;
});
define("output", ["require", "exports", "@sentry/node", "octokit"], function (require, exports, Sentry, octokit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCheckRunOutput = void 0;
    var setCheckRunOutput = function (points, availablePoints, results) { return __awaiter(void 0, void 0, void 0, function () {
        var octokit, branch, runId, _a, sha, path, currentContent, currentContentUTF8, content, error_2, workflowRunResponse, checkSuiteUrl, checkSuiteId, checkRunsResponse, checkRun, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    octokit = (0, octokit_1.createOctokit)('gh');
                    if (!octokit)
                        return [2 /*return*/];
                    branch = process.env['GITHUB_REF_NAME'];
                    runId = parseInt(process.env['GITHUB_RUN_ID'] || '');
                    if (Number.isNaN(runId))
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, octokit.rest.repos.getContent({
                            owner: octokit_1.owner,
                            repo: octokit_1.repo,
                            path: '.github/workflows/autograding.yml',
                            ref: branch,
                        })];
                case 2:
                    _a = (_b.sent()).data, sha = _a.sha, path = _a.path, currentContent = _a.content;
                    currentContentUTF8 = Buffer.from(currentContent, 'base64').toString('utf8');
                    return [4 /*yield*/, octokit.rest.repos.getContent({
                            owner: 'DCI-EdTech',
                            repo: 'autograding-setup',
                            path: 'template/.github/workflows/autograding.yml',
                            ref: 'main',
                        })];
                case 3:
                    content = (_b.sent()).data.content;
                    if (!((!currentContentUTF8.includes('id: autograder') ||
                        !currentContentUTF8.includes('secrets.AUTOGRADING')) &&
                        currentContent !== content)) return [3 /*break*/, 5];
                    console.log("update workflow");
                    return [4 /*yield*/, octokit.rest.repos.createOrUpdateFileContents({
                            owner: octokit_1.owner,
                            repo: octokit_1.repo,
                            path: path,
                            message: 'update workflow',
                            content: content,
                            branch: branch,
                            sha: sha,
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _b.sent();
                    Sentry.captureException(error_2);
                    console.log(error_2);
                    return [3 /*break*/, 7];
                case 7:
                    // If we have nothing to output, then bail
                    if (typeof points === undefined)
                        return [2 /*return*/];
                    return [4 /*yield*/, octokit.rest.actions.getWorkflowRun({
                            owner: octokit_1.owner,
                            repo: octokit_1.repo,
                            run_id: runId,
                        })
                        // Find the check suite run
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ];
                case 8:
                    workflowRunResponse = _b.sent();
                    checkSuiteUrl = workflowRunResponse.data.check_suite_url;
                    checkSuiteId = parseInt(checkSuiteUrl.match(/[0-9]+$/)[0], 10);
                    return [4 /*yield*/, octokit.rest.checks.listForSuite({
                            owner: octokit_1.owner,
                            repo: octokit_1.repo,
                            check_name: 'Autograding',
                            check_suite_id: checkSuiteId,
                        })];
                case 9:
                    checkRunsResponse = _b.sent();
                    checkRun = checkRunsResponse.data.total_count === 1 && checkRunsResponse.data.check_runs[0];
                    if (!checkRun)
                        return [2 /*return*/];
                    return [4 /*yield*/, octokit.rest.checks.update({
                            owner: octokit_1.owner,
                            repo: octokit_1.repo,
                            check_run_id: checkRun.id,
                            output: {
                                title: 'Autograding',
                                summary: "Tasks ".concat(results.tasks.completed, "/").concat(results.tasks.total),
                                text: "Points ".concat(points, "/").concat(availablePoints),
                                annotations: [
                                    {
                                        // Using the `.github` path is what GitHub Actions does
                                        path: '.github',
                                        start_line: 1,
                                        end_line: 1,
                                        annotation_level: 'notice',
                                        message: "Tasks ".concat(results.tasks.completed, "/").concat(results.tasks.total),
                                        title: 'Autograding complete',
                                    },
                                ],
                            },
                        })];
                case 10:
                    res = _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    exports.setCheckRunOutput = setCheckRunOutput;
});
define("modifyReadme", ["require", "exports", "@sentry/node", "octokit", "./lib/helpers"], function (require, exports, Sentry, octokit_2, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeAutogradingInfo = void 0;
    var branch = process.env['GITHUB_REF_NAME'];
    var readmeInfoPath = "./AUTOGRADING.md";
    var mainBadgeString = "\n[![Status overview badge](../../blob/badges/.github/badges/".concat(branch, "/badge.svg)](#-results)\n");
    var infoDelimiters = ['[//]: # (autograding info start)', '[//]: # (autograding info end)'];
    var setupDelimiters = ['[//]: # (autograding setup start)', '[//]: # (autograding setup end)'];
    var infoRE = new RegExp("[\n]*".concat((0, helpers_1.escapeRegExp)(infoDelimiters[0]), "([\\s\\S]*)").concat((0, helpers_1.escapeRegExp)(infoDelimiters[1])), 'gsm');
    var setupRE = new RegExp("[\n]*".concat((0, helpers_1.escapeRegExp)(setupDelimiters[0]), "([\\s\\S]*)").concat((0, helpers_1.escapeRegExp)(setupDelimiters[1])), 'gsm');
    function removeAutogradingInfo(readme) {
        var newReadme = readme.replace(infoRE, '');
        newReadme = newReadme.replace(setupRE, '');
        return newReadme;
    }
    exports.removeAutogradingInfo = removeAutogradingInfo;
    function modifyReadme(results, packageJson) {
        return __awaiter(this, void 0, void 0, function () {
            var octokit, sha, content, path, readme, error_3, newReadme, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        octokit = (0, octokit_2.createOctokit)();
                        if (!octokit)
                            return [2 /*return*/];
                        readme = '';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, octokit.rest.repos.getReadme({
                                owner: octokit_2.owner,
                                repo: octokit_2.repo,
                                ref: process.env['GITHUB_REF_NAME'],
                            })];
                    case 2:
                        // get readme
                        (_a = (_b.sent()).data, sha = _a.sha, content = _a.content, path = _a.path);
                        readme = Buffer.from(content, 'base64').toString('utf8');
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        Sentry.captureException(error_3);
                        return [3 /*break*/, 4];
                    case 4:
                        _b.trys.push([4, 7, , 8]);
                        newReadme = addMainBadge(readme);
                        return [4 /*yield*/, addAutogradingInfo(newReadme, results, packageJson)
                            // don't update if nothing changed
                        ];
                    case 5:
                        // add autograding info
                        newReadme = _b.sent();
                        // don't update if nothing changed
                        if (newReadme === readme)
                            return [2 /*return*/];
                        // update readme
                        return [4 /*yield*/, octokit.rest.repos.createOrUpdateFileContents({
                                owner: octokit_2.owner,
                                repo: octokit_2.repo,
                                path: path,
                                message: 'update readme',
                                content: Buffer.from(newReadme).toString('base64'),
                                branch: process.env['GITHUB_REF_NAME'],
                                sha: sha,
                            })];
                    case 6:
                        // update readme
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _b.sent();
                        Sentry.captureException(error_4);
                        console.log(error_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function addMainBadge(readme) {
        var startInfoDelimiterAsEscapedRegEx = (0, helpers_1.escapeRegExp)(infoDelimiters[0]);
        var headlineLevel1Regex = new RegExp("^(?<!".concat(startInfoDelimiterAsEscapedRegEx, "[\\S\\s]*)#[^#].*$"), 'm');
        // delete old points badge
        var newReadme = readme.replaceAll(/[\n]{0,1}.*\[\!\[Status overview badge\]\(.*[\n]/g, '');
        if (process.env.DISABLE_AUTOGRADING)
            return newReadme;
        // check if there is a headline
        if (headlineLevel1Regex.test(newReadme)) {
            // insert points badge after level 1 headline
            return newReadme.replace(headlineLevel1Regex, "$&".concat(mainBadgeString));
        }
        else {
            // insert badge on top if no headline found
            return "".concat(mainBadgeString).concat(newReadme);
        }
    }
    function generateResult(results) {
        return "".concat(results.testResults.reduce(function (acc, testResult) {
            acc += "\n### ".concat(testResult[0].ancestorTitles[0], "\n\n|                 Status                  | Check                                                                                    |\n| :-------------------------------------: | :--------------------------------------------------------------------------------------- |\n");
            var lines = testResult.map(function (result) {
                return "| ![Status](../../blob/badges/".concat(result.statusBadgePath, ") | ").concat(result.title, " |\n");
            });
            return acc.concat.apply(acc, lines);
        }, ''), "\n");
    }
    // shorter alternative CodeBuddy notice for students:
    // Check below for what you have achieved and for hints on what to improve. ⌛ If you see the orange dot ![processing](https://raw.githubusercontent.com/DCI-EdTech/autograding-setup/main/assets/processing.svg) on top, CodeBuddy is still processing.
    function addAutogradingInfo(fullReadme, results, packageJson) {
        return __awaiter(this, void 0, void 0, function () {
            var repoURL, exerciseTemplateName, readmeInfo;
            return __generator(this, function (_a) {
                repoURL = "".concat(process.env['GITHUB_SERVER_URL'], "/").concat(octokit_2.owner, "/").concat(octokit_2.repo);
                exerciseTemplateName = packageJson.repository ? (0, helpers_1.repoNameFromUrl)(packageJson.repository.url) : '';
                readmeInfo = "# <img src=\"https://github.com/DCI-EdTech/autograding-setup/raw/main/assets/bot-large.svg\" alt=\"\" data-canonical-src=\"https://github.com/DCI-EdTech/autograding-setup/raw/main/assets/bot-large.svg\" height=\"31\" /> Results\n> \u231B Give it a minute. As long as you see the orange dot ![processing](https://raw.githubusercontent.com/DCI-EdTech/autograding-setup/main/assets/processing.svg) on top, CodeBuddy is still processing. Refresh this page to see it's current status.\n>\n> This is what CodeBuddy found when running your code. It is to show you what you have achieved and to give you hints on how to complete the exercise.\n\n".concat(generateResult(results), "\n\n[\uD83D\uDD2C Results Details](../../actions)\n[\uD83D\uDC1E Tips on Debugging](https://github.com/DCI-EdTech/autograding-setup/wiki/How-to-work-with-CodeBuddy)\n[\uD83D\uDCE2 Report Problem](https://docs.google.com/forms/d/e/1FAIpQLSfS8wPh6bCMTLF2wmjiE5_UhPiOEnubEwwPLN_M8zTCjx5qbg/viewform?usp=pp_url&entry.652569746=").concat(encodeURIComponent(exerciseTemplateName), ")\n");
                // remove old info
                fullReadme = removeAutogradingInfo(fullReadme);
                if (process.env.DISABLE_AUTOGRADING)
                    return [2 /*return*/, fullReadme];
                return [2 /*return*/, "".concat(fullReadme.trim(), "\n\n").concat(infoDelimiters[0], "\n").concat(readmeInfo, "\n\n").concat(infoDelimiters[1])];
            });
        });
    }
    exports.default = modifyReadme;
});
// @ts-nocheck
define("badge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var colorVariants = {
        full: {
            stroke: '#A5F2DC',
            fill: '#DEFFF5',
            label: 'Details',
            ctaStroke: '#00E0A1',
            ctaFill: '#00E0A1',
            ctaFontColor: '#0E123B',
            icon: "<g id=\"Icon\" transform=\"translate(20.000000, 7.000000)\">\n              <polygon id=\"Full\" fill=\"#00E0A1\" points=\"1.06728745 2.69917297 19.0803909 2.69917297 16.2599831 18.7211496 14.4799805 19.5198793 5.80393219 19.5198793 3.21572876 18.7211496\"></polygon>\n              <g id=\"Glass\" stroke=\"#0E123B\">\n                  <path d=\"M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z\" id=\"Rectangle\"></path>\n                  <polyline id=\"Line\" stroke-linecap=\"square\" stroke-linejoin=\"round\" points=\"3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587\"></polyline>\n              </g>\n          </g>\n          <g id=\"All\" transform=\"translate(26.500000, 14.000000)\" stroke=\"#0E123B\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\">\n              <line x1=\"0\" y1=\"4.78849792\" x2=\"2.5\" y2=\"7.28849792\" id=\"Line\"></line>\n              <line x1=\"7.11474228\" y1=\"0\" x2=\"2.5\" y2=\"7.28849792\" id=\"Line\"></line>\n          </g>",
            ctaLeft: 28.4052734
        },
        partial: {
            stroke: '#FEF1AF',
            fill: '#FFF9D9',
            label: 'Details',
            ctaStroke: '#FEDA2E',
            ctaFill: '#FEDA2E',
            ctaFontColor: '#0E123B',
            icon: "<g id=\"Icon\" transform=\"translate(20.000000, 7.000000)\">\n              <polygon id=\"Half-full\" fill=\"#FEDA2E\" points=\"1.47357941 9.51987934 18.3122101 9.51987934 16.2599831 18.7211496 14.4799805 19.5198793 5.80393219 19.5198793 3.21572876 18.7211496\"></polygon>\n              <g id=\"Glass\" stroke=\"#0E123B\">\n                  <path d=\"M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z\" id=\"Rectangle\"></path>\n                  <polyline id=\"Line\" stroke-linecap=\"square\" stroke-linejoin=\"round\" points=\"3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587\"></polyline>\n              </g>\n          </g>",
            ctaLeft: 28.4052734
        },
        none: {
            stroke: '#F5A4C2',
            fill: '#FFE6EF',
            label: 'Pushed?',
            ctaStroke: '#EF065B',
            ctaFill: '#EF065B',
            ctaFontColor: '#FFFFFF',
            icon: "<g id=\"Icon\" transform=\"translate(20.000000, 7.000000)\">\n              <g id=\"Glass\" stroke=\"#0E123B\">\n                  <path d=\"M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z\" id=\"Rectangle\"></path>\n                  <polyline id=\"Line\" stroke-linecap=\"square\" stroke-linejoin=\"round\" points=\"3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587\"></polyline>\n              </g>\n              <g id=\"None\" transform=\"translate(6.000000, 6.000000)\" stroke=\"#EF065B\" stroke-linecap=\"round\" stroke-width=\"2\">\n                  <line x1=\"0.5\" y1=\"0.5\" x2=\"7.5\" y2=\"7.5\" id=\"Line\"></line>\n                  <line x1=\"7.5\" y1=\"0.5\" x2=\"0.5\" y2=\"7.5\" id=\"Line\"></line>\n              </g>\n          </g>",
            ctaLeft: 21.3300781
        }
    };
    function badge(tasks) {
        var positions = {
            badge: {
                left: '120.000000' // '120.000000'
            },
            logo: {
                left: '0.000000' // '295.000000'
            }
        };
        var colors = colorVariants.none;
        if (tasks.completed > 0)
            colors = colorVariants.partial;
        if (tasks.completed > 0 && tasks.completed == tasks.total)
            colors = colorVariants.full;
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"396px\" height=\"38px\" viewBox=\"0 0 396 38\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <defs>\n        <rect id=\"path-1\" x=\"8.7174294\" y=\"11.6677099\" width=\"20.8812844\" height=\"10.8630402\" rx=\"3.82122905\"></rect>\n        <filter x=\"-2.4%\" y=\"-4.6%\" width=\"104.8%\" height=\"109.2%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"0\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0.9218   0 0 0 0 0.790676768   0 0 0 0 0.1582  0 0 0 1 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n        <ellipse id=\"path-3\" cx=\"19.1580716\" cy=\"2.41400894\" rx=\"2.43277099\" ry=\"2.41400894\"></ellipse>\n        <filter x=\"-10.3%\" y=\"-10.4%\" width=\"120.6%\" height=\"120.7%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"0\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0.9218   0 0 0 0 0.790676768   0 0 0 0 0.1582  0 0 0 1 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"Logo\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g transform=\"translate(-101.000000, -743.000000)\">\n            <g transform=\"translate(101.000000, 744.000000)\">\n                <g transform=\"translate(".concat(positions.badge.left, ", 0.000000)\">\n                    <rect id=\"Background\" stroke=\"").concat(colors.stroke, "\" fill=\"").concat(colors.fill, "\" x=\"0\" y=\"0\" width=\"275\" height=\"36\" rx=\"6\"></rect>\n                    <g id=\"CTA\" transform=\"translate(170.000000, 0.000000)\">\n                        <path d=\"M0,0 L99,0 C102.313708,-6.08718376e-16 105,2.6862915 105,6 L105,30 C105,33.3137085 102.313708,36 99,36 L0,36 L0,36 L0,0 Z\" id=\"CTA-Background\" stroke=\"").concat(colors.ctaStroke, "\" fill=\"").concat(colors.ctaFill, "\"></path>\n                        <text id=\"CTA-Text\" font-family=\"Arial-BoldMT, Arial\" font-size=\"15\" font-weight=\"bold\" fill=\"").concat(colors.ctaFontColor, "\">\n                            <tspan x=\"").concat(colors.ctaLeft, "\" y=\"24\">").concat(colors.label, "</tspan>\n                        </text>\n                    </g>\n                    <text id=\"Score\" font-family=\"Arial-BoldMT, Arial\" font-size=\"15\" font-weight=\"bold\" fill=\"#0E123B\">\n                        <tspan x=\"107\" y=\"24\">").concat(tasks.completed, "/").concat(tasks.total, "</tspan>\n                    </text>\n                    <text id=\"Tests\" font-family=\"ArialMT, Arial\" font-size=\"15\" font-weight=\"normal\" fill=\"#0E123B\">\n                        <tspan x=\"54\" y=\"24\">Tasks</tspan>\n                    </text>\n                    ").concat(colors.icon, "\n                </g>\n                <g id=\"Logo\" transform=\"translate(").concat(positions.logo.left, ", 0.000000)\">\n                    <g id=\"Bot\">\n                        <rect id=\"Rectangle\" fill=\"#00CC93\" x=\"4.66281107\" y=\"7.64436165\" width=\"28.990521\" height=\"25.1459265\" rx=\"4.82681564\"></rect>\n                        <polygon id=\"Path\" fill=\"#0E123B\" fill-rule=\"nonzero\" transform=\"translate(19.176236, 27.924551) rotate(-90.000000) translate(-19.176236, -27.924551) \" points=\"19.0957008 31.6842131 19.0957008 24.1542367 20.2449376 24.1542367 20.2449376 23.1422106 18.1075339 23.1422106 18.1075339 32.7068921 20.2449376 32.7068921 20.2449376 31.6842131\"></polygon>\n                        <g id=\"Rectangle\">\n                            <use fill=\"#FEDA2E\" fill-rule=\"evenodd\" xlink:href=\"#path-1\"></use>\n                            <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-2)\" xlink:href=\"#path-1\"></use>\n                        </g>\n                        <polygon id=\"Path\" fill=\"#0E123B\" fill-rule=\"nonzero\" points=\"13.5829714 14.6852211 13.5829714 19.5132389 14.596626 19.5132389 14.596626 14.6852211\"></polygon>\n                        <ellipse id=\"Oval\" stroke=\"#0E123B\" stroke-width=\"1.00558659\" cx=\"23.1113244\" cy=\"17.09923\" rx=\"1.9299777\" ry=\"1.91121565\"></ellipse>\n                        <polygon id=\"Path\" fill=\"#00CC93\" fill-rule=\"nonzero\" points=\"18.3471479 3.82218082 18.3471479 8.65019871 19.9689952 8.65019871 19.9689952 3.82218082\"></polygon>\n                        <g id=\"Oval\">\n                            <use fill=\"#FEDA2E\" fill-rule=\"evenodd\" xlink:href=\"#path-3\"></use>\n                            <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-4)\" xlink:href=\"#path-3\"></use>\n                        </g>\n                        <path d=\"M0.571332582,21.7352244 C2.17474983,20.8391151 3.1423292,19.2754956 3.1423292,17.2546775 L3.1423292,16.9895023 C3.1423292,14.9686842 2.17474983,13.3684889 0.571332582,12.4723795 L0,13.1673215 C1.22560054,14.0634309 1.99044903,15.3070112 1.99044903,16.9986463 L1.99044903,17.2546775 C1.99044903,18.9463126 1.22560054,20.1441731 0,21.0311385 L0.571332582,21.7352244 Z\" id=\"Path\" fill=\"#86889E\" fill-rule=\"nonzero\" transform=\"translate(1.571165, 17.103802) scale(-1, 1) translate(-1.571165, -17.103802) \"></path>\n                        <path d=\"M35.7451465,21.7352244 C37.3485638,20.8391151 38.3161432,19.2754956 38.3161432,17.2546775 L38.3161432,16.9895023 C38.3161432,14.9686842 37.3485638,13.3684889 35.7451465,12.4723795 L35.173814,13.1673215 C36.3994145,14.0634309 37.164263,15.3070112 37.164263,16.9986463 L37.164263,17.2546775 C37.164263,18.9463126 36.3994145,20.1441731 35.173814,21.0311385 L35.7451465,21.7352244 Z\" id=\"Path\" fill=\"#86889E\" fill-rule=\"nonzero\"></path>\n                    </g>\n                    <g id=\"Text\" transform=\"translate(51.432608, 3.663442)\" fill=\"#86889E\" fill-rule=\"nonzero\">\n                        <path d=\"M5.78183241,12.1669842 C8.62827298,12.1669842 10.4072983,10.3611788 11.0299572,8.59977839 L9.93289158,8.08171945 C9.29540749,9.79871479 7.96113848,11.0124529 5.82630805,11.0124529 C3.20224564,11.0124529 1.27496817,8.96982049 1.27496817,6.21670727 C1.27496817,3.419189 3.35049776,1.49497008 5.81148283,1.49497008 C8.22799228,1.49497008 9.44365961,2.97513848 9.91806637,4.39610014 L11.015132,3.89284288 C10.4665992,2.13144249 8.68757383,0.340438731 5.84113326,0.340438731 C2.66853804,0.340438731 0,2.7679149 0,6.29071569 C0,9.7839131 2.57958677,12.1669842 5.78183241,12.1669842 Z\" id=\"Path\"></path>\n                        <path d=\"M16.4115089,12.1817859 C18.7242419,12.1817859 20.5180925,10.4055838 20.5180925,8.06691776 C20.5180925,5.80226012 18.7242419,4.01125636 16.4411593,4.01125636 C14.098776,4.01125636 12.3345758,5.78745843 12.3345758,8.1261245 C12.3345758,10.3759805 14.1136012,12.1817859 16.4115089,12.1817859 Z M16.4411593,11.1604697 C14.7066096,11.1604697 13.5205927,9.72470637 13.5205927,8.06691776 C13.5205927,6.40912916 14.6917844,5.01777087 16.4115089,5.01777087 C18.1312334,5.01777087 19.3320756,6.4683359 19.3320756,8.1261245 C19.3320756,9.76911142 18.1312334,11.1604697 16.4411593,11.1604697 Z\" id=\"Shape\"></path>\n                        <path d=\"M21.9857884,8.08171945 C21.9857884,10.2427653 23.4238339,12.1669842 25.6920912,12.1669842 C27.219088,12.1669842 28.1679015,11.3676933 28.7757352,10.3611788 L28.7757352,12.0485708 L29.9024512,12.0485708 L29.9024512,0 L28.7609099,0 L28.7609099,5.80226012 C28.1234259,4.86975403 27.219088,4.01125636 25.6920912,4.01125636 C23.4534843,4.01125636 21.9857884,6.02428538 21.9857884,8.08171945 Z M25.9292946,11.145668 C24.1947449,11.145668 23.1569801,9.73950805 23.1569801,8.11132282 C23.1569801,6.40912916 24.1947449,5.03257255 25.9292946,5.03257255 C27.574893,5.03257255 28.7757352,6.49793926 28.7757352,8.06691776 C28.7757352,9.695103 27.6045435,11.145668 25.9292946,11.145668 Z\" id=\"Shape\"></path>\n                        <path d=\"M39.5240134,8.45176155 C39.5388386,8.33334808 39.5388386,8.20013292 39.5388386,8.06691776 C39.5388386,5.75785506 38.2490452,4.01125636 35.8028853,4.01125636 C33.5791036,4.01125636 31.9483304,5.93547527 31.9483304,8.08171945 C31.9483304,10.3611788 33.6680549,12.1817859 35.9659626,12.1817859 C37.3595325,12.1817859 38.6345007,11.4565034 39.3164604,10.1391535 L38.4565981,9.57668953 C38.0118418,10.4795923 37.1075039,11.1604697 35.9511374,11.1604697 C34.4093155,11.1604697 33.2084733,9.99113668 33.1195221,8.45176155 L39.5240134,8.45176155 Z M33.1343473,7.4748504 C33.327075,6.15750053 34.4241407,5.01777087 35.8028853,5.01777087 C37.3150569,5.01777087 38.2193948,6.03908706 38.3676469,7.4748504 L33.1343473,7.4748504 Z\" id=\"Shape\"></path>\n                        <path d=\"M0.68195972,16.8539963 L0.68195972,28.4437148 L5.26295002,28.4437148 C8.03526453,28.4437148 9.38435876,27.0671582 9.38435876,25.202146 C9.38435876,24.2844416 8.93960242,22.9670917 7.17540228,22.4046278 C8.55414693,21.782957 8.85065115,20.5248139 8.85065115,19.9031432 C8.85065115,17.9937259 7.3384796,16.8539963 5.1146979,16.8539963 L0.68195972,16.8539963 Z M2.4906355,21.7533537 L2.4906355,18.4969832 L4.87749452,18.4969832 C6.43414171,18.4969832 7.02715016,19.207464 7.02715016,20.0955651 C7.02715016,20.9836661 6.36001565,21.7533537 4.77371804,21.7533537 L2.4906355,21.7533537 Z M2.4906355,26.8007279 L2.4906355,23.3519355 L5.17399875,23.3519355 C6.84924763,23.3519355 7.56085777,24.1068214 7.56085777,25.0541292 C7.56085777,26.0606437 6.80477199,26.8007279 5.29260044,26.8007279 L2.4906355,26.8007279 Z\" id=\"Shape\"></path>\n                        <path d=\"M12.9424095,20.5396156 L11.1782093,20.5396156 L11.1782093,25.3945679 C11.1782093,27.2003734 12.1566733,28.6065333 14.1432516,28.6065333 C14.7659105,28.6065333 15.8036753,28.3993098 16.559761,27.3779936 L16.559761,28.4437148 L18.2794855,28.4437148 L18.2794855,20.5396156 L16.5152854,20.5396156 L16.5152854,24.9357157 C16.5152854,26.1346521 15.8036753,26.933943 14.6917844,26.933943 C13.4761171,26.933943 12.9424095,26.0902471 12.9424095,24.9653191 L12.9424095,20.5396156 Z\" id=\"Path\"></path>\n                        <path d=\"M20.1029865,24.4768635 C20.1029865,26.608306 21.7189346,28.5621283 24.0020171,28.5621283 C24.6395012,28.5621283 26.0330711,28.2364912 26.6557299,27.215175 L26.6557299,28.4437148 L28.3754545,28.4437148 L28.3754545,16.3951441 L26.6112543,16.3951441 L26.6112543,21.6645436 C26.0182459,20.7320375 24.7432777,20.3915987 24.0464928,20.3915987 C21.5706825,20.3915987 20.1029865,22.4934379 20.1029865,24.4768635 Z M26.6409047,24.4768635 C26.6409047,25.8386184 25.6920912,26.9635464 24.2688709,26.9635464 C22.8456506,26.9635464 21.8968371,25.8386184 21.8968371,24.4768635 C21.8968371,23.1151086 22.8308254,21.9753789 24.2688709,21.9753789 C25.6920912,21.9753789 26.6409047,23.1151086 26.6409047,24.4768635 Z\" id=\"Shape\"></path>\n                        <path d=\"M30.1989554,24.4768635 C30.1989554,26.608306 31.8149035,28.5621283 34.097986,28.5621283 C34.7354701,28.5621283 36.12904,28.2364912 36.7516988,27.215175 L36.7516988,28.4437148 L38.4714234,28.4437148 L38.4714234,16.3951441 L36.7072232,16.3951441 L36.7072232,21.6645436 C36.1142148,20.7320375 34.8392466,20.3915987 34.1424617,20.3915987 C31.6666514,20.3915987 30.1989554,22.4934379 30.1989554,24.4768635 Z M36.7368736,24.4768635 C36.7368736,25.8386184 35.7880601,26.9635464 34.3648398,26.9635464 C32.9416195,26.9635464 31.992806,25.8386184 31.992806,24.4768635 C31.992806,23.1151086 32.9267943,21.9753789 34.3648398,21.9753789 C35.7880601,21.9753789 36.7368736,23.1151086 36.7368736,24.4768635 Z\" id=\"Shape\"></path>\n                        <polygon id=\"Path\" points=\"44.3718575 25.720205 41.9108724 20.5396156 39.8946436 20.5396156 43.4230439 27.5556138 41.2437379 32.3365577 43.1265397 32.3365577 48.5673923 20.5396156 46.65494 20.5396156\"></polygon>\n                    </g>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>");
    }
    exports.default = badge;
});
define("statusIcons", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.failureIcon = exports.successIcon = void 0;
    var successIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <svg width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n      <title>icon_success 2</title>\n      <g id=\"icon_success\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n          <rect id=\"Spacer\" fill-opacity=\"0\" fill=\"#D8D8D8\" x=\"0\" y=\"0\" width=\"24\" height=\"24\"></rect>\n          <g id=\"Selection\" transform=\"translate(5.000000, 8.000000)\" stroke=\"#00E0A1\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\">\n              <line x1=\"0\" y1=\"9.83706583\" x2=\"5.13577848\" y2=\"14.9728443\" id=\"Line\"></line>\n              <line x1=\"14.6158961\" y1=\"0\" x2=\"5.13577848\" y2=\"14.9728443\" id=\"Line\"></line>\n          </g>\n      </g>\n  </svg>";
    exports.successIcon = successIcon;
    var failureIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <svg width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n      <title>icon_failure 2</title>\n      <g id=\"icon_failure\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n          <rect id=\"Spacer\" fill-opacity=\"0\" fill=\"#D8D8D8\" x=\"0\" y=\"0\" width=\"24\" height=\"24\"></rect>\n          <g id=\"Failure\" transform=\"translate(4.000000, 8.000000)\" stroke=\"#EF065B\" stroke-linecap=\"round\" stroke-width=\"2\">\n              <line x1=\"1\" y1=\"1\" x2=\"15\" y2=\"15\" id=\"Line\"></line>\n              <line x1=\"15\" y1=\"1\" x2=\"1\" y2=\"15\" id=\"Line\"></line>\n          </g>\n      </g>\n  </svg>";
    exports.failureIcon = failureIcon;
});
define("updateBadges", ["require", "exports", "octokit", "badge", "statusIcons"], function (require, exports, octokit_3, badge_1, statusIcons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateBadges(results) {
        return __awaiter(this, void 0, void 0, function () {
            var octokit, currentBranch, badgePath, badges;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (process.env.DISABLE_AUTOGRADING)
                            return [2 /*return*/];
                        octokit = (0, octokit_3.createOctokit)();
                        if (!octokit)
                            return [2 /*return*/];
                        currentBranch = process.env['GITHUB_REF_NAME'];
                        badgePath = ".github/badges/".concat(currentBranch, "/badge.svg");
                        badges = results.testResults.reduce(function (acc, testResult) {
                            var statusBadges = testResult.map(function (result, index) {
                                return { path: result.statusBadgePath, content: result.status === 'passed' ? statusIcons_1.successIcon : statusIcons_1.failureIcon, encoding: 'utf8' };
                            });
                            acc.push.apply(acc, statusBadges);
                            return acc;
                        }, []);
                        // add main badge
                        badges.push({ path: badgePath, content: (0, badge_1.default)(results.tasks), encoding: 'utf8' });
                        // update status badges
                        return [4 /*yield*/, octokit.commit(badges, 'badges', 'Update badges', true)];
                    case 1:
                        // update status badges
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.default = updateBadges;
});
define("recordResult", ["require", "exports", "https", "@sentry/node", "octokit", "./lib/helpers"], function (require, exports, https_1, Sentry, octokit_4, helpers_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function recordResult(points, result) {
        return __awaiter(this, void 0, void 0, function () {
            var runInfo, packageJson, updatedPackageJson, commits, templateRepoName, resultMessage, payload, octokit, branch, data, _a, sha, path, content, packageJsonString, repository, error_5, req;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        templateRepoName = '', resultMessage = {}, payload = '';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        octokit = (0, octokit_4.createOctokit)();
                        if (!octokit)
                            throw 'Octokit not initialized';
                        branch = process.env['GITHUB_REF_NAME'];
                        return [4 /*yield*/, octokit.rest.actions.getWorkflowRun({
                                owner: octokit_4.owner,
                                repo: octokit_4.repo,
                                run_id: process.env.GITHUB_RUN_ID,
                            })];
                    case 2:
                        data = (_b.sent()).data;
                        runInfo = data;
                        return [4 /*yield*/, octokit.rest.repos.getContent({
                                owner: octokit_4.owner,
                                repo: octokit_4.repo,
                                path: 'package.json',
                                ref: branch,
                            })];
                    case 3:
                        _a = (_b.sent()).data, sha = _a.sha, path = _a.path, content = _a.content;
                        packageJsonString = Buffer.from(content, 'base64').toString('utf8');
                        packageJson = JSON.parse(packageJsonString);
                        updatedPackageJson = JSON.parse(packageJsonString);
                        // make sure template repo url is in package.json
                        if (process.env.IS_ORIGINAL_TEMPLATE_REPO) {
                            // set repository
                            updatedPackageJson.repository = {
                                "type": "git",
                                "url": "https://github.com/".concat(process.env.GITHUB_REPOSITORY),
                                "id": runInfo ? runInfo.repository.id : ""
                            };
                        }
                        templateRepoName = updatedPackageJson.repository ? (0, helpers_2.repoNameFromUrl)(updatedPackageJson.repository.url) : '';
                        // remove preinstall script
                        delete updatedPackageJson.scripts.preinstall;
                        if (!(JSON.stringify(packageJson) !== JSON.stringify(updatedPackageJson))) return [3 /*break*/, 5];
                        return [4 /*yield*/, octokit.rest.repos.createOrUpdateFileContents({
                                owner: octokit_4.owner,
                                repo: octokit_4.repo,
                                path: path,
                                message: 'update package.json',
                                content: Buffer.from(JSON.stringify(updatedPackageJson, null, 2)).toString('base64'),
                                branch: branch,
                                sha: sha,
                            })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4 /*yield*/, octokit.rest.repos.get({
                            owner: octokit_4.owner,
                            repo: octokit_4.repo,
                        })];
                    case 6:
                        repository = (_b.sent()).data;
                        return [4 /*yield*/, octokit.rest.repos.listCommits({
                                owner: octokit_4.owner,
                                repo: octokit_4.repo,
                                sha: branch,
                            })];
                    case 7:
                        (commits = (_b.sent()).data);
                        commits = commits.filter(function (commit) { return !(commit.author && commit.author.login.includes('[bot]')); });
                        // NOTE: doesn't record when students accept but don't submit anything
                        // Another solution is needed to prevent recording when teachers create class template from main template
                        if (commits.length < 1 ||
                            (commits.length && commits[0].author && commits[0].author.login.includes('[bot]')) ||
                            (runInfo && runInfo.actor.login.includes('[bot]')) ||
                            process.env.IS_ORIGINAL_TEMPLATE_REPO ||
                            repository.is_template ||
                            repository.owner.type === 'User')
                            return [2 /*return*/]; // filter out runs on personal accounts
                        return [3 /*break*/, 9];
                    case 8:
                        error_5 = _b.sent();
                        Sentry.captureException(error_5);
                        console.log(error_5);
                        return [3 /*break*/, 9];
                    case 9:
                        try {
                            resultMessage = {
                                TIMESTAMP: runInfo && runInfo.run_started_at,
                                GITHUB_USER_NAME: runInfo && runInfo.actor.login,
                                GITHUB_USER_ID: runInfo && runInfo.actor.id,
                                GITHUB_USER_NODE_ID: runInfo && runInfo.actor.node_id,
                                GITHUB_USER_EMAIL: runInfo && runInfo.head_commit && runInfo.head_commit.author && runInfo.head_commit.author.email,
                                GITHUB_USER_AVATAR_URL: runInfo && runInfo.actor.avatar_url,
                                GITHUB_USER_HTML_URL: runInfo && runInfo.actor.html_url,
                                POINTS: points,
                                TEST_HAS_RUNTIME_ERRORS: result.numRuntimeErrorTestSuites > 0,
                                TEST_RUNTIME_ERRORS: result.runtimeError ? (0, helpers_2.removeTerminalColoring)(result.runtimeError.message).replace('●', '').replace('›', '').trim() : '',
                                INVOCATION_ID: process.env.INVOCATION_ID,
                                GITHUB_HEAD_BRANCH: runInfo && runInfo.head_branch,
                                GITHUB_HEAD_COMMIT_MESSAGE: runInfo && runInfo.head_commit.message,
                                GITHUB_REF: process.env.GITHUB_REF,
                                NUM_COMMITS: commits.length,
                                GITHUB_TEMPLATE_NAME: templateRepoName,
                                GITHUB_TEMPLATE_REPOSITORY_URL: packageJson.repository && packageJson.repository.url,
                                GITHUB_TEMPLATE_REPOSITORY_ID: packageJson.repository && packageJson.repository.id,
                                GITHUB_SHA: process.env.GITHUB_SHA,
                                GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
                                GITHUB_REPOSITORY_HTML_URL: runInfo && runInfo.repository.html_url,
                                GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER,
                                GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
                                GITHUB_RUN_ATTEMPT: runInfo && runInfo.run_attempt,
                                GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER,
                                GITHUB_RUN_HTML_URL: runInfo && runInfo.html_url,
                                GITHUB_RETENTION_DAYS: process.env.GITHUB_RETENTION_DAYS,
                                GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW,
                                GITHUB_WORKFLOW_ID: runInfo && runInfo.workflow_id,
                                GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME,
                                GITHUB_SERVER_URL: process.env.GITHUB_SERVER_URL,
                                GITHUB_API_URL: process.env.GITHUB_API_URL,
                                GITHUB_REF_NAME: process.env.GITHUB_REF_NAME,
                                GITHUB_REF_PROTECTED: process.env.GITHUB_REF_PROTECTED,
                                GITHUB_REF_TYPE: process.env.GITHUB_REF_TYPE,
                                GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE,
                                GITHUB_ACTION: process.env.GITHUB_ACTION,
                                GITHUB_ACTION_REPOSITORY: process.env.GITHUB_ACTION_REPOSITORY,
                                GITHUB_ACTION_REF: process.env.GITHUB_ACTION_REF,
                                GITHUB_ACTION_PATH: process.env.GITHUB_ACTION_PATH,
                                RUNNER_OS: process.env.RUNNER_OS,
                                RUNNER_ARCH: process.env.RUNNER_ARCH,
                                RUNNER_WORKSPACE: process.env.RUNNER_WORKSPACE,
                                TEST_RESULTS: result.testResults,
                                GITHUB_STUDENT_FACING_OUTPUT_ENABLED: !process.env.DISABLE_AUTOGRADING ? 'true' : 'false', // VARCHAR // converting to string as temporary fix because of wrong validation in API
                            };
                            payload = JSON.stringify(resultMessage);
                            // test JSON validity
                            JSON.parse(payload);
                        }
                        catch (error) {
                            Sentry.captureException(error);
                        }
                        // send webhook event
                        try {
                            req = https_1.default.request({
                                hostname: 'autograding-results.dci.education',
                                port: 443,
                                path: '/api/v1/data',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Content-Length': payload.length
                                }
                            });
                            req.on('error', function (error) {
                                throw error;
                            });
                            req.write(payload);
                            req.end();
                        }
                        catch (error) {
                            Sentry.captureException(error);
                            console.log(error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.default = recordResult;
});
define("getVisualRegressionResult", ["require", "exports", "fs", "path", "octokit"], function (require, exports, fs_1, path_1, octokit_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getVisualReressionResult() {
        return __awaiter(this, void 0, void 0, function () {
            var octokit, dir, images, files, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (process.env.DISABLE_AUTOGRADING)
                            return [2 /*return*/];
                        octokit = (0, octokit_5.createOctokit)();
                        if (!octokit)
                            return [2 /*return*/];
                        dir = path_1.default.join(process.env.GITHUB_WORKSPACE, '__tests__', '__image_snapshots__', '__diff_output__');
                        images = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        files = fs_1.default.readdirSync(dir);
                        // TODO: upload all images from __image_snapshots__ recursively
                        files.forEach(function (file) {
                            var data = fs_1.default.readFileSync(path_1.default.join(dir, file), 'binary');
                            var buffer = Buffer.from(data, 'binary');
                            var content = buffer.toString('base64');
                            // TODO: better folder name
                            images.push({ path: ".github/visual-regression-diffs/".concat(file), content: content, encoding: 'base64' });
                        });
                        return [4 /*yield*/, octokit.commit(images, 'badges', 'upload regression diffs', true)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    exports.default = getVisualReressionResult;
});
define("runner", ["require", "exports", "child_process", "tree-kill", "uuid", "@actions/core", "output", "os", "chalk", "fs", "@sentry/node", "modifyReadme", "updateBadges", "recordResult", "getVisualRegressionResult", "./lib/extractJSON", "./lib/helpers"], function (require, exports, child_process_1, tree_kill_1, uuid_1, core, output_1, os, chalk_1, fs_2, Sentry, modifyReadme_1, updateBadges_1, recordResult_1, getVisualRegressionResult_1, extractJSON_1, helpers_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runAll = exports.run = exports.TestOutputError = exports.TestTimeoutError = exports.TestError = void 0;
    var currentBranch = process.env['GITHUB_REF_NAME'];
    var color = new chalk_1.default.Instance({ level: 1 });
    var taskNamePattern = 'task(s)?(\.(.*))?\.js';
    var setupError = '';
    var TestError = /** @class */ (function (_super) {
        __extends(TestError, _super);
        function TestError(message) {
            var _this = _super.call(this, message) || this;
            Error.captureStackTrace(_this, TestError);
            return _this;
        }
        return TestError;
    }(Error));
    exports.TestError = TestError;
    var TestTimeoutError = /** @class */ (function (_super) {
        __extends(TestTimeoutError, _super);
        function TestTimeoutError(message) {
            var _this = _super.call(this, message) || this;
            Error.captureStackTrace(_this, TestTimeoutError);
            return _this;
        }
        return TestTimeoutError;
    }(TestError));
    exports.TestTimeoutError = TestTimeoutError;
    var TestOutputError = /** @class */ (function (_super) {
        __extends(TestOutputError, _super);
        function TestOutputError(message, expected, actual) {
            var _this = _super.call(this, "".concat(message, "\nExpected:\n").concat(expected, "\nActual:\n").concat(actual)) || this;
            _this.expected = expected;
            _this.actual = actual;
            Error.captureStackTrace(_this, TestOutputError);
            return _this;
        }
        return TestOutputError;
    }(TestError));
    exports.TestOutputError = TestOutputError;
    var log = function (text) {
        process.stdout.write(text + os.EOL);
    };
    var normalizeLineEndings = function (text) {
        return text.replace(/\r\n/gi, '\n').trim();
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var indent = function (text) {
        var str = '' + new String(text.toString('utf8'));
        str = str.replace(/\r\n/gim, '\n').replace(/\n/gim, '\n  ');
        return str;
    };
    var getResultObject = function (outputString) {
        var file;
        try {
            file = fs_2.default.readFileSync('./testResults.json', { encoding: 'utf8' });
            file = (0, helpers_3.removeTerminalColoring)(file).replace('●', '').replace('›', '');
            file = JSON.parse(file);
        }
        catch (error) {
            console.error(error);
        }
        if (file)
            return file;
        //console.log('output:', outputString)
        var cleanedString = (0, helpers_3.removeTerminalColoring)(outputString).replace('●', '').replace('›', '');
        var resultObj = (0, extractJSON_1.default)(cleanedString);
        return resultObj;
    };
    var waitForExit = function (child, timeout) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // eslint-disable-next-line no-undef
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var timedOut = false;
                    var exitTimeout = setTimeout(function () {
                        timedOut = true;
                        reject(new TestTimeoutError("Setup timed out in ".concat(timeout, " milliseconds")));
                        (0, tree_kill_1.default)(child.pid);
                    }, timeout);
                    child.once('exit', function (code, signal) {
                        if (timedOut)
                            return;
                        clearTimeout(exitTimeout);
                        if (code === 0) {
                            resolve(undefined);
                        }
                        else {
                            reject(new TestError("Error: Exit with code: ".concat(code, " and signal: ").concat(signal)));
                        }
                    });
                    child.once('error', function (error) {
                        if (timedOut)
                            return;
                        clearTimeout(exitTimeout);
                        reject(error);
                    });
                })];
        });
    }); };
    var runSetup = function (test, cwd, timeout) { return __awaiter(void 0, void 0, void 0, function () {
        var setup;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!test.setup || test.setup === '') {
                        return [2 /*return*/];
                    }
                    setup = (0, child_process_1.spawn)(test.setup, {
                        cwd: cwd,
                        shell: true,
                        env: {
                            PATH: process.env['PATH'],
                            FORCE_COLOR: 'true',
                        },
                    });
                    // Start with a single new line
                    process.stdout.write(indent('\n'));
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setup.stdout.on('data', function (chunk) {
                        process.stdout.write(indent(chunk));
                    });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setup.stderr.on('data', function (chunk) {
                        process.stderr.write(indent(chunk));
                        setupError += indent(chunk);
                    });
                    setup.once('exit', function (code) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (code === 0)
                                return [2 /*return*/];
                            Sentry.captureMessage(setupError);
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, waitForExit(setup, timeout)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var runCommand = function (test, cwd, timeout) { return __awaiter(void 0, void 0, void 0, function () {
        var output, child, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    child = (0, child_process_1.spawn)(test.run, {
                        cwd: cwd,
                        shell: true,
                        env: {
                            PATH: process.env['PATH'],
                            FORCE_COLOR: 'true',
                        },
                    });
                    // Start with a single new line
                    process.stdout.write(indent('\n'));
                    child.stdout.on('data', function (chunk) {
                        output += chunk.toString('utf8');
                    });
                    child.stderr.on('data', function (chunk) {
                        process.stderr.write(indent(chunk));
                    });
                    return [4 /*yield*/, waitForExit(child, timeout)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, getResultObject(output)];
                case 3:
                    error_7 = _a.sent();
                    error_7.result = getResultObject(output);
                    throw error_7;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var run = function (test, cwd) { return __awaiter(void 0, void 0, void 0, function () {
        var timeout, start, elapsed, result, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = (test.timeout || 1) * 60 * 1000 || 30000;
                    start = process.hrtime();
                    return [4 /*yield*/, runSetup(test, cwd, timeout)];
                case 1:
                    _a.sent();
                    elapsed = process.hrtime(start);
                    // Subtract the elapsed seconds (0) and nanoseconds (1) to find the remaining timeout
                    timeout -= Math.floor(elapsed[0] * 1000 + elapsed[1] / 1000000);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, runCommand(test, cwd, timeout)];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    error_8 = _a.sent();
                    throw error_8;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    exports.run = run;
    var runAll = function (cwd, packageJsonPath) { return __awaiter(void 0, void 0, void 0, function () {
        var points, availablePoints, result, packageJson, additionalSetup, testOpts, jestMaxWorkers, test, token, failed, error_9, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    points = 0;
                    availablePoints = 100;
                    packageJson = fs_2.default.readFileSync(packageJsonPath);
                    packageJson = Buffer.from(packageJson, 'base64').toString('utf8');
                    try {
                        packageJson = JSON.parse(packageJson);
                    }
                    catch (error) {
                        console.log('Error: faulty package.json');
                    }
                    additionalSetup = packageJson.autograding && packageJson.autograding.setup;
                    testOpts = packageJson.autograding && packageJson.autograding.testOpts;
                    jestMaxWorkers = packageJson.scripts && packageJson.scripts.test && !packageJson.scripts.test.includes('--runInBand') ? ' --maxWorkers=2' : '';
                    test = {
                        "name": "Tasks",
                        "setup": "npm install --ignore-scripts".concat(additionalSetup ? ' && ' + additionalSetup : ''),
                        "run": "CI=true npm test -- \"(src/)?__tests__/".concat(taskNamePattern, "\"").concat(testOpts ? ' ' + testOpts : '', " --json --outputFile=testResults.json").concat(jestMaxWorkers, " --silent"),
                        "timeout": 10
                    };
                    token = (0, uuid_1.v4)();
                    log('');
                    log("::stop-commands::".concat(token));
                    log('');
                    failed = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log(color.cyan("\uD83D\uDCDD ".concat(test.name)));
                    log('');
                    return [4 /*yield*/, (0, exports.run)(test, cwd)];
                case 2:
                    result = _a.sent();
                    log('');
                    log(color.green("\u2705 ".concat(test.name)));
                    log("");
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    failed = true;
                    log('');
                    log(color.red("\u274C ".concat(test.name)));
                    result = error_9.result;
                    if (!process.env.DISABLE_AUTOGRADING) {
                        // if output is disabled we also don't display fail to students
                        core.setFailed(error_9.message);
                    }
                    return [3 /*break*/, 4];
                case 4:
                    // Report bug as issue
                    if (result.numRuntimeErrorTestSuites > 0) {
                        Sentry.captureMessage((0, helpers_3.removeTerminalColoring)(result.testResults[0].message));
                        result.runtimeError = result.testResults[0];
                    }
                    // sort results by filename
                    try {
                        result.testResults.sort(function (a, b) {
                            var nameA = a.name.toLowerCase();
                            var nameB = b.name.toLowerCase();
                            // check for numbering in file names
                            var numA = parseInt(nameA.match(taskNamePattern)[3]);
                            var numB = parseInt(nameB.match(taskNamePattern)[3]);
                            if (!isNaN(numA) && !isNaN(numB)) {
                                // sort by number
                                if (numA < numB)
                                    return -1;
                                if (numA > numB)
                                    return 1;
                            }
                            else {
                                // sort by name
                                if (nameA < nameB)
                                    return -1;
                                if (nameA > nameB)
                                    return 1;
                            }
                            return 0;
                        });
                    }
                    catch (error) {
                        console.error(error);
                        console.log('result:', JSON.stringify(result, null, 2));
                    }
                    // group results
                    result.testResults = result.testResults.reduce(function (acc, item) {
                        acc.push.apply(acc, item.assertionResults);
                        return acc;
                    }, []).reduce(function (acc, item, index) {
                        item.statusBadgePath = ".github/badges/".concat(currentBranch, "/status").concat(index, ".svg");
                        var arr = acc.find(function (i) { return i[0].ancestorTitles[0] == item.ancestorTitles[0]; });
                        if (arr) {
                            arr.push(item);
                        }
                        else {
                            arr = [item];
                            acc.push(arr);
                        }
                        return acc;
                    }, []);
                    // calculate tasks
                    result.tasks = {
                        total: result.testResults.length,
                        completed: result.testResults.filter(function (testResult) {
                            return !testResult.find(function (result) { return result.status !== 'passed'; });
                        }).length
                    };
                    points = Math.round(result.testResults.reduce(function (acc, item) {
                        var pointsPerTest = 100 / result.tasks.total / item.length;
                        return acc + item.reduce(function (accc, result) {
                            return accc + (result.status === 'passed' ? pointsPerTest : 0);
                        }, 0);
                    }, 0));
                    // Restart command processing
                    log('');
                    log("::".concat(token, "::"));
                    if (failed) {
                        // We need a good failure experience
                    }
                    else {
                        log('');
                        log(color.green('All tasks completed'));
                        log('');
                        log('✨🌟💖💎🦄💎💖🌟✨🌟💖💎🦄💎💖🌟✨');
                        log('');
                    }
                    text = "Tasks ".concat(result.tasks.completed, "/").concat(result.tasks.total);
                    log(color.bold.bgCyan.black(text));
                    return [4 /*yield*/, Promise.all([(0, modifyReadme_1.default)(result, packageJson), (0, updateBadges_1.default)(result)])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, recordResult_1.default)(points, result)];
                case 6:
                    _a.sent();
                    core.setOutput('Points', "".concat(points, "/").concat(availablePoints));
                    return [4 /*yield*/, (0, output_1.setCheckRunOutput)(points, availablePoints, result)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, getVisualRegressionResult_1.default)()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    exports.runAll = runAll;
});
define(".secrets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sentryDSN = void 0;
    // @ts-nocheck
    var sentryDSN = "https://63226014641840099080bb343c343a19@o1264169.ingest.sentry.io/6446683";
    exports.sentryDSN = sentryDSN;
});
// @ts-nocheck
define("autograding", ["require", "exports", "@actions/core", "path", "@sentry/node", "@sentry/integrations", "runner", "octokit", ".secrets"], function (require, exports, core, path_2, Sentry, integrations_1, runner_1, octokit_6, _secrets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Sentry.init({
        dsn: _secrets_1.sentryDSN,
        tracesSampleRate: 1.0,
        integrations: [
            new integrations_1.RewriteFrames({
                root: global.__dirname,
            }),
        ],
    });
    var run = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cwd, branch, error_10, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cwd = process.env['GITHUB_WORKSPACE'];
                    if (!cwd) {
                        throw new Error('No GITHUB_WORKSPACE');
                    }
                    branch = process.env['GITHUB_REF_NAME'];
                    // check if running on exercise collection org
                    if (octokit_6.owner === 'DigitalCareerInstitute' || octokit_6.owner === 'DCI-Webdev' || octokit_6.owner === 'FBW-Demo-Org') {
                        process.env.IS_ORIGINAL_TEMPLATE_REPO = true;
                        if (branch == 'main' ||
                            branch == 'solution' ||
                            branch == 'master' ||
                            branch == 'autotranslate') {
                            console.log('disable Autograding output');
                            process.env.DISABLE_AUTOGRADING = true;
                        }
                    }
                    return [4 /*yield*/, (0, runner_1.runAll)(cwd, path_2.default.resolve(cwd, 'package.json'))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    // If there is any error we'll fail the action with the error message
                    if (!process.env.DISABLE_AUTOGRADING) {
                        errorMessage = "Failed";
                        if (error_10 instanceof Error) {
                            errorMessage = error_10.message;
                        }
                        console.error(errorMessage);
                        core.setFailed("Autograding failure: ".concat(error_10));
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Don't auto-execute in the test environment
    if (process.env['NODE_ENV'] !== 'test') {
        run();
    }
    exports.default = run;
});
