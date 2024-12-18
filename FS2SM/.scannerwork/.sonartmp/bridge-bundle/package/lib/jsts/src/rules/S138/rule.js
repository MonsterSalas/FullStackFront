"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// Greatly inspired by https://github.com/eslint/eslint/blob/561b6d4726f3e77dd40ba0d340ca7f08429cd2eb/lib/rules/max-lines-per-function.js
// We had to fork the implementation to control the reporting (issue location), in order to provide a better user experience.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.getLocsNumber = getLocsNumber;
exports.getCommentLineNumbers = getCommentLineNumbers;
const helpers_1 = require("../helpers");
const meta_1 = require("./meta");
const DEFAULT = 200;
const messages = {
    functionMaxLine: 'This function has {{lineCount}} lines, which is greater than the {{threshold}} lines authorized. Split it into smaller functions.',
};
exports.rule = {
    meta: (0, helpers_1.generateMeta)(meta_1.meta, { messages, schema: meta_1.schema }),
    create(context) {
        const threshold = context.options[0]?.maximum ?? DEFAULT;
        const sourceCode = context.sourceCode;
        const lines = sourceCode.lines;
        const commentLineNumbers = getCommentLineNumbers(sourceCode.getAllComments());
        const functionStack = [];
        const functionKnowledge = new Map();
        return {
            'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression': (node) => {
                functionStack.push(node);
                const parent = (0, helpers_1.getParent)(context, node);
                if (!node.loc || isIIFE(node, parent)) {
                    return;
                }
                const lineCount = getLocsNumber(node.loc, lines, commentLineNumbers);
                const startsWithCapital = nameStartsWithCapital(node);
                functionKnowledge.set(node, { node, lineCount, startsWithCapital, returnsJSX: false });
            },
            ReturnStatement: (node) => {
                const returnStatement = node;
                const knowledge = functionKnowledge.get((0, helpers_1.last)(functionStack));
                if (knowledge &&
                    returnStatement.argument &&
                    returnStatement.argument.type.startsWith('JSX')) {
                    knowledge.returnsJSX = true;
                }
            },
            'FunctionDeclaration:exit': () => {
                functionStack.pop();
            },
            'FunctionExpression:exit': () => {
                functionStack.pop();
            },
            'ArrowFunctionExpression:exit': () => {
                functionStack.pop();
            },
            'Program:exit': () => {
                for (const knowledge of functionKnowledge.values()) {
                    const { node, lineCount } = knowledge;
                    if (lineCount > threshold && !isReactFunctionComponent(knowledge)) {
                        const functionLike = node;
                        context.report({
                            messageId: 'functionMaxLine',
                            data: {
                                lineCount: lineCount.toString(),
                                threshold: `${threshold}`,
                            },
                            loc: (0, helpers_1.getMainFunctionTokenLocation)(functionLike, functionLike.parent, context),
                        });
                    }
                }
            },
        };
    },
};
function getLocsNumber(loc, lines, commentLineNumbers) {
    let lineCount = 0;
    for (let i = loc.start.line - 1; i < loc.end.line; ++i) {
        const line = lines[i];
        const comment = commentLineNumbers.get(i + 1);
        if (comment && isFullLineComment(line, i + 1, comment)) {
            continue;
        }
        if (line.match(/^\s*$/u)) {
            continue;
        }
        lineCount++;
    }
    return lineCount;
}
function getCommentLineNumbers(comments) {
    const map = new Map();
    comments.forEach(comment => {
        if (comment.loc) {
            for (let i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
                map.set(i, comment);
            }
        }
    });
    return map;
}
function isFullLineComment(line, lineNumber, comment) {
    if (!comment.loc) {
        return false;
    }
    const { start, end } = comment.loc;
    const isFirstTokenOnLine = start.line === lineNumber && !line.slice(0, start.column).trim();
    const isLastTokenOnLine = end.line === lineNumber && !line.slice(end.column).trim();
    return (comment &&
        (start.line < lineNumber || isFirstTokenOnLine) &&
        (end.line > lineNumber || isLastTokenOnLine));
}
function isIIFE(node, parent) {
    return (node.type === 'FunctionExpression' &&
        parent &&
        parent.type === 'CallExpression' &&
        parent.callee === node);
}
function isReactFunctionComponent(knowledge) {
    return knowledge.startsWithCapital && knowledge.returnsJSX;
}
function nameStartsWithCapital(node) {
    const identifier = getIdentifierFromNormalFunction(node) ?? getIdentifierFromArrowFunction(node);
    if (!identifier) {
        return false;
    }
    return isIdentifierUppercase(identifier);
    /**
     * Picks `Foo` from: `let Foo = () => {}`
     */
    function getIdentifierFromArrowFunction(node) {
        if (node.type !== 'ArrowFunctionExpression') {
            return null;
        }
        const parent = (0, helpers_1.getNodeParent)(node);
        if (!parent) {
            return null;
        }
        if (parent.type === 'VariableDeclarator') {
            return parent.id;
        }
        else {
            return null;
        }
    }
    /**
     * Picks `Foo` from:
     * - `function Foo() {}`
     * - `let bar = function Foo() {}`
     */
    function getIdentifierFromNormalFunction(node) {
        if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
            return node.id;
        }
    }
    function isIdentifierUppercase(node) {
        return node.name.startsWith(node.name[0].toUpperCase());
    }
}
//# sourceMappingURL=rule.js.map