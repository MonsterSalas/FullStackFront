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
// https://sonarsource.github.io/rspec/#/rspec/S4138/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = decorate;
const helpers_1 = require("../helpers");
const meta_1 = require("./meta");
const element = 'element';
// core implementation of this rule does not provide quick fixes
function decorate(rule) {
    return (0, helpers_1.interceptReport)({
        ...rule,
        meta: (0, helpers_1.generateMeta)(meta_1.meta, {
            ...rule.meta,
            hasSuggestions: true,
        }),
    }, (context, reportDescriptor) => {
        const forStmt = reportDescriptor.node;
        const suggest = [];
        if (isFixable(context.sourceCode.getScope(forStmt))) {
            suggest.push({
                desc: 'Replace with "for of" loop',
                fix: fixer => rewriteForStatement(forStmt, context, fixer),
            });
        }
        context.report({
            ...reportDescriptor,
            suggest,
        });
    });
}
function isFixable(scope) {
    return (scope.references.every(reference => reference.identifier.name !== element) &&
        scope.childScopes.every(isFixable));
}
function rewriteForStatement(forStmt, context, fixer) {
    const fixes = [];
    /* rewrite `for` header: `(init; test; update)` -> `(const element of <array>) ` */
    const openingParenthesis = context.sourceCode.getFirstToken(forStmt, token => token.value === '(');
    const closingParenthesis = context.sourceCode.getTokenBefore(forStmt.body, token => token.value === ')');
    const arrayExpr = extractArrayExpression(forStmt);
    const arrayText = context.sourceCode.getText(arrayExpr);
    const headerRange = [openingParenthesis.range[1], closingParenthesis.range[0]];
    const headerText = `const ${element} of ${arrayText}`;
    fixes.push(fixer.replaceTextRange(headerRange, headerText));
    /* rewrite `for` body: `<array>[<index>]` -> `element` */
    const [indexVar] = context.sourceCode.getDeclaredVariables(forStmt.init);
    for (const reference of indexVar.references) {
        const id = reference.identifier;
        if (contains(forStmt.body, id)) {
            const arrayAccess = id.parent;
            fixes.push(fixer.replaceText(arrayAccess, element));
        }
    }
    return fixes;
}
function extractArrayExpression(forStmt) {
    return forStmt.test.right.object;
}
function contains(outer, inner) {
    return outer.range[0] <= inner.range[0] && outer.range[1] >= inner.range[1];
}
//# sourceMappingURL=decorator.js.map